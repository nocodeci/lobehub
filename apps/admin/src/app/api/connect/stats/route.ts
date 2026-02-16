import { NextResponse } from 'next/server';
import connectPool from '@/lib/connect-db';

// Monthly prices in EUR for revenue estimation
const PLAN_MONTHLY_PRICES: Record<string, number> = {
    free: 0,
    starter: 29,
    pro: 79,
    business: 199,
    enterprise: 499,
};

export async function GET() {
    try {
        const client = await connectPool.connect();

        try {
            // ═══════════════════════════════════════════════
            // 1. USER STATS
            // ═══════════════════════════════════════════════
            const usersRes = await client.query('SELECT COUNT(*) as total FROM users');
            const totalUsers = parseInt(usersRes.rows[0].total);

            const usersThisMonthRes = await client.query(
                `SELECT COUNT(*) as total FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)`
            );
            const usersThisMonth = parseInt(usersThisMonthRes.rows[0].total);

            const usersLastMonthRes = await client.query(
                `SELECT COUNT(*) as total FROM users 
                 WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month') 
                 AND created_at < date_trunc('month', CURRENT_DATE)`
            );
            const usersLastMonth = parseInt(usersLastMonthRes.rows[0].total);
            const userGrowth = usersLastMonth > 0
                ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100)
                : 0;

            // Active users (last 7 days)
            const activeUsersRes = await client.query(
                `SELECT COUNT(*) as total FROM users WHERE last_active_at >= CURRENT_DATE - interval '7 days'`
            );
            const activeUsers7d = parseInt(activeUsersRes.rows[0].total);

            // Active users (last 30 days)
            const activeUsers30dRes = await client.query(
                `SELECT COUNT(*) as total FROM users WHERE last_active_at >= CURRENT_DATE - interval '30 days'`
            );
            const activeUsers30d = parseInt(activeUsers30dRes.rows[0].total);

            // Banned users
            const bannedRes = await client.query(`SELECT COUNT(*) as total FROM users WHERE banned = true`);
            const bannedUsers = parseInt(bannedRes.rows[0].total);

            // ═══════════════════════════════════════════════
            // 2. SUBSCRIPTION & REVENUE
            // ═══════════════════════════════════════════════
            // Users with settings
            const usersWithSettingsRes = await client.query(`SELECT COUNT(*) as total FROM user_settings`);
            const usersWithSettings = parseInt(usersWithSettingsRes.rows[0].total);

            // Free users = total users - users with a paid plan
            const planDistRes = await client.query(`
                SELECT 
                    COALESCE(general->>'subscriptionPlan', 'free') as plan,
                    COUNT(*) as count
                FROM user_settings
                GROUP BY COALESCE(general->>'subscriptionPlan', 'free')
                ORDER BY count DESC
            `);
            const planDistribution = planDistRes.rows.map(r => ({
                plan: r.plan || 'free',
                count: parseInt(r.count),
            }));

            // Count users without settings as free
            const usersInSettings = planDistribution.reduce((sum, p) => sum + p.count, 0);
            const usersWithoutSettings = totalUsers - usersInSettings;
            const freeEntry = planDistribution.find(p => p.plan === 'free');
            if (freeEntry) {
                freeEntry.count += usersWithoutSettings;
            } else if (usersWithoutSettings > 0) {
                planDistribution.push({ plan: 'free', count: usersWithoutSettings });
            }

            // Calculate Monthly Recurring Revenue (MRR)
            let mrr = 0;
            const revenueByPlan: { plan: string; count: number; price: number; revenue: number }[] = [];
            for (const p of planDistribution) {
                const price = PLAN_MONTHLY_PRICES[p.plan] || 0;
                const rev = p.count * price;
                mrr += rev;
                revenueByPlan.push({ plan: p.plan, count: p.count, price, revenue: rev });
            }
            const arr = mrr * 12;

            // Paying users count
            const payingUsers = planDistribution
                .filter(p => p.plan !== 'free')
                .reduce((sum, p) => sum + p.count, 0);

            // ═══════════════════════════════════════════════
            // 3. AGENTS & MESSAGES
            // ═══════════════════════════════════════════════
            const agentsRes = await client.query('SELECT COUNT(*) as total FROM agents');
            const totalAgents = parseInt(agentsRes.rows[0].total);

            const agentsThisMonthRes = await client.query(
                `SELECT COUNT(*) as total FROM agents WHERE created_at >= date_trunc('month', CURRENT_DATE)`
            );
            const agentsThisMonth = parseInt(agentsThisMonthRes.rows[0].total);

            const messagesRes = await client.query('SELECT COUNT(*) as total FROM messages');
            const totalMessages = parseInt(messagesRes.rows[0].total);

            const messagesThisMonthRes = await client.query(
                `SELECT COUNT(*) as total FROM messages WHERE created_at >= date_trunc('month', CURRENT_DATE)`
            );
            const messagesThisMonth = parseInt(messagesThisMonthRes.rows[0].total);

            // Messages by role
            const msgByRoleRes = await client.query(`
                SELECT role, COUNT(*) as count
                FROM messages
                GROUP BY role
                ORDER BY count DESC
            `);
            const messagesByRole = msgByRoleRes.rows.map(r => ({
                role: r.role, count: parseInt(r.count),
            }));

            // Sessions & Topics
            const sessionsRes = await client.query('SELECT COUNT(*) as total FROM sessions');
            const totalSessions = parseInt(sessionsRes.rows[0].total);

            const topicsRes = await client.query('SELECT COUNT(*) as total FROM topics');
            const totalTopics = parseInt(topicsRes.rows[0].total);

            // ═══════════════════════════════════════════════
            // 4. AI PROVIDERS & BYOK ANALYSIS
            // ═══════════════════════════════════════════════
            // Providers configured by users
            const providersConfiguredRes = await client.query(`
                SELECT id, name, COUNT(DISTINCT user_id) as user_count,
                       SUM(CASE WHEN enabled = true THEN 1 ELSE 0 END) as enabled_count,
                       SUM(CASE WHEN key_vaults IS NOT NULL AND key_vaults != '' THEN 1 ELSE 0 END) as with_keys
                FROM ai_providers
                GROUP BY id, name
                ORDER BY user_count DESC
                LIMIT 15
            `);
            const aiProviders = providersConfiguredRes.rows.map(r => ({
                id: r.id,
                name: r.name || r.id,
                userCount: parseInt(r.user_count),
                enabledCount: parseInt(r.enabled_count),
                withKeys: parseInt(r.with_keys),
            }));

            // Total users with BYOK (at least one provider with key_vaults)
            const byokUsersRes = await client.query(`
                SELECT COUNT(DISTINCT user_id) as total
                FROM ai_providers
                WHERE key_vaults IS NOT NULL AND key_vaults != ''
            `);
            const byokUsers = parseInt(byokUsersRes.rows[0].total);

            // Total provider configurations
            const totalProviderConfigsRes = await client.query(`SELECT COUNT(*) as total FROM ai_providers`);
            const totalProviderConfigs = parseInt(totalProviderConfigsRes.rows[0].total);

            // ═══════════════════════════════════════════════
            // 5. MESSAGES BY PROVIDER/MODEL (usage tracking)
            // ═══════════════════════════════════════════════
            const msgByProviderRes = await client.query(`
                SELECT provider, COUNT(*) as count
                FROM messages
                WHERE provider IS NOT NULL AND provider != '' AND role = 'assistant'
                GROUP BY provider
                ORDER BY count DESC
                LIMIT 15
            `);
            const messagesByProvider = msgByProviderRes.rows.map(r => ({
                provider: r.provider, count: parseInt(r.count),
            }));

            const msgByModelRes = await client.query(`
                SELECT model, provider, COUNT(*) as count
                FROM messages
                WHERE model IS NOT NULL AND model != '' AND role = 'assistant'
                GROUP BY model, provider
                ORDER BY count DESC
                LIMIT 15
            `);
            const messagesByModel = msgByModelRes.rows.map(r => ({
                model: r.model, provider: r.provider, count: parseInt(r.count),
            }));

            // ═══════════════════════════════════════════════
            // 6. API KEYS
            // ═══════════════════════════════════════════════
            const apiKeysRes = await client.query(`
                SELECT COUNT(*) as total,
                       SUM(CASE WHEN enabled = true THEN 1 ELSE 0 END) as active,
                       COUNT(DISTINCT user_id) as unique_users
                FROM api_keys
            `);
            const apiKeys = {
                total: parseInt(apiKeysRes.rows[0].total),
                active: parseInt(apiKeysRes.rows[0].active),
                uniqueUsers: parseInt(apiKeysRes.rows[0].unique_users),
            };

            // ═══════════════════════════════════════════════
            // 7. FILES & STORAGE
            // ═══════════════════════════════════════════════
            const filesRes = await client.query(`
                SELECT COUNT(*) as total,
                       COALESCE(SUM(size), 0) as total_size
                FROM files
            `);
            const files = {
                total: parseInt(filesRes.rows[0].total),
                totalSize: parseInt(filesRes.rows[0].total_size),
            };

            // Files by type
            const filesByTypeRes = await client.query(`
                SELECT file_type, COUNT(*) as count, COALESCE(SUM(size), 0) as size
                FROM files
                WHERE file_type IS NOT NULL
                GROUP BY file_type
                ORDER BY count DESC
                LIMIT 10
            `);
            const filesByType = filesByTypeRes.rows.map(r => ({
                type: r.file_type, count: parseInt(r.count), size: parseInt(r.size),
            }));

            // ═══════════════════════════════════════════════
            // 8. GENERATIONS (image gen)
            // ═══════════════════════════════════════════════
            const genRes = await client.query(`SELECT COUNT(*) as total FROM generations`);
            const totalGenerations = parseInt(genRes.rows[0].total);

            const genByProviderRes = await client.query(`
                SELECT gb.provider, gb.model, COUNT(*) as count
                FROM generations g
                JOIN generation_batches gb ON g.generation_batch_id = gb.id
                GROUP BY gb.provider, gb.model
                ORDER BY count DESC
                LIMIT 10
            `);
            const generationsByProvider = genByProviderRes.rows.map(r => ({
                provider: r.provider, model: r.model, count: parseInt(r.count),
            }));

            // ═══════════════════════════════════════════════
            // 9. CHARTS (time series)
            // ═══════════════════════════════════════════════
            const usersByDayRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM users
                WHERE created_at >= CURRENT_DATE - interval '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);
            const usersByDay = usersByDayRes.rows.map(r => ({
                date: r.date, count: parseInt(r.count),
            }));

            const messagesByDayRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM messages
                WHERE created_at >= CURRENT_DATE - interval '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);
            const messagesByDay = messagesByDayRes.rows.map(r => ({
                date: r.date, count: parseInt(r.count),
            }));

            // Agents by day (last 30d)
            const agentsByDayRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM agents
                WHERE created_at >= CURRENT_DATE - interval '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);
            const agentsByDay = agentsByDayRes.rows.map(r => ({
                date: r.date, count: parseInt(r.count),
            }));

            // ═══════════════════════════════════════════════
            // 10. TOP USERS (most active)
            // ═══════════════════════════════════════════════
            const topUsersRes = await client.query(`
                SELECT 
                    u.id, u.username, u.email, u.full_name, u.created_at, u.last_active_at,
                    COALESCE(us.general->>'subscriptionPlan', 'free') as plan,
                    (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) as msg_count,
                    (SELECT COUNT(*) FROM agents a WHERE a.user_id = u.id) as agent_count
                FROM users u
                LEFT JOIN user_settings us ON us.id = u.id
                ORDER BY msg_count DESC
                LIMIT 10
            `);
            const topUsers = topUsersRes.rows.map(r => ({
                id: r.id,
                username: r.username,
                email: r.email,
                fullName: r.full_name,
                plan: r.plan || 'free',
                createdAt: r.created_at,
                lastActiveAt: r.last_active_at,
                messageCount: parseInt(r.msg_count),
                agentCount: parseInt(r.agent_count),
            }));

            // Recent users (last 10 registered)
            const recentUsersRes = await client.query(`
                SELECT id, username, email, avatar, full_name, created_at, last_active_at
                FROM users
                ORDER BY created_at DESC
                LIMIT 10
            `);

            return NextResponse.json({
                success: true,
                stats: {
                    users: {
                        total: totalUsers,
                        thisMonth: usersThisMonth,
                        lastMonth: usersLastMonth,
                        growth: parseFloat(userGrowth.toFixed(1)),
                        active7d: activeUsers7d,
                        active30d: activeUsers30d,
                        banned: bannedUsers,
                        paying: payingUsers,
                    },
                    revenue: {
                        mrr,
                        arr,
                        revenueByPlan,
                        payingUsers,
                    },
                    agents: { total: totalAgents, thisMonth: agentsThisMonth },
                    messages: {
                        total: totalMessages,
                        thisMonth: messagesThisMonth,
                        byRole: messagesByRole,
                        byProvider: messagesByProvider,
                        byModel: messagesByModel,
                    },
                    sessions: { total: totalSessions },
                    topics: { total: totalTopics },
                    planDistribution,
                    aiProviders,
                    byokUsers,
                    totalProviderConfigs,
                    apiKeys,
                    files,
                    filesByType,
                    generations: { total: totalGenerations, byProvider: generationsByProvider },
                },
                charts: { usersByDay, messagesByDay, agentsByDay },
                topUsers,
                recentUsers: recentUsersRes.rows,
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Error fetching Connect stats:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
