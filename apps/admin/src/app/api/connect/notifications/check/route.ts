import { NextRequest, NextResponse } from 'next/server';
import connectPool from '@/lib/connect-db';
import {
    emailNewUser,
    emailNewBYOKKey,
    emailKeyFailure,
    emailAIError,
    emailAgentPublished,
    emailBridgeDown,
    emailBridgeBackOnline,
    emailNewSubscription,
    emailSubscriptionRenewed,
    emailSubscriptionCancelled,
    emailPaymentFailed,
    emailAutoDowngrade,
} from '@/lib/mailer';

// In-memory state to track what we've already notified about
let lastCheckTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();
let bridgeWasDown = false;

// Track users with failed payments for auto-downgrade after 3 days
const paymentFailedUsers: Map<string, {
    detectedAt: Date;
    plan: string;
    email: string;
    fullName: string;
}> = new Map();

// Track known subscription states to detect changes
const knownSubStates: Map<string, { plan: string; status: string }> = new Map();

const WHATSAPP_BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || 'https://whatsapp-bridge.onrender.com';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
    const results: { event: string; count: number; sent: boolean; details?: string }[] = [];
    const checkStart = new Date().toISOString();

    try {
        const client = await connectPool.connect();

        try {
            // ═══════════════════════════════════════════════
            // 1. NEW USER SIGNUPS
            // ═══════════════════════════════════════════════
            const newUsersRes = await client.query(`
                SELECT id, email, full_name, username, created_at
                FROM users
                WHERE created_at > $1
                ORDER BY created_at ASC
            `, [lastCheckTime]);

            if (newUsersRes.rows.length > 0) {
                for (const user of newUsersRes.rows) {
                    const sent = await emailNewUser({
                        email: user.email,
                        fullName: user.full_name || user.username || '',
                        createdAt: user.created_at,
                    });
                    results.push({
                        event: 'new_user',
                        count: 1,
                        sent,
                        details: user.email,
                    });
                }
            }

            // ═══════════════════════════════════════════════
            // 2. NEW BYOK KEYS ADDED
            // ═══════════════════════════════════════════════
            const newKeysRes = await client.query(`
                SELECT ap.id as provider_id, ap.name as provider_name, ap.user_id, ap.updated_at,
                       u.email, u.full_name, u.username
                FROM ai_providers ap
                JOIN users u ON u.id = ap.user_id
                WHERE ap.key_vaults IS NOT NULL AND ap.key_vaults != ''
                AND ap.updated_at > $1
                ORDER BY ap.updated_at ASC
            `, [lastCheckTime]);

            if (newKeysRes.rows.length > 0) {
                for (const row of newKeysRes.rows) {
                    const sent = await emailNewBYOKKey(
                        { email: row.email, fullName: row.full_name || row.username || '' },
                        row.provider_name || row.provider_id
                    );
                    results.push({
                        event: 'byok_key_added',
                        count: 1,
                        sent,
                        details: `${row.email} → ${row.provider_name || row.provider_id}`,
                    });
                }
            }

            // ═══════════════════════════════════════════════
            // 3. API KEY FAILURES (auth errors in messages)
            // ═══════════════════════════════════════════════
            const keyFailuresRes = await client.query(`
                SELECT DISTINCT ON (m.provider, m.user_id)
                    m.provider, m.model, m.error, m.created_at,
                    u.email, u.full_name, u.username
                FROM messages m
                JOIN users u ON u.id = m.user_id
                WHERE m.error IS NOT NULL AND m.error::text != 'null'
                AND m.created_at > $1
                AND (
                    m.error::text ILIKE '%auth%'
                    OR m.error::text ILIKE '%api_key%'
                    OR m.error::text ILIKE '%apikey%'
                    OR m.error::text ILIKE '%invalid.*key%'
                    OR m.error::text ILIKE '%unauthorized%'
                    OR m.error::text ILIKE '%permission%denied%'
                    OR m.error::text ILIKE '%quota%exceeded%'
                    OR m.error::text ILIKE '%rate_limit%'
                    OR m.error::text ILIKE '%insufficient_quota%'
                    OR m.error::text ILIKE '%billing%'
                )
                ORDER BY m.provider, m.user_id, m.created_at DESC
            `, [lastCheckTime]);

            if (keyFailuresRes.rows.length > 0) {
                for (const row of keyFailuresRes.rows) {
                    const errorMsg = typeof row.error === 'object'
                        ? (row.error?.message || row.error?.body?.message || JSON.stringify(row.error).slice(0, 100))
                        : String(row.error).slice(0, 100);

                    const sent = await emailKeyFailure(
                        { email: row.email, fullName: row.full_name || row.username || '' },
                        row.provider || 'unknown',
                        row.model || 'unknown',
                        errorMsg
                    );
                    results.push({
                        event: 'key_failure',
                        count: 1,
                        sent,
                        details: `${row.email} - ${row.provider}: ${errorMsg.slice(0, 60)}`,
                    });
                }
            }

            // ═══════════════════════════════════════════════
            // 4. AI ERRORS (non-auth, general failures)
            // ═══════════════════════════════════════════════
            const aiErrorsRes = await client.query(`
                SELECT 
                    m.provider, m.model, m.error, m.created_at,
                    u.email
                FROM messages m
                JOIN users u ON u.id = m.user_id
                WHERE m.error IS NOT NULL AND m.error::text != 'null'
                AND m.created_at > $1
                AND NOT (
                    m.error::text ILIKE '%auth%'
                    OR m.error::text ILIKE '%api_key%'
                    OR m.error::text ILIKE '%unauthorized%'
                )
                ORDER BY m.created_at DESC
                LIMIT 20
            `, [lastCheckTime]);

            if (aiErrorsRes.rows.length >= 3) {
                const topErrors = aiErrorsRes.rows.slice(0, 5).map((r: any) => ({
                    provider: r.provider || 'unknown',
                    model: r.model || 'unknown',
                    errorMsg: typeof r.error === 'object'
                        ? (r.error?.message || r.error?.type || JSON.stringify(r.error).slice(0, 80))
                        : String(r.error).slice(0, 80),
                    userEmail: r.email,
                }));

                const sent = await emailAIError(aiErrorsRes.rows.length, topErrors);
                results.push({
                    event: 'ai_errors',
                    count: aiErrorsRes.rows.length,
                    sent,
                    details: `${aiErrorsRes.rows.length} erreurs IA`,
                });
            }

            // ═══════════════════════════════════════════════
            // 5. NEW AGENTS CREATED
            // ═══════════════════════════════════════════════
            const newAgentsRes = await client.query(`
                SELECT a.id, a.title, a.model, a.provider, a.created_at,
                       u.email, u.full_name, u.username
                FROM agents a
                JOIN users u ON u.id = a.user_id
                WHERE a.created_at > $1
                ORDER BY a.created_at ASC
            `, [lastCheckTime]);

            if (newAgentsRes.rows.length > 0) {
                for (const row of newAgentsRes.rows) {
                    const sent = await emailAgentPublished(
                        { email: row.email, fullName: row.full_name || row.username || '' },
                        { title: row.title || 'Sans titre', model: row.model || '', provider: row.provider || '' }
                    );
                    results.push({
                        event: 'agent_created',
                        count: 1,
                        sent,
                        details: `${row.title} par ${row.email}`,
                    });
                }
            }

            // ═══════════════════════════════════════════════
            // 6. SUBSCRIPTION EVENTS
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
                const status = sub.status || 'none';
                const user = { email: row.email, fullName: row.full_name || row.username || '' };
                const userId = row.user_id;

                const prev = knownSubStates.get(userId);

                if (prev) {
                    // Detect changes since last check
                    const planChanged = prev.plan !== plan;
                    const statusChanged = prev.status !== status;

                    if (planChanged || statusChanged) {
                        // New subscription: was free → now paid + active
                        if (prev.plan === 'free' && plan !== 'free' && status === 'active') {
                            await emailNewSubscription(user, plan);
                            results.push({ event: 'new_subscription', count: 1, sent: true, details: `${user.email} → ${plan}` });
                            paymentFailedUsers.delete(userId);
                        }
                        // Renewed: was past_due/unpaid → now active
                        else if ((prev.status === 'past_due' || prev.status === 'unpaid') && status === 'active') {
                            await emailSubscriptionRenewed(user, plan);
                            results.push({ event: 'subscription_renewed', count: 1, sent: true, details: `${user.email} — ${plan}` });
                            paymentFailedUsers.delete(userId);
                        }
                        // Plan upgrade/change while active
                        else if (planChanged && plan !== 'free' && status === 'active' && prev.status === 'active') {
                            await emailNewSubscription(user, plan);
                            results.push({ event: 'plan_changed', count: 1, sent: true, details: `${user.email} — ${prev.plan} → ${plan}` });
                        }
                        // Cancelled
                        else if (status === 'canceled' && prev.status !== 'canceled') {
                            await emailSubscriptionCancelled(user, prev.plan !== 'free' ? prev.plan : plan);
                            results.push({ event: 'subscription_cancelled', count: 1, sent: true, details: `${user.email} — ${prev.plan}` });
                        }
                        // Payment failed
                        else if ((status === 'past_due' || status === 'unpaid') && prev.status !== 'past_due' && prev.status !== 'unpaid') {
                            await emailPaymentFailed(user, plan);
                            paymentFailedUsers.set(userId, {
                                detectedAt: new Date(),
                                plan,
                                email: row.email,
                                fullName: user.fullName,
                            });
                            results.push({ event: 'payment_failed', count: 1, sent: true, details: `${user.email} — ${plan}` });
                        }
                    }
                }

                // Update known state
                knownSubStates.set(userId, { plan, status });
            }

            // ═══════════════════════════════════════════════
            // 7. AUTO-DOWNGRADE AFTER 3 DAYS UNPAID
            // ═══════════════════════════════════════════════
            const now = new Date();
            for (const [userId, data] of paymentFailedUsers.entries()) {
                const elapsed = now.getTime() - data.detectedAt.getTime();
                if (elapsed >= THREE_DAYS_MS) {
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
                        results.push({ event: 'auto_downgrade', count: 1, sent: true, details: `${data.email} — ${data.plan} → free` });
                        console.log(`⬇️ Auto-downgraded ${data.email}: ${data.plan} → free`);
                    } catch (err: any) {
                        console.error(`Failed to auto-downgrade ${data.email}:`, err.message);
                    }
                    paymentFailedUsers.delete(userId);
                    knownSubStates.set(userId, { plan: 'free', status: 'canceled' });
                }
            }

            // ═══════════════════════════════════════════════
            // 8. WHATSAPP BRIDGE HEALTH CHECK
            // ═══════════════════════════════════════════════
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);

                const bridgeRes = await fetch(`${WHATSAPP_BRIDGE_URL}/health`, {
                    signal: controller.signal,
                });
                clearTimeout(timeout);

                if (!bridgeRes.ok) {
                    throw new Error(`HTTP ${bridgeRes.status}`);
                }

                // Bridge is online
                if (bridgeWasDown) {
                    const sent = await emailBridgeBackOnline(WHATSAPP_BRIDGE_URL);
                    results.push({ event: 'bridge_back_online', count: 1, sent, details: WHATSAPP_BRIDGE_URL });
                    bridgeWasDown = false;
                }
                results.push({ event: 'bridge_health', count: 1, sent: false, details: 'online' });
            } catch (bridgeError: any) {
                if (!bridgeWasDown) {
                    const sent = await emailBridgeDown(WHATSAPP_BRIDGE_URL, bridgeError.message);
                    results.push({ event: 'bridge_down', count: 1, sent, details: bridgeError.message });
                    bridgeWasDown = true;
                } else {
                    results.push({ event: 'bridge_still_down', count: 1, sent: false, details: 'Already notified' });
                }
            }

        } finally {
            client.release();
        }

        // Update last check time
        lastCheckTime = checkStart;

        return NextResponse.json({
            success: true,
            checkedAt: checkStart,
            lastCheckTime,
            notifications: results,
            summary: {
                totalEvents: results.length,
                emailsSent: results.filter(r => r.sent).length,
            },
        });
    } catch (error: any) {
        console.error('Notification check error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
