import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

import { UserModel } from '@/database/models/user';
import { getServerDB } from '@/database/core/db-adaptor';
import { getSessionUser } from '@/libs/trusted-client/getSessionUser';

// WhatsApp Bridge server URL - single bridge with multi-session support
const WHATSAPP_BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || 'http://localhost:8080';

interface WhatsAppAccountsSettings {
    accounts?: { id: string; name?: string; bridgeUrl?: string }[];
    activeAccountId?: string;
}

// Resolve the account config for the given accountId or the active account
const resolveAccountConfig = async (accountId?: string | null): Promise<{ bridgeUrl: string; sessionId: string }> => {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser?.userId) {
            return {
                bridgeUrl: WHATSAPP_BRIDGE_URL,
                sessionId: 'default',
            };
        }

        const db = await getServerDB();
        const userModel = new UserModel(db, sessionUser.userId);
        const settings = await userModel.getUserSettings();

        const tool = (settings?.tool || {}) as any;
        const whatsapp = (tool?.whatsapp || {}) as WhatsAppAccountsSettings;

        const id = accountId || whatsapp.activeAccountId || 'whatsapp-1';
        const account = whatsapp.accounts?.find((a: any) => a.id === id);

        // Include userId in sessionId for perfect isolation in multi-user environments
        const sessionId = `${sessionUser.userId}_${id}`;
        const bridgeUrl = account?.bridgeUrl || WHATSAPP_BRIDGE_URL;

        return { bridgeUrl, sessionId };
    } catch {
        return {
            bridgeUrl: WHATSAPP_BRIDGE_URL,
            sessionId: 'default',
        };
    }
};

// Build bridge API URL with sessionId query param
const buildBridgeUrl = (baseUrl: string, endpoint: string, sessionId: string, extraParams?: Record<string, string>): string => {
    // Ensure baseUrl is clean
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = new URL(`${cleanBaseUrl}${endpoint}`);
    url.searchParams.set('sessionId', sessionId);
    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            url.searchParams.set(key, value);
        }
    }
    return url.toString();
};

/**
 * WhatsApp API Route
 * Proxies requests to the WhatsApp bridge server
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const accountId = searchParams.get('accountId');
    const { bridgeUrl, sessionId } = await resolveAccountConfig(accountId);

    try {
        switch (action) {
            case 'qr':
                // Get QR code for WhatsApp authentication
                const qrResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/qr', sessionId), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!qrResponse.ok) {
                    throw new Error(`Failed to get QR code: ${qrResponse.statusText}`);
                }

                const qrData = await qrResponse.json();
                return NextResponse.json({
                    success: true,
                    data: {
                        qr: qrData.qr,
                        paired: qrData.paired,
                    },
                });

            case 'status':
                // Check WhatsApp connection status
                try {
                    const statusResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/status', sessionId), {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (statusResponse.ok) {
                        const statusData = await statusResponse.json();
                        const paired = !!statusData.paired;
                        return NextResponse.json({
                            success: true,
                            data: {
                                // IMPORTANT: consider "connected" as "paired" (authenticated), not websocket connected.
                                connected: paired,
                                bridgeRunning: true,
                                needsQR: !paired,
                                qr: statusData.qr || '',
                                sessionId: statusData.session_id,
                                phone: statusData.phone || '',
                                jid: statusData.jid || '',
                            },
                        });
                    }

                    const fallbackResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/qr', sessionId), {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!fallbackResponse.ok) {
                        return NextResponse.json({
                            success: true,
                            data: {
                                connected: false,
                                bridgeRunning: false,
                            },
                        });
                    }

                    const statusData = await fallbackResponse.json();
                    return NextResponse.json({
                        success: true,
                        data: {
                            connected: statusData.paired,
                            bridgeRunning: true,
                            needsQR: !statusData.paired && !!statusData.qr,
                        },
                    });
                } catch {
                    return NextResponse.json({
                        success: true,
                        data: {
                            connected: false,
                            bridgeRunning: false,
                        },
                    });
                }

            case 'check-phone': {
                // Check if a WhatsApp phone number is already registered by any user
                const phoneToCheck = searchParams.get('phone');
                if (!phoneToCheck) {
                    return NextResponse.json(
                        { success: false, error: 'Missing phone parameter' },
                        { status: 400 }
                    );
                }

                // Normalize: strip everything except digits and leading +
                const normalizedPhone = phoneToCheck.replace(/[^\d+]/g, '');
                const digitsOnly = normalizedPhone.replace(/^\+/, '');

                // Get current user ID
                const sessionUser = await getSessionUser();
                const currentUserId = sessionUser?.userId;

                // Query all user_settings where tool->'whatsapp'->'accounts' contains any account with this phone
                // Uses PostgreSQL jsonb_array_elements to unnest the accounts array and check
                const db = await getServerDB();
                const result = await db.execute(
                    sql`SELECT us.id AS user_id
                        FROM user_settings us,
                             jsonb_array_elements(us.tool->'whatsapp'->'accounts') AS account
                        WHERE account->>'phone' IS NOT NULL
                          AND REPLACE(REPLACE(account->>'phone', '+', ''), ' ', '') LIKE ${'%' + digitsOnly + '%'}
                        LIMIT 1`
                );

                if (result.rows && result.rows.length > 0) {
                    const ownerUserId = (result.rows[0] as any).user_id;
                    const isSameUser = ownerUserId === currentUserId;

                    return NextResponse.json({
                        success: true,
                        data: {
                            exists: true,
                            sameUser: isSameUser,
                            message: isSameUser
                                ? 'Ce numéro WhatsApp est déjà enregistré sur l\'un de vos comptes.'
                                : 'Ce numéro WhatsApp est déjà utilisé par un autre utilisateur. Veuillez contacter le service client pour le transférer.',
                        },
                    });
                }

                return NextResponse.json({
                    success: true,
                    data: { exists: false },
                });
            }

            case 'contacts':
                // Get WhatsApp contacts
                const contactsResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/contacts', sessionId));
                const contactsData = await contactsResponse.json();
                return NextResponse.json({ success: true, data: contactsData });

            case 'groups':
                // Get joined groups
                const groupsResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/groups', sessionId));
                const groupsData = await groupsResponse.json();
                return NextResponse.json({ success: true, data: groupsData });

            case 'group-info':
                // Get info for a specific group
                const groupJid = searchParams.get('jid');
                const infoResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/group/info', sessionId, { jid: groupJid || '' }));
                const infoData = await infoResponse.json();
                return NextResponse.json({ success: true, data: infoData });

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action. Use: qr, status, check-phone, contacts, groups, group-info' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('WhatsApp API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                bridgeRunning: false,
            },
            { status: 500 }
        );
    }
}

/**
 * POST handler for WhatsApp actions
 */
