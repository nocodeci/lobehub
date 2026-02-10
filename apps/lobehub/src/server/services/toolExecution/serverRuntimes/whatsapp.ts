import { WhatsAppManifest } from '@/tools/whatsapp';
import { type ServerRuntimeRegistration } from './types';

import { UserModel } from '@/database/models/user';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// WhatsApp Bridge server URL - single bridge with multi-session support
const WHATSAPP_BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || 'http://localhost:8080';

interface WhatsAppAccountsSettings {
    accounts?: { id: string; name?: string }[];
    activeAccountId?: string;
}

const parseResponse = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        return await response.text();
    }
};

const getExtFromContentType = (contentType: string | null): string | undefined => {
    if (!contentType) return;
    const ct = contentType.split(';')[0].trim().toLowerCase();
    const mapping: Record<string, string> = {
        'audio/mpeg': 'mp3',
        'audio/mp4': 'm4a',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'application/pdf': 'pdf',
    };
    return mapping[ct];
};

const downloadToTempFile = async (url: string, prefix: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const data = await parseResponse(response);
        throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
    }

    const contentType = response.headers.get('content-type');
    const extFromCT = getExtFromContentType(contentType);

    let extFromURL: string | undefined;
    try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname);
        if (ext) extFromURL = ext.replace('.', '').toLowerCase();
    } catch {
        // ignore
    }

    const ext = extFromCT || extFromURL;
    const filename = `${prefix}_${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;
    const filePath = path.join(os.tmpdir(), filename);

    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return filePath;
};

// Resolve the sessionId to use for the bridge (from user's active account)
// IMPORTANT: sessionId MUST be prefixed with userId for multi-user isolation
const resolveSessionId = async (context: any): Promise<string> => {
    try {
        if (!context?.serverDB || !context?.userId) return 'default';

        const userModel = new UserModel(context.serverDB, context.userId);
        const settings = await userModel.getUserSettings();

        const tool = (settings?.tool || {}) as any;
        const whatsapp = (tool?.whatsapp || {}) as WhatsAppAccountsSettings;

        const accountId = whatsapp.activeAccountId || 'whatsapp-1';
        return `${context.userId}_${accountId}`;
    } catch {
        return 'default';
    }
};

// Build bridge API URL with sessionId query param
const buildBridgeUrl = (endpoint: string, sessionId: string, extraParams?: Record<string, string>): string => {
    const url = new URL(`${WHATSAPP_BRIDGE_URL}${endpoint}`);
    url.searchParams.set('sessionId', sessionId);
    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            url.searchParams.set(key, value);
        }
    }
    return url.toString();
};

/**
 * WhatsApp Server Runtime
 */
export const whatsappRuntime: ServerRuntimeRegistration = {
    factory: (context) => {
        return {
            whatsapp_list_chats: async () => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/chats', sessionId));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la récupération des conversations', error, success: false };
                }
            },
            whatsapp_read_messages: async (args: { chat_jid: string; limit?: number }) => {
                const sessionId = await resolveSessionId(context);
                try {
                    const extraParams: Record<string, string> = { chat_jid: args.chat_jid };
                    if (args.limit) extraParams.limit = args.limit.toString();

                    const response = await fetch(buildBridgeUrl('/api/messages', sessionId, extraParams));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la lecture des messages', error, success: false };
                }
            },
            whatsapp_send_message: async (args: { message: string; recipient: string }) => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/send', sessionId), {
                        body: JSON.stringify({
                            message: args.message,
                            recipient: args.recipient,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de l\'envoi du message', error, success: false };
                }
            },
            whatsapp_send_media: async (args: {
                recipient: string;
                caption?: string;
                media_url?: string;
                media_path?: string;
            }) => {
                const sessionId = await resolveSessionId(context);
                let tempPath: string | undefined;
                try {
                    const mediaPath = args.media_path || (args.media_url ? await downloadToTempFile(args.media_url, 'whatsapp_media') : '');
                    tempPath = args.media_path ? undefined : mediaPath;

                    if (!mediaPath) {
                        return { content: 'media_path ou media_url est requis', success: false };
                    }

                    const response = await fetch(buildBridgeUrl('/api/send', sessionId), {
                        body: JSON.stringify({
                            media_path: mediaPath,
                            message: args.caption || '',
                            recipient: args.recipient,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });

                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }

                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de l\'envoi du média', error, success: false };
                } finally {
                    if (tempPath) {
                        await fs.unlink(tempPath).catch(() => undefined);
                    }
                }
            },
            whatsapp_send_voice: async (args: { recipient: string; audio_url?: string; audio_path?: string }) => {
                const sessionId = await resolveSessionId(context);
                let tempPath: string | undefined;
                try {
                    const audioPath = args.audio_path || (args.audio_url ? await downloadToTempFile(args.audio_url, 'whatsapp_voice') : '');
                    tempPath = args.audio_path ? undefined : audioPath;

                    if (!audioPath) {
                        return { content: 'audio_path ou audio_url est requis', success: false };
                    }

                    const response = await fetch(buildBridgeUrl('/api/send', sessionId), {
                        body: JSON.stringify({
                            media_path: audioPath,
                            message: '',
                            recipient: args.recipient,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });

                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }

                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de l\'envoi du message vocal', error, success: false };
                } finally {
                    if (tempPath) {
                        await fs.unlink(tempPath).catch(() => undefined);
                    }
                }
            },
            whatsapp_status: async () => {
                const sessionId = await resolveSessionId(context);
                try {
                    const statusResponse = await fetch(buildBridgeUrl('/api/status', sessionId));
                    const statusData = await parseResponse(statusResponse);
                    if (statusResponse.ok) {
                        return { content: JSON.stringify(statusData), success: true };
                    }

                    const response = await fetch(buildBridgeUrl('/api/qr', sessionId));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la vérification du statut', error, success: false };
                }
            },
            whatsapp_logout: async () => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/logout', sessionId), {
                        method: 'POST',
                    });
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la déconnexion WhatsApp', error, success: false };
                }
            },
            whatsapp_download_media: async (args: { chat_jid: string; message_id: string }) => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/download', sessionId), {
                        body: JSON.stringify({
                            chat_jid: args.chat_jid,
                            message_id: args.message_id,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });

                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors du téléchargement du média', error, success: false };
                }
            },
            whatsapp_list_contacts: async () => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/contacts', sessionId));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la récupération des contacts', error, success: false };
                }
            },
            whatsapp_list_groups: async () => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/groups', sessionId));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la récupération des groupes', error, success: false };
                }
            },
            whatsapp_get_group_info: async (args: { group_jid: string }) => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/group/info', sessionId, { jid: args.group_jid }));
                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la récupération des informations du groupe', error, success: false };
                }
            },
            whatsapp_leave_group: async (args: { group_jid: string }) => {
                const sessionId = await resolveSessionId(context);
                try {
                    const response = await fetch(buildBridgeUrl('/api/group/leave', sessionId, { jid: args.group_jid }), {
                        method: 'POST',
                    });

                    const data = await parseResponse(response);
                    if (!response.ok) {
                        return { content: JSON.stringify(data), success: false };
                    }
                    return { content: JSON.stringify(data), success: true };
                } catch (error) {
                    return { content: 'Erreur lors de la sortie du groupe', error, success: false };
                }
            },
            whatsapp_list_accounts: async () => {
                try {
                    if (!context?.serverDB || !context?.userId) {
                        return {
                            content: 'Aucun compte WhatsApp configuré. L\'utilisateur doit d\'abord configurer ses comptes dans les paramètres.',
                            success: false
                        };
                    }

                    const userModel = new UserModel(context.serverDB, context.userId);
                    const settings = await userModel.getUserSettings();

                    const tool = (settings?.tool || {}) as any;
                    const whatsapp = (tool?.whatsapp || {}) as WhatsAppAccountsSettings;
                    const accounts = whatsapp.accounts || [];
                    const activeAccountId = whatsapp.activeAccountId || accounts[0]?.id;

                    if (accounts.length === 0) {
                        return {
                            content: JSON.stringify({
                                accounts: [],
                                activeAccountId: null,
                                message: 'Aucun compte WhatsApp configuré. L\'utilisateur doit ajouter des comptes dans les paramètres WhatsApp.'
                            }),
                            success: true
                        };
                    }

                    // Vérifier le statut de connexion de chaque compte
                    const accountsWithStatus = await Promise.all(accounts.map(async (account: any) => {
                        try {
                            const userSessionId = `${context.userId}_${account.id}`;
                            const response = await fetch(buildBridgeUrl('/api/status', userSessionId));
                            const statusData = await parseResponse(response);
                            return {
                                id: account.id,
                                name: account.name || account.id,
                                phone: account.phone || null,
                                isConnected: response.ok && statusData?.connected === true,
                                isActive: account.id === activeAccountId,
                            };
                        } catch {
                            return {
                                id: account.id,
                                name: account.name || account.id,
                                phone: account.phone || null,
                                isConnected: false,
                                isActive: account.id === activeAccountId,
                            };
                        }
                    }));

                    return {
                        content: JSON.stringify({
                            accounts: accountsWithStatus,
                            activeAccountId,
                            totalCount: accounts.length,
                            connectedCount: accountsWithStatus.filter(a => a.isConnected).length,
                        }),
                        success: true
                    };
                } catch (error) {
                    return { content: 'Erreur lors de la récupération des comptes WhatsApp', error, success: false };
                }
            },
            whatsapp_switch_account: async (args: { account_id: string }) => {
                try {
                    if (!context?.serverDB || !context?.userId) {
                        return {
                            content: 'Impossible de changer de compte: contexte utilisateur non disponible.',
                            success: false
                        };
                    }

                    const userModel = new UserModel(context.serverDB, context.userId);
                    const settings = await userModel.getUserSettings();

                    const tool = (settings?.tool || {}) as any;
                    const whatsapp = (tool?.whatsapp || {}) as WhatsAppAccountsSettings;
                    const accounts = whatsapp.accounts || [];

                    // Vérifier que le compte existe
                    const targetAccount = accounts.find((a: any) => a.id === args.account_id);
                    if (!targetAccount) {
                        return {
                            content: JSON.stringify({
                                error: `Compte WhatsApp "${args.account_id}" non trouvé.`,
                                availableAccounts: accounts.map((a: any) => ({ id: a.id, name: a.name })),
                            }),
                            success: false
                        };
                    }

                    // Mettre à jour le compte actif
                    const newSettings = {
                        ...settings,
                        tool: {
                            ...tool,
                            whatsapp: {
                                ...whatsapp,
                                activeAccountId: args.account_id,
                            },
                        },
                    };

                    await userModel.updateSettings(newSettings);

                    // Vérifier le statut de connexion du nouveau compte
                    let isConnected = false;
                    try {
                        const userSessionId = `${context.userId}_${args.account_id}`;
                        const response = await fetch(buildBridgeUrl('/api/status', userSessionId));
                        const statusData = await parseResponse(response);
                        isConnected = response.ok && statusData?.connected === true;
                    } catch {
                        // Ignore les erreurs de statut
                    }

                    return {
                        content: JSON.stringify({
                            success: true,
                            message: `Compte WhatsApp changé vers "${targetAccount.name || args.account_id}"`,
                            account: {
                                id: args.account_id,
                                name: targetAccount.name || args.account_id,
                                phone: targetAccount.phone || null,
                                isConnected,
                            },
                        }),
                        success: true
                    };
                } catch (error) {
                    return { content: 'Erreur lors du changement de compte WhatsApp', error, success: false };
                }
            },
        };
    },
    identifier: WhatsAppManifest.identifier,
};
