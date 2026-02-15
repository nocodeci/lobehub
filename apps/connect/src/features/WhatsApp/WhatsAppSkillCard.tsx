'use client';

import { ActionIcon, Block, DropdownMenu, Flexbox, Icon } from '@lobehub/ui';
import { App } from 'antd';
import { Loader2, MoreVerticalIcon, Plus, QrCode, Unplug, UserPlus } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';

import { itemStyles } from '../SkillStore/style';
import WhatsAppSetupModal from './WhatsAppSetupModal';

const WHATSAPP_ICON_URL = 'https://hub-apac-1.lobeobjects.space/assets/logos/whatsapp.svg';

interface WhatsAppSkillCardProps {
    isConnected?: boolean;
    onConnect?: () => void;
}

export const WhatsAppSkillCard = memo<WhatsAppSkillCardProps>(({
    onConnect
}) => {
    const styles = itemStyles;
    const { modal } = App.useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    // Read real WhatsApp connection status from user settings
    const userSettings = useUserStore(settingsSelectors.currentSettings);
    const setSettings = useUserStore((s) => s.setSettings);
    const whatsappSettings = ((userSettings.tool as any)?.whatsapp || {}) as any;
    const whatsappAccounts = useMemo(
        () => (whatsappSettings.accounts || []) as any[],
        [whatsappSettings.accounts],
    );

    const connectedAccounts = useMemo(
        () => whatsappAccounts.filter((a: any) => a.isConnected),
        [whatsappAccounts],
    );
    const isConnected = connectedAccounts.length > 0;
    const totalAccounts = whatsappAccounts.length;

    const handleConnect = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setModalOpen(true);
    }, []);

    const handleConnected = useCallback(() => {
        onConnect?.();
    }, [onConnect]);

    const handleDisconnectAll = useCallback(async () => {
        setIsDisconnecting(true);
        try {
            for (const account of whatsappAccounts) {
                await fetch(`/api/whatsapp?action=logout&accountId=${encodeURIComponent(account.id)}`, {
                    method: 'POST',
                });
            }
            // Update all accounts as disconnected
            const updatedAccounts = whatsappAccounts.map((a: any) => ({
                ...a,
                isConnected: false,
            }));
            await setSettings({
                tool: {
                    ...(userSettings.tool as any),
                    whatsapp: { ...whatsappSettings, accounts: updatedAccounts },
                },
            } as any);
        } catch (error) {
            console.error('Failed to disconnect WhatsApp:', error);
        }
        setIsDisconnecting(false);
    }, [whatsappAccounts, setSettings, userSettings.tool, whatsappSettings]);

    const confirmDisconnect = useCallback(() => {
        modal.confirm({
            cancelText: 'Annuler',
            centered: true,
            content: 'Cela déconnectera tous vos comptes WhatsApp de Connect.',
            okButtonProps: { danger: true },
            okText: 'Déconnecter',
            onOk: handleDisconnectAll,
            title: 'Déconnecter WhatsApp ?',
        });
    }, [modal, handleDisconnectAll]);

    // Build description based on connection status
    const description = useMemo(() => {
        if (isConnected) {
            const names = connectedAccounts
                .map((a: any) => a.phone || a.name || a.id)
                .join(', ');
            return `${connectedAccounts.length}/${totalAccounts} connecté${connectedAccounts.length > 1 ? 's' : ''} — ${names}`;
        }
        if (totalAccounts > 0) {
            return `${totalAccounts} compte${totalAccounts > 1 ? 's' : ''} — Aucun connecté`;
        }
        return 'Envoyer et recevoir des messages WhatsApp';
    }, [isConnected, connectedAccounts, totalAccounts]);

    const renderAction = () => {
        if (isDisconnecting) {
            return <ActionIcon icon={Loader2} loading />;
        }

        if (isConnected) {
            return (
                <DropdownMenu
                    items={[
                        {
                            icon: <Icon icon={UserPlus} />,
                            key: 'add-account',
                            label: 'Ajouter un compte',
                            onClick: () => setModalOpen(true),
                        },
                        {
                            icon: <Icon icon={QrCode} />,
                            key: 'manage',
                            label: 'Gérer les comptes',
                            onClick: () => setModalOpen(true),
                        },
                        { type: 'divider' as const, key: 'divider' },
                        {
                            danger: true,
                            icon: <Icon icon={Unplug} />,
                            key: 'disconnect',
                            label: 'Déconnecter tout',
                            onClick: confirmDisconnect,
                        },
                    ]}
                    nativeButton={false}
                    placement="bottomRight"
                >
                    <ActionIcon icon={MoreVerticalIcon} />
                </DropdownMenu>
            );
        }

        return (
            <ActionIcon
                icon={Plus}
                onClick={handleConnect}
                title="Connecter WhatsApp"
            />
        );
    };

    return (
        <>
            <Block
                align={'center'}
                className={styles.container}
                gap={12}
                horizontal
                onClick={() => setModalOpen(true)}
                paddingBlock={12}
                paddingInline={12}
                style={{ cursor: 'pointer' }}
                variant={'outlined'}
            >
                <img alt="WhatsApp" height={40} src={WHATSAPP_ICON_URL} width={40} />
                <Flexbox flex={1} gap={4} style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span className={styles.title}>WhatsApp</span>
                    <span className={styles.description}>
                        {description}
                    </span>
                </Flexbox>
                <div onClick={(e) => e.stopPropagation()}>{renderAction()}</div>
            </Block>

            <WhatsAppSetupModal
                onClose={() => setModalOpen(false)}
                onConnected={handleConnected}
                open={modalOpen}
            />
        </>
    );
});

WhatsAppSkillCard.displayName = 'WhatsAppSkillCard';

export default WhatsAppSkillCard;