export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const accountId = searchParams.get('accountId');
    const { bridgeUrl, sessionId } = await resolveAccountConfig(accountId);

    try {
        // Handle actions that don't require a body first
        switch (action) {
            case 'logout':
                // Logout/disconnect WhatsApp
                try {
                    const logoutResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/logout', sessionId), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!logoutResponse.ok) {
                        throw new Error(`Failed to logout: ${logoutResponse.statusText}`);
                    }

                    return NextResponse.json({
                        success: true,
                        message: 'WhatsApp disconnected successfully',
                    });
                } catch (logoutError) {
                    console.error('WhatsApp logout error:', logoutError);
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Failed to disconnect WhatsApp',
                        },
                        { status: 500 },
                    );
                }

            case 'group-leave':
                // Leave a WhatsApp group
                const groupJidToLeave = searchParams.get('jid');
                if (!groupJidToLeave) {
                    return NextResponse.json(
                        { success: false, error: 'Missing group JID for group-leave action' },
                        { status: 400 }
                    );
                }
                const leaveResponse = await fetch(
                    buildBridgeUrl(bridgeUrl, '/api/group/leave', sessionId, { jid: groupJidToLeave }),
                    {
                        method: 'POST',
                    },
                );
                if (!leaveResponse.ok) {
                    throw new Error(`Failed to leave group: ${leaveResponse.statusText}`);
                }
                const leaveData = await leaveResponse.json();
                return NextResponse.json({ success: true, data: leaveData });
        }

        // For other actions, parse the body
        const body = await req.json();

        switch (action) {
            case 'send': {
                // Send a WhatsApp message
                const sendResponse = await fetch(buildBridgeUrl(bridgeUrl, '/api/send', sessionId), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipient: body.recipient,
                        message: body.message,
                        media_path: body.mediaPath || body.filePath,
                    }),
                });

                if (!sendResponse.ok) {
                    throw new Error(`Failed to send message: ${sendResponse.statusText}`);
                }

                const sendData = await sendResponse.json();
                return NextResponse.json({
                    success: true,
                    data: sendData,
                });
            }

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action. Use: send, logout' },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error('WhatsApp API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
