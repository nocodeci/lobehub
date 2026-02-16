import { NextRequest, NextResponse } from 'next/server';
import connectPool from '@/lib/connect-db';
import {
    emailNewSubscription,
    emailSubscriptionRenewed,
    emailSubscriptionCancelled,
    emailPaymentFailed,
    emailAutoDowngrade,
} from '@/lib/mailer';

// Track which subscription changes we've already notified about
let lastSubCheckTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();

// Track users with payment_failed status so we can auto-downgrade after 3 days
// key = userId, value = { detectedAt, plan, email, fullName, notified }
const paymentFailedUsers: Map<string, {
    detectedAt: Date;
    plan: string;
    email: string;
    fullName: string;
    notified: boolean;
}> = new Map();

export async function GET() {
    const results: { event: string; details: string; sent: boolean }[] = [];
    const checkStart = new Date().toISOString();

    try {
        const client = await connectPool.connect();

        try {
            // ═══════════════════════════════════════════════
            // 1. DETECT SUBSCRIPTION CHANGES
            // Read user_settings.general for subscription data
            // ═══════════════════════════════════════════════
            const subRes = await client.query(`
                SELECT 
                    us.id as user_id,
                    us.general,
                    u.email,
                    u.full_name,
                    u.username
                FROM user_settings us
                JOIN users u ON u.id = us.id
                WHERE us.general IS NOT NULL
            `);

            for (const row of subRes.rows) {
                const general = row.general || {};
                const sub = general.subscription || {};
                const plan = general.subscriptionPlan || sub.plan || 'free';
                const status = sub.status;
                const user = { email: row.email, fullName: row.full_name || row.username || '' };

                if (!status) continue;

                // New subscription (active, plan != free)
                if (status === 'active' && plan !== 'free') {
                    // Check if this was a renewal or new subscription
                    // If the user already had this plan before lastCheckTime, it's a renewal
                    const prevRes = await client.query(`
                        SELECT general FROM user_settings WHERE id = $1
                    `, [row.user_id]);

                    const prevGeneral = prevRes.rows[0]?.general || {};
                    const prevPlan = prevGeneral.subscriptionPlan || 'free';
                    const prevStatus = prevGeneral.subscription?.status;

                    if (prevStatus === 'past_due' || prevStatus === 'unpaid') {
                        // Was past_due, now active = renewed
                        await emailSubscriptionRenewed(user, plan);
                        results.push({ event: 'subscription_renewed', details: `${user.email} — ${plan}`, sent: true });

                        // Remove from payment failed tracking
                        paymentFailedUsers.delete(row.user_id);
                    } else if (prevPlan === 'free' || !prevPlan) {
                        // Was free, now paid = new subscription
                        await emailNewSubscription(user, plan);
                        results.push({ event: 'new_subscription', details: `${user.email} — ${plan}`, sent: true });
                    } else if (prevPlan !== plan) {
                        // Plan changed (upgrade/downgrade)
                        await emailNewSubscription(user, plan);
                        results.push({ event: 'plan_changed', details: `${user.email} — ${prevPlan} → ${plan}`, sent: true });
                    }
                }

                // Subscription cancelled
                if (status === 'canceled' || status === 'cancelled') {
                    const cancelledPlan = plan !== 'free' ? plan : (sub.previousPlan || 'starter');
                    await emailSubscriptionCancelled(user, cancelledPlan);
                    results.push({ event: 'subscription_cancelled', details: `${user.email} — ${cancelledPlan}`, sent: true });
                }

                // Payment failed
                if (status === 'past_due' || status === 'unpaid') {
                    if (!paymentFailedUsers.has(row.user_id)) {
                        await emailPaymentFailed(user, plan);
                        paymentFailedUsers.set(row.user_id, {
                            detectedAt: new Date(),
                            plan,
                            email: row.email,
                            fullName: user.fullName,
                            notified: true,
                        });
                        results.push({ event: 'payment_failed', details: `${user.email} — ${plan}`, sent: true });
                    }
                }
            }

            // ═══════════════════════════════════════════════
            // 2. AUTO-DOWNGRADE AFTER 3 DAYS OF UNPAID
            // ═══════════════════════════════════════════════
            const now = new Date();
            const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

            for (const [userId, data] of paymentFailedUsers.entries()) {
                const elapsed = now.getTime() - data.detectedAt.getTime();

                if (elapsed >= THREE_DAYS_MS) {
                    // Downgrade to free
                    try {
                        await client.query(`
                            UPDATE user_settings 
                            SET general = jsonb_set(
                                jsonb_set(
                                    COALESCE(general, '{}')::jsonb,
                                    '{subscriptionPlan}', '"free"'
                                ),
                                '{subscription,status}', '"canceled"'
                            )
                            WHERE id = $1
                        `, [userId]);

                        await emailAutoDowngrade(
                            { email: data.email, fullName: data.fullName },
                            data.plan
                        );

                        results.push({
                            event: 'auto_downgrade',
                            details: `${data.email} — ${data.plan} → free (3j écoulés)`,
                            sent: true,
                        });

                        console.log(`⬇️ Auto-downgraded user ${data.email} from ${data.plan} to free`);
                    } catch (err: any) {
                        console.error(`Failed to auto-downgrade ${data.email}:`, err.message);
                        results.push({ event: 'auto_downgrade_error', details: err.message, sent: false });
                    }

                    // Remove from tracking
                    paymentFailedUsers.delete(userId);
                }
            }

            // ═══════════════════════════════════════════════
            // 3. SUBSCRIPTION SUMMARY STATS
            // ═══════════════════════════════════════════════
            const statsRes = await client.query(`
                SELECT 
                    COALESCE(general->>'subscriptionPlan', 'free') as plan,
                    COALESCE(general->'subscription'->>'status', 'none') as status,
                    COUNT(*) as count
                FROM user_settings
                WHERE general IS NOT NULL
                GROUP BY plan, status
                ORDER BY count DESC
            `);

            const subscriptionStats = statsRes.rows.map(r => ({
                plan: r.plan,
                status: r.status,
                count: parseInt(r.count),
            }));

            // Pending downgrades
            const pendingDowngrades = Array.from(paymentFailedUsers.entries()).map(([userId, data]) => ({
                userId,
                email: data.email,
                fullName: data.fullName,
                plan: data.plan,
                detectedAt: data.detectedAt.toISOString(),
                daysLeft: Math.max(0, 3 - Math.floor((now.getTime() - data.detectedAt.getTime()) / (24 * 60 * 60 * 1000))),
            }));

            return NextResponse.json({
                success: true,
                checkedAt: checkStart,
                notifications: results,
                stats: subscriptionStats,
                pendingDowngrades,
                summary: {
                    totalEvents: results.length,
                    emailsSent: results.filter(r => r.sent).length,
                    pendingDowngradeCount: pendingDowngrades.length,
                },
            });
        } finally {
            client.release();
        }

        lastSubCheckTime = checkStart;
    } catch (error: any) {
        console.error('Subscription check error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
