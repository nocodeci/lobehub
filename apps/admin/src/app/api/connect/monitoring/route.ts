import { NextRequest, NextResponse } from 'next/server';
import connectPool from '@/lib/connect-db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '7d';

        let interval = '7 days';
        if (period === '24h') interval = '1 day';
        else if (period === '30d') interval = '30 days';
        else if (period === '90d') interval = '90 days';

        const client = await connectPool.connect();

        try {
            // ═══════════════════════════════════════════════
            // 1. FAILED MESSAGES (AI errors)
            // ═══════════════════════════════════════════════
            const failedMsgsRes = await client.query(`
                SELECT COUNT(*) as total
                FROM messages
                WHERE error IS NOT NULL AND error::text != 'null'
                AND created_at >= CURRENT_DATE - interval '${interval}'
            `);
            const failedMessages = parseInt(failedMsgsRes.rows[0].total);

            const totalMsgsRes = await client.query(`
                SELECT COUNT(*) as total FROM messages
                WHERE created_at >= CURRENT_DATE - interval '${interval}'
            `);
            const totalMessages = parseInt(totalMsgsRes.rows[0].total);
            const errorRate = totalMessages > 0 ? ((failedMessages / totalMessages) * 100) : 0;

            // Recent failed messages with details
            const recentErrorsRes = await client.query(`
                SELECT 
                    m.id,
                    m.role,
                    m.model,
                    m.provider,
                    m.error,
                    m.created_at,
                    u.email as user_email,
                    u.full_name as user_name,
                    u.username
                FROM messages m
                LEFT JOIN users u ON u.id = m.user_id
                WHERE m.error IS NOT NULL AND m.error::text != 'null'
                ORDER BY m.created_at DESC
                LIMIT 50
            `);
            const recentErrors = recentErrorsRes.rows.map(r => ({
                id: r.id,
                role: r.role,
                model: r.model,
                provider: r.provider,
                error: r.error,
                createdAt: r.created_at,
                userEmail: r.user_email,
                userName: r.user_name || r.username,
            }));

            // Errors by provider
            const errorsByProviderRes = await client.query(`
                SELECT 
                    err.provider,
                    err.error_count,
                    COALESCE(tot.total_count, 0) as total_count
                FROM (
                    SELECT COALESCE(provider, 'unknown') as provider, COUNT(*) as error_count
                    FROM messages
                    WHERE error IS NOT NULL AND error::text != 'null'
                    AND created_at >= CURRENT_DATE - interval '${interval}'
                    GROUP BY provider
                ) err
                LEFT JOIN (
                    SELECT COALESCE(provider, 'unknown') as provider, COUNT(*) as total_count
                    FROM messages
                    WHERE role = 'assistant'
                    AND created_at >= CURRENT_DATE - interval '${interval}'
                    GROUP BY provider
                ) tot ON tot.provider = err.provider
                ORDER BY err.error_count DESC
            `);
            const errorsByProvider = errorsByProviderRes.rows.map(r => ({
                provider: r.provider,
                errorCount: parseInt(r.error_count),
                totalCount: parseInt(r.total_count),
                errorRate: parseInt(r.total_count) > 0
                    ? ((parseInt(r.error_count) / parseInt(r.total_count)) * 100).toFixed(1)
                    : '0',
            }));

            // Errors by model
            const errorsByModelRes = await client.query(`
                SELECT 
                    COALESCE(model, 'unknown') as model,
                    COALESCE(provider, 'unknown') as provider,
                    COUNT(*) as error_count
                FROM messages
                WHERE error IS NOT NULL AND error::text != 'null'
                AND created_at >= CURRENT_DATE - interval '${interval}'
                GROUP BY model, provider
                ORDER BY error_count DESC
                LIMIT 15
            `);
            const errorsByModel = errorsByModelRes.rows.map(r => ({
                model: r.model,
                provider: r.provider,
                errorCount: parseInt(r.error_count),
            }));

            // Error types (parse error body to categorize)
            const errorTypesRes = await client.query(`
                SELECT 
                    COALESCE(error->>'type', error->>'errorType', 'unknown') as error_type,
                    COUNT(*) as count
                FROM messages
                WHERE error IS NOT NULL AND error::text != 'null'
                AND created_at >= CURRENT_DATE - interval '${interval}'
                GROUP BY error_type
                ORDER BY count DESC
                LIMIT 10
            `);
            const errorTypes = errorTypesRes.rows.map(r => ({
                type: r.error_type,
                count: parseInt(r.count),
            }));

            // Errors by day (timeline)
            const errorsByDayRes = await client.query(`
                SELECT 
                    err.date,
                    err.errors,
                    COALESCE(tot.total, 0) as total
                FROM (
                    SELECT DATE(created_at) as date, COUNT(*) as errors
                    FROM messages
                    WHERE error IS NOT NULL AND error::text != 'null'
                    AND created_at >= CURRENT_DATE - interval '${interval}'
                    GROUP BY DATE(created_at)
                ) err
                LEFT JOIN (
                    SELECT DATE(created_at) as date, COUNT(*) as total
                    FROM messages
                    WHERE created_at >= CURRENT_DATE - interval '${interval}'
                    GROUP BY DATE(created_at)
                ) tot ON tot.date = err.date
                ORDER BY err.date ASC
            `);
            const errorsByDay = errorsByDayRes.rows.map(r => ({
                date: r.date,
                errors: parseInt(r.errors),
                total: parseInt(r.total),
                rate: parseInt(r.total) > 0 ? ((parseInt(r.errors) / parseInt(r.total)) * 100).toFixed(1) : '0',
            }));

            // ═══════════════════════════════════════════════
            // 2. ASYNC TASKS (failed operations)
            // ═══════════════════════════════════════════════
            const asyncTasksRes = await client.query(`
                SELECT status, COUNT(*) as count
                FROM async_tasks
                WHERE created_at >= CURRENT_DATE - interval '${interval}'
                GROUP BY status
                ORDER BY count DESC
            `);
            const asyncTasksByStatus = asyncTasksRes.rows.map(r => ({
                status: r.status,
                count: parseInt(r.count),
            }));

            const failedTasksRes = await client.query(`
                SELECT 
                    at.id, at.type, at.status, at.error, at.duration, at.created_at,
                    u.email as user_email, u.full_name as user_name
                FROM async_tasks at
                LEFT JOIN users u ON u.id = at.user_id
                WHERE at.status IN ('error', 'failed')
                AND at.created_at >= CURRENT_DATE - interval '${interval}'
                ORDER BY at.created_at DESC
                LIMIT 30
            `);
            const failedTasks = failedTasksRes.rows.map(r => ({
                id: r.id,
                type: r.type,
                status: r.status,
                error: r.error,
                duration: r.duration,
                createdAt: r.created_at,
                userEmail: r.user_email,
                userName: r.user_name,
            }));

            // ═══════════════════════════════════════════════
            // 3. PLUGIN ERRORS (tool call failures)
            // ═══════════════════════════════════════════════
            const pluginErrorsRes = await client.query(`
                SELECT 
                    COALESCE(identifier, 'unknown') as plugin,
                    COUNT(*) as error_count
                FROM message_plugins
                WHERE error IS NOT NULL AND error::text != 'null'
                AND user_id IN (
                    SELECT id FROM users WHERE created_at >= CURRENT_DATE - interval '${interval}'
                    UNION
                    SELECT user_id FROM message_plugins 
                    WHERE error IS NOT NULL AND error::text != 'null'
                )
                GROUP BY identifier
                ORDER BY error_count DESC
                LIMIT 10
            `);
            const pluginErrors = pluginErrorsRes.rows.map(r => ({
                plugin: r.plugin,
                errorCount: parseInt(r.error_count),
            }));

            // ═══════════════════════════════════════════════
            // 4. SYSTEM HEALTH
            // ═══════════════════════════════════════════════
            // DB response time
            const healthStart = Date.now();
            await client.query('SELECT 1');
            const dbLatency = Date.now() - healthStart;

            // Users active in last hour
            const activeNowRes = await client.query(
                `SELECT COUNT(*) as total FROM users WHERE last_active_at >= NOW() - interval '1 hour'`
            );
            const activeNow = parseInt(activeNowRes.rows[0].total);

            // Messages in last hour
            const msgsLastHourRes = await client.query(
                `SELECT COUNT(*) as total FROM messages WHERE created_at >= NOW() - interval '1 hour'`
            );
            const msgsLastHour = parseInt(msgsLastHourRes.rows[0].total);

            // Errors in last hour
            const errorsLastHourRes = await client.query(
                `SELECT COUNT(*) as total FROM messages WHERE error IS NOT NULL AND error::text != 'null' AND created_at >= NOW() - interval '1 hour'`
            );
            const errorsLastHour = parseInt(errorsLastHourRes.rows[0].total);

            // Top affected users (most errors)
            const topAffectedUsersRes = await client.query(`
                SELECT 
                    u.id, u.email, u.full_name, u.username,
                    COUNT(*) as error_count
                FROM messages m
                JOIN users u ON u.id = m.user_id
                WHERE m.error IS NOT NULL AND m.error::text != 'null'
                AND m.created_at >= CURRENT_DATE - interval '${interval}'
                GROUP BY u.id, u.email, u.full_name, u.username
                ORDER BY error_count DESC
                LIMIT 10
            `);
            const topAffectedUsers = topAffectedUsersRes.rows.map(r => ({
                id: r.id,
                email: r.email,
                fullName: r.full_name || r.username,
                errorCount: parseInt(r.error_count),
            }));

            return NextResponse.json({
                success: true,
                period,
                health: {
                    dbLatency,
                    activeNow,
                    msgsLastHour,
                    errorsLastHour,
                    status: dbLatency < 200 && errorsLastHour < 10 ? 'healthy' : errorsLastHour < 50 ? 'warning' : 'critical',
                },
                errors: {
                    total: failedMessages,
                    totalMessages,
                    errorRate: parseFloat(errorRate.toFixed(2)),
                    byProvider: errorsByProvider,
                    byModel: errorsByModel,
                    byType: errorTypes,
                    byDay: errorsByDay,
                    recent: recentErrors,
                    topAffectedUsers,
                },
                asyncTasks: {
                    byStatus: asyncTasksByStatus,
                    failed: failedTasks,
                },
                pluginErrors,
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Error fetching monitoring data:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
