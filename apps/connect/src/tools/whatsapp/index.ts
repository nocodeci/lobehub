import { type BuiltinToolManifest } from '@lobechat/types';

import { systemPrompt } from './systemRole';

// WhatsApp official logo URL
const whatsappAvatar = 'https://hub-apac-1.lobeobjects.space/assets/logos/whatsapp.svg';

export const WhatsAppManifest: BuiltinToolManifest = {
    api: [
        {
            description: 'Envoyer un message WhatsApp à un destinataire. Le destinataire peut être un numéro de téléphone (ex: "33612345678" sans le "+") ou un JID WhatsApp.',
            name: 'whatsapp_send_message',
            parameters: {
                properties: {
                    message: {
                        description: 'Le contenu du message à envoyer',
                        type: 'string',
                    },
                    recipient: {
                        description: 'Le numéro de téléphone du destinataire (format international sans le +, ex: 33612345678) ou le JID WhatsApp',
                        type: 'string',
                    },
                },
                required: ['recipient', 'message'],
                type: 'object',
            },
        },
        {
            description: 'Envoyer un média WhatsApp (image, vidéo, document, audio) à un destinataire. Le média peut être fourni via une URL accessible par le serveur.',
            name: 'whatsapp_send_media',
            parameters: {
                properties: {
                    caption: {
                        description: 'Texte optionnel (caption) à joindre au média',
                        type: 'string',
                    },
                    media_path: {
                        description: 'Chemin local (optionnel) vers le fichier à envoyer. Si fourni, media_url est ignoré.',
                        type: 'string',
                    },
                    media_url: {
                        description: 'URL du fichier à envoyer (image/video/document/audio).',
                        type: 'string',
                    },
                    recipient: {
                        description: 'Le numéro de téléphone du destinataire (format international sans le +, ex: 33612345678) ou le JID WhatsApp',
                        type: 'string',
                    },
                },
                required: ['recipient'],
                type: 'object',
            },
        },
        {
            description: 'Envoyer un message vocal (voice note) WhatsApp. Utilise un fichier audio, idéalement en .ogg (opus).',
            name: 'whatsapp_send_voice',
            parameters: {
                properties: {
                    audio_path: {
                        description: 'Chemin local (optionnel) vers le fichier audio (ogg/mp3/m4a/wav). Si fourni, audio_url est ignoré.',
                        type: 'string',
                    },
                    audio_url: {
                        description: 'URL du fichier audio à envoyer (ogg recommandé).',
                        type: 'string',
                    },
                    recipient: {
                        description: 'Le numéro de téléphone du destinataire (format international sans le +, ex: 33612345678) ou le JID WhatsApp',
                        type: 'string',
                    },
                },
                required: ['recipient'],
                type: 'object',
            },
        },
        {
            description: 'Lire les derniers messages d\'une conversation WhatsApp.',
            name: 'whatsapp_read_messages',
            parameters: {
                properties: {
                    chat_jid: {
                        description: 'Le JID du chat WhatsApp (ex: 33612345678@s.whatsapp.net pour un contact personnel)',
                        type: 'string',
                    },
                    limit: {
                        default: 10,
                        description: 'Nombre maximum de messages à récupérer (défaut: 10)',
                        type: 'number',
                    },
                },
                required: ['chat_jid'],
                type: 'object',
            },
        },
        {
            description: 'Obtenir la liste des conversations WhatsApp récentes.',
            name: 'whatsapp_list_chats',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Vérifier le statut de connexion WhatsApp.',
            name: 'whatsapp_status',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Télécharger un média (image, audio, document) à partir d\'un message WhatsApp.',
            name: 'whatsapp_download_media',
            parameters: {
                properties: {
                    chat_jid: {
                        description: 'Le JID du chat contenant le média',
                        type: 'string',
                    },
                    message_id: {
                        description: 'L\'ID du message contenant le média',
                        type: 'string',
                    },
                },
                required: ['message_id', 'chat_jid'],
                type: 'object',
            },
        },
        {
            description: 'Obtenir la liste des contacts WhatsApp enregistrés.',
            name: 'whatsapp_list_contacts',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Obtenir la liste des groupes WhatsApp rejoints.',
            name: 'whatsapp_list_groups',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Obtenir des informations détaillées sur un groupe WhatsApp (membres, description, etc.).',
            name: 'whatsapp_get_group_info',
            parameters: {
                properties: {
                    group_jid: {
                        description: 'Le JID du groupe WhatsApp (ex: 12345678@g.us)',
                        type: 'string',
                    },
                },
                required: ['group_jid'],
                type: 'object',
            },
        },
        {
            description: 'Quitter un groupe WhatsApp.',
            name: 'whatsapp_leave_group',
            parameters: {
                properties: {
                    group_jid: {
                        description: 'Le JID du groupe WhatsApp à quitter',
                        type: 'string',
                    },
                },
                required: ['group_jid'],
                type: 'object',
            },
        },
        {
            description: 'Déconnecter (logout) la session WhatsApp du bridge.',
            name: 'whatsapp_logout',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Lister tous les comptes WhatsApp configurés par l\'utilisateur, avec leur statut de connexion et lequel est actuellement actif.',
            name: 'whatsapp_list_accounts',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
        {
            description: 'Changer le compte WhatsApp actif. L\'IA peut utiliser cet outil pour basculer vers un autre compte WhatsApp configuré.',
            name: 'whatsapp_switch_account',
            parameters: {
                properties: {
                    account_id: {
                        description: 'L\'identifiant du compte WhatsApp à activer (obtenu via whatsapp_list_accounts)',
                        type: 'string',
                    },
                },
                required: ['account_id'],
                type: 'object',
            },
        },
    ],
    identifier: 'lobe-whatsapp-local',
    meta: {
        avatar: whatsappAvatar,
        title: 'WhatsApp',
    },
    systemRole: systemPrompt,
    type: 'builtin',
};
