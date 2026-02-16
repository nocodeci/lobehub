import { NextRequest, NextResponse } from 'next/server';
import connectPool from '@/lib/connect-db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const plan = searchParams.get('plan') || '';
        const offset = (page - 1) * limit;

        const client = await connectPool.connect();

        try {
            let whereClause = '';
            const params: any[] = [];
            let paramIdx = 1;

            if (search) {
                whereClause += ` WHERE (u.email ILIKE $${paramIdx} OR u.username ILIKE $${paramIdx} OR u.full_name ILIKE $${paramIdx})`;
                params.push(`%${search}%`);
                paramIdx++;
            }

            if (plan) {
                whereClause += whereClause ? ' AND ' : ' WHERE ';
                whereClause += `COALESCE(us.general->>'subscriptionPlan', 'free') = $${paramIdx}`;
                params.push(plan);
                paramIdx++;
            }

            // Count total
            const countQuery = `
                SELECT COUNT(*) as total 
                FROM users u
                LEFT JOIN user_settings us ON us.id = u.id
                ${whereClause}
            `;
            const countRes = await client.query(countQuery, params);
            const total = parseInt(countRes.rows[0].total);

            // Get users with agent count and message count
            const usersQuery = `
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    u.avatar,
                    u.full_name,
                    u.first_name,
                    u.last_name,
                    u.phone,
                    u.is_onboarded,
                    u.banned,
                    u.ban_reason,
                    u.role,
                    u.created_at,
                    u.last_active_at,
                    u.updated_at,
                    COALESCE(us.general->>'subscriptionPlan', 'free') as plan,
                    (SELECT COUNT(*) FROM agents a WHERE a.user_id = u.id) as agents_count,
                    (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) as messages_count,
                    (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id) as sessions_count
                FROM users u
                LEFT JOIN user_settings us ON us.id = u.id
                ${whereClause}
                ORDER BY u.created_at DESC
                LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
            `;
            params.push(limit, offset);
            const usersRes = await client.query(usersQuery, params);

            return NextResponse.json({
                success: true,
                users: usersRes.rows.map(u => ({
                    id: u.id,
                    username: u.username,
                    email: u.email,
                    avatar: u.avatar,
                    fullName: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Sans nom',
                    phone: u.phone,
                    isOnboarded: u.is_onboarded,
                    banned: u.banned,
                    banReason: u.ban_reason,
                    role: u.role,
                    plan: u.plan || 'free',
                    createdAt: u.created_at,
                    lastActiveAt: u.last_active_at,
                    updatedAt: u.updated_at,
                    agentsCount: parseInt(u.agents_count),
                    messagesCount: parseInt(u.messages_count),
                    sessionsCount: parseInt(u.sessions_count),
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Error fetching Connect users:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH - Update user (ban/unban, change plan)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action, value } = body;

        if (!userId || !action) {
            return NextResponse.json(
                { success: false, error: 'userId and action are required' },
                { status: 400 }
            );
        }

        const client = await connectPool.connect();

        try {
            switch (action) {
                case 'ban': {
                    await client.query(
                        `UPDATE users SET banned = true, ban_reason = $1, updated_at = NOW() WHERE id = $2`,
                        [value || 'Banned by admin', userId]
                    );
                    break;
                }
                case 'unban': {
                    await client.query(
                        `UPDATE users SET banned = false, ban_reason = NULL, updated_at = NOW() WHERE id = $1`,
                        [userId]
                    );
                    break;
                }
                case 'changePlan': {
                    // Update or insert user_settings with new plan
                    await client.query(`
                        INSERT INTO user_settings (id, general)
                        VALUES ($1, jsonb_build_object('subscriptionPlan', $2::text))
                        ON CONFLICT (id) DO UPDATE
                        SET general = COALESCE(user_settings.general, '{}'::jsonb) || jsonb_build_object('subscriptionPlan', $2::text)
                    `, [userId, value]);
                    break;
                }
                default:
                    return NextResponse.json(
                        { success: false, error: `Unknown action: ${action}` },
                        { status: 400 }
                    );
            }

            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Error updating Connect user:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
