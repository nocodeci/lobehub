'use client';

import { ActionIcon, Avatar, Flexbox, Icon } from '@lobehub/ui';
import { Alert, Badge, Button, Card, Divider, Input, Modal, Spin, Tag, Typography } from 'antd';
import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    MessageCircle,
    Phone,
    Plus,
    QrCode,
    RefreshCw,
    Trash2,
    XCircle
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';

const { Text, Title } = Typography;

const WhatsAppLogo = ({ size = 24 }: { size?: number }) => (
    <svg
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C10.2363733,22 8.57708836,21.5426667 7.13692151,20.7397113 L6.83171,20.5624 L3.79975,21.4542 C3.06935952,21.6690571 2.38822075,21.0329392 2.51987109,20.3093059 L2.54581,20.2002 L3.43756,17.1683 C2.52505,15.6594 2,13.8896 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,13.5769 4.4552,15.0444 5.24098,16.2818 C5.43935125,16.5942625 5.52373625,16.9780813 5.45651889,17.3588949 L5.41832,17.5217 L4.97667,19.0233 L6.47827,18.5817 C6.91075,18.4545 7.36114,18.5323 7.71817,18.759 C8.95564,19.5448 10.4231,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M9.10162,7.18408 C9.31746,7.09158 9.57889,7.1085 9.78556,7.25926 C10.2899867,7.62722 10.6904844,8.12075778 11.0344133,8.6034437 L11.36124,9.0774594 C11.4131531,9.15417481 11.4639333,9.22932556 11.5138,9.30228 C11.69632,9.569211 11.675287,9.9238974 11.4684886,10.165959 L11.3927,10.2422 L10.4693,10.928 C10.3778,10.996 10.3473,11.1195 10.4022,11.2195 C10.6112,11.5998 10.9834,12.1657 11.4093,12.5916 C11.8357,13.018 12.4284,13.4143 12.8348,13.6467 C12.9226333,13.69695 13.0293556,13.6810889 13.1010315,13.6156676 L13.1394,13.5706 L13.7402,12.6555 C13.9705,12.349 14.4007,12.282 14.7134,12.4984 L15.2562641,12.876825 C15.7957063,13.2618187 16.315025,13.675725 16.7255,14.2014 C16.8872,14.4085 16.9112,14.6792 16.8148,14.9042 C16.4188,15.8283 15.4165,16.6153 14.374,16.5769 L14.2154519,16.5677643 L14.2154519,16.5677643 L14.0235335,16.5487562 C13.9888929,16.5445999 13.9529568,16.5399081 13.9157727,16.5346187 L13.6780718,16.4952138 C12.7543753,16.3207908 11.2726031,15.7970103 9.73827,14.2627 C8.20396724,12.7283897 7.68016555,11.2465654 7.50573193,10.3228642 L7.46632442,10.0851634 L7.46632442,10.0851634 L7.44126064,9.87741745 L7.44126064,9.87741745 L7.42756026,9.70190572 C7.42605824,9.67546659 7.42490552,9.65046552 7.42404,9.62695 C7.38562,8.58294 8.17688,7.5804 9.10162,7.18408 Z"
            fill="#fff"
        />
    </svg>
);

type SetupStep = 'list' | 'qr' | 'error';

interface WhatsAppAccount {
    id: string;
    name?: string;
    phone?: string;
    jid?: string;
    expectedPhone?: string;
    isConnected?: boolean;
}

interface WhatsAppQRData {
    qr: string;
    paired: boolean;
}

interface WhatsAppSetupModalProps {
    open: boolean;
    onClose: () => void;
    onConnected?: () => void;
}

export const WhatsAppSetupModal = memo<WhatsAppSetupModalProps>(({ open, onClose, onConnected }) => {
    const [step, setStep] = useState<SetupStep>('list');
    const [qrData, setQrData] = useState<WhatsAppQRData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [duplicateError, setDuplicateError] = useState<string | null>(null);
    const [bridgeOnline, setBridgeOnline] = useState(true);
    const [scanningAccountId, setScanningAccountId] = useState<string | null>(null);
    const [accountsStatus, setAccountsStatus] = useState<Record<string, boolean>>({});

    const userSettings = useUserStore(settingsSelectors.currentSettings);
    const setSettings = useUserStore((s) => s.setSettings);

    const whatsappSettings = ((userSettings.tool as any)?.whatsapp || {}) as any;
    const accounts = (whatsappSettings.accounts || []) as WhatsAppAccount[];

    const persistAccounts = useCallback(async (next: { accounts: WhatsAppAccount[]; activeAccountId?: string }) => {
        await setSettings({
            tool: {
                ...(userSettings.tool as any),
                whatsapp: { ...whatsappSettings, ...next },
            },
        } as any);
    }, [setSettings, userSettings.tool, whatsappSettings]);

    const updateAccountMeta = useCallback(
        async (id: string, meta: Partial<WhatsAppAccount>) => {
            const nextAccounts = accounts.map((a) => (a.id === id ? { ...a, ...meta } : a));
            await persistAccounts({ accounts: nextAccounts });
        },
        [accounts, persistAccounts],
    );

    // Check if a phone number is already in use by any user (cross-account protection)
    const checkPhoneDuplicate = useCallback(async (phone: string, accountId: string): Promise<boolean> => {
        if (!phone) return false;
        try {
            const response = await fetch(`/api/whatsapp?action=check-phone&phone=${encodeURIComponent(phone)}`);
            const data = await response.json();
            if (data.success && data.data.exists) {
                // Phone is already in use! Force disconnect this account
                setDuplicateError(data.data.message);

                // Auto-logout the just-connected account
                try {
                    await fetch(`/api/whatsapp?action=logout&accountId=${encodeURIComponent(accountId)}`, {
                        method: 'POST',
                    });
                } catch {
                    // Ignore logout errors
                }

                // Remove the account from the list
                const nextAccounts = accounts.filter((a) => a.id !== accountId);
                if (nextAccounts.length === 0) {
                    const defaultAccount: WhatsAppAccount = {
                        id: 'whatsapp-1',
                        name: 'WhatsApp 1',
                        isConnected: false,
                    };
                    await persistAccounts({ accounts: [defaultAccount], activeAccountId: defaultAccount.id });
                } else {
                    await persistAccounts({ accounts: nextAccounts });
                }

                // Update status
                setAccountsStatus((prev) => {
                    const next = { ...prev };
                    delete next[accountId];
                    return next;
                });

                // Go back to list
                setScanningAccountId(null);
                setQrData(null);
                setStep('list');

                return true; // Duplicate found
            }
        } catch {
            // If check fails, allow the connection (fail-open for UX)
        }
        return false;
    }, [accounts, persistAccounts]);

    const checkAllAccountsStatus = useCallback(async () => {
        if (accounts.length === 0) return;

        const statusMap: Record<string, boolean> = {};
        const updatedAccounts = [...accounts];
        let hasChanges = false;
        let anyConnected = false;

        for (let i = 0; i < updatedAccounts.length; i++) {
            const account = updatedAccounts[i];
            try {
                const response = await fetch(`/api/whatsapp?action=status&accountId=${encodeURIComponent(account.id)}`);
                const data = await response.json();

                if (data.success) {
                    const isConnected = !!data.data.connected;
                    statusMap[account.id] = isConnected;

                    if (isConnected) {
                        anyConnected = true;
                        const phone = data.data.phone || '';
                        const jid = data.data.jid || '';

                        // Check for duplicate phone number (cross-account)
                        if (phone && !account.phone) {
                            const isDuplicate = await checkPhoneDuplicate(phone, account.id);
                            if (isDuplicate) {
                                statusMap[account.id] = false;
                                continue;
                            }
                        }

                        if ((phone && phone !== account.phone) || (jid && jid !== account.jid) || account.isConnected !== true) {
                            updatedAccounts[i] = {
                                ...account,
                                phone,
                                jid,
                                isConnected: true
                            };
                            hasChanges = true;
                        }
                    } else if (account.isConnected) {
                        updatedAccounts[i] = { ...account, isConnected: false };
                        hasChanges = true;
                    }
                    setBridgeOnline(data.data.bridgeRunning);
                } else {
                    statusMap[account.id] = false;
                    if (account.isConnected) {
                        updatedAccounts[i] = { ...account, isConnected: false };
                        hasChanges = true;
                    }
                }
            } catch {
                statusMap[account.id] = false;
                setBridgeOnline(false);
                if (account.isConnected) {
                    updatedAccounts[i] = { ...account, isConnected: false };
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            await persistAccounts({ accounts: updatedAccounts });
        }

        setAccountsStatus(statusMap);
        if (anyConnected && onConnected) onConnected();
    }, [accounts, onConnected, persistAccounts, checkPhoneDuplicate]);

    useEffect(() => {
        if (!open) return;

        setError(null);
        setDuplicateError(null);
        setQrData(null);
        setScanningAccountId(null);
        setStep('list');

        const init = async () => {
            if (accounts.length === 0) {
                const defaultAccount: WhatsAppAccount = {
                    id: 'whatsapp-1',
                    name: 'WhatsApp 1',
                };
                await persistAccounts({ accounts: [defaultAccount], activeAccountId: defaultAccount.id });
            }

            setLoading(true);
            await checkAllAccountsStatus();
            setLoading(false);
        };

        init();
    }, [open]);

    const addAccount = useCallback(async () => {
        const nextIndex = accounts.length + 1;
        const nextId = `whatsapp-${nextIndex}`;
        const nextAccount: WhatsAppAccount = {
            id: nextId,
            name: `WhatsApp ${nextIndex}`,
            isConnected: false,
        };
        await persistAccounts({ accounts: [...accounts, nextAccount] });
    }, [accounts, persistAccounts]);

    const deleteAccount = useCallback(
        async (id: string) => {
            if (accounts.length <= 1) return;

            const account = accounts.find((a) => a.id === id);

            Modal.confirm({
                title: 'Supprimer ce compte WhatsApp ?'
                ,
                content: (
                    <Flexbox gap={6}>
                        <Text>Cette action va déconnecter WhatsApp (logout) puis supprimer le compte.</Text>
                        <Text type="secondary">Compte: {account?.name || id}</Text>
                    </Flexbox>
                ),
                okText: 'Supprimer',
                okButtonProps: { danger: true },
                cancelText: 'Annuler',
                onOk: async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const res = await fetch(`/api/whatsapp?action=logout&accountId=${encodeURIComponent(id)}`, {
                            method: 'POST',
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || data?.success === false) {
                            throw new Error(data?.error || 'Impossible de déconnecter WhatsApp');
                        }

                        const nextAccounts = accounts.filter((a) => a.id !== id);
                        await persistAccounts({ accounts: nextAccounts });

                        setAccountsStatus((prev) => {
                            const next = { ...prev };
                            delete next[id];
                            return next;
                        });

                        if (scanningAccountId === id) {
                            setScanningAccountId(null);
                            setQrData(null);
                            setStep('list');
                        }
                    } catch (e) {
                        setError(e instanceof Error ? e.message : 'Erreur lors de la suppression');
                        throw e;
                    } finally {
                        setLoading(false);
                    }
                },
            });
        },
        [accounts, persistAccounts, scanningAccountId],
    );

    const startQRScan = useCallback(async (accountId: string) => {
        setScanningAccountId(accountId);
        setStep('qr');
        setLoading(true);
        setError(null);
        setQrData(null);

        try {
            const response = await fetch(`/api/whatsapp?action=qr&accountId=${encodeURIComponent(accountId)}`);
            const data = await response.json();

            if (data.success) {
                setQrData(data.data);
                if (data.data.paired) {
                    // Before confirming, check if the phone number is a duplicate
                    // Get the status to retrieve the phone number
                    try {
                        const statusRes = await fetch(`/api/whatsapp?action=status&accountId=${encodeURIComponent(accountId)}`);
                        const statusData = await statusRes.json();
                        if (statusData.success && statusData.data.phone) {
                            const isDuplicate = await checkPhoneDuplicate(statusData.data.phone, accountId);
                            if (isDuplicate) {
                                return; // checkPhoneDuplicate already handles cleanup
                            }
                        }
                    } catch {
                        // Continue even if check fails
                    }

                    await checkAllAccountsStatus();
                    setStep('list');
                    if (onConnected) onConnected();
                }
            } else {
                setError(data.error || 'Impossible de récupérer le QR code');
            }
        } catch {
            setError('Bridge WhatsApp non disponible');
            setBridgeOnline(false);
        } finally {
            setLoading(false);
        }
    }, [checkAllAccountsStatus, onConnected]);

    const refreshQR = useCallback(async () => {
        if (!scanningAccountId) return;
        await startQRScan(scanningAccountId);
    }, [scanningAccountId, startQRScan]);

    useEffect(() => {
        if (step !== 'qr' || !open || !scanningAccountId) return;

        const interval = setInterval(async () => {
            if (qrData?.paired) return;

            try {
                const response = await fetch(`/api/whatsapp?action=qr&accountId=${encodeURIComponent(scanningAccountId)}`);
                const data = await response.json();

                if (data.success) {
                    setQrData(data.data);
                    if (data.data.paired) {
                        // Check for duplicate phone before confirming
                        try {
                            const statusRes = await fetch(`/api/whatsapp?action=status&accountId=${encodeURIComponent(scanningAccountId)}`);
                            const statusData = await statusRes.json();
                            if (statusData.success && statusData.data.phone) {
                                const isDuplicate = await checkPhoneDuplicate(statusData.data.phone, scanningAccountId);
                                if (isDuplicate) {
                                    return; // Cleanup handled by checkPhoneDuplicate
                                }
                            }
                        } catch {
                            // Continue even if check fails
                        }

                        await checkAllAccountsStatus();
                        setStep('list');
                        if (onConnected) onConnected();
                    }
                }
            } catch {
                // Ignore errors during auto-refresh
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [step, open, scanningAccountId, qrData?.paired, checkAllAccountsStatus, onConnected]);

    const WHATSAPP_TOOLS = [
        'whatsapp_send_message',
        'whatsapp_status',
        'whatsapp_download_media',
        'whatsapp_list_contacts',
        'whatsapp_list_groups',
        'whatsapp_get_group_info',
        'whatsapp_leave_group',
    ];

    const renderAccountCard = (account: WhatsAppAccount) => {
        const isConnected = accountsStatus[account.id] || false;

        return (
            <Card key={account.id} size="small" style={{ marginBottom: 12 }}>
                <Flexbox align="center" gap={12} horizontal justify="space-between">
                    <Flexbox align="center" gap={12} horizontal style={{ flex: 1 }}>
                        <Badge status={isConnected ? 'success' : 'default'} />
                        <Flexbox gap={2} style={{ flex: 1 }}>
                            <Input
                                variant="borderless"
                                placeholder="Nom du compte"
                                value={account.name || ''}
                                onChange={(e) => updateAccountMeta(account.id, { name: e.target.value })}
                                style={{ fontWeight: 500, padding: 0 }}
                            />
                            <Flexbox gap={8} horizontal>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {isConnected ? '✅ Connecté' : '⚠️ Non connecté'}
                                </Text>
                                {account.phone && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        • {account.phone}
                                    </Text>
                                )}
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>

                    <Flexbox gap={8} horizontal>
                        {!isConnected && (
                            <Button
                                type="primary"
                                icon={<QrCode size={16} />}
                                onClick={() => startQRScan(account.id)}
                                size="small"
                            >
                                Scanner QR
                            </Button>
                        )}

                        {accounts.length > 1 && (
                            <ActionIcon
                                icon={Trash2}
                                size="small"
                                onClick={() => deleteAccount(account.id)}
                                title="Supprimer"
                            />
                        )}
                    </Flexbox>
                </Flexbox>
            </Card>
        );
    };

    const renderListStep = () => (
        <Flexbox gap={16} style={{ padding: 24 }}>
            <Flexbox align="center" gap={12} horizontal>
                <Avatar avatar={<Icon icon={Phone} />} background="rgba(37, 211, 102, 0.15)" size={40} />
                <Flexbox gap={2}>
                    <Title level={4} style={{ margin: 0 }}>Comptes WhatsApp</Title>
                    <Text type="secondary">Gérez vos comptes WhatsApp connectés</Text>
                </Flexbox>
            </Flexbox>

            {!bridgeOnline && (
                <Alert
                    message="Bridge hors ligne"
                    description="Le bridge WhatsApp n'est pas en cours d'exécution."
                    type="error"
                    showIcon
                />
            )}

            {duplicateError && (
                <Alert
                    message="Numéro WhatsApp déjà utilisé"
                    description={
                        <Flexbox gap={8}>
                            <Text>{duplicateError}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                📧 Contactez le service client : support@wozif.com
                            </Text>
                        </Flexbox>
                    }
                    type="warning"
                    showIcon
                    closable
                    onClose={() => setDuplicateError(null)}
                />
            )}

            {loading ? (
                <Flexbox align="center" gap={12} style={{ padding: 24 }}>
                    <Spin indicator={<Loader2 className="animate-spin" size={32} />} />
                    <Text>Vérification des comptes...</Text>
                </Flexbox>
            ) : (
                <>
                    <Flexbox gap={0}>
                        {accounts.map(renderAccountCard)}
                    </Flexbox>

                    <Button
                        icon={<Plus size={16} />}
                        onClick={addAccount}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        Ajouter un compte
                    </Button>
                </>
            )}

            <Divider style={{ margin: '8px 0' }} />

            <Card size="small" title={<Flexbox align="center" gap={8} horizontal><Icon icon={MessageCircle} size={16} />Outils disponibles</Flexbox>}>
                <Flexbox gap={8} horizontal style={{ flexWrap: 'wrap' }}>
                    {WHATSAPP_TOOLS.map((tool) => (
                        <Tag key={tool}>{tool}</Tag>
                    ))}
                </Flexbox>
            </Card>
        </Flexbox>
    );

    const renderQRStep = () => {
        const scanningAccount = accounts.find((a) => a.id === scanningAccountId);

        if (loading && !qrData?.qr) {
            return (
                <Flexbox align="center" gap={12} style={{ padding: 24 }}>
                    <Spin indicator={<Loader2 className="animate-spin" size={48} />} />
                    <Text>Génération du QR code...</Text>
                </Flexbox>
            );
        }

        return (
            <Flexbox gap={16} style={{ padding: 24 }}>
                <Flexbox align="center" gap={8} horizontal>
                    <ActionIcon icon={ArrowLeft} onClick={() => setStep('list')} title="Retour" />
                    <Title level={4} style={{ margin: 0 }}>Scanner le QR Code</Title>
                </Flexbox>

                <Text type="secondary">
                    Compte : <strong>{scanningAccount?.name || scanningAccountId}</strong>
                </Text>

                {error && <Alert message={error} type="error" showIcon />}

                {qrData?.qr ? (
                    <Card size="small" style={{ width: 280, marginInline: 'auto' }}>
                        <Flexbox align="center" style={{ padding: 8 }}>
                            <QRCode value={qrData.qr} size={220} />
                        </Flexbox>
                    </Card>
                ) : (
                    <Alert
                        message="QR Code non disponible"
                        description="En attente du QR code..."
                        type="info"
                        showIcon
                    />
                )}

                <Alert
                    message="Instructions"
                    description={
                        <Flexbox gap={6}>
                            <Text>1. Ouvrez WhatsApp sur votre téléphone</Text>
                            <Text>2. Paramètres → Appareils liés</Text>
                            <Text>3. Lier un appareil → scanner ce QR</Text>
                        </Flexbox>
                    }
                    type="info"
                    showIcon
                />

                <Flexbox gap={8} horizontal>
                    <Button onClick={() => setStep('list')}>Retour</Button>
                    <ActionIcon icon={RefreshCw} loading={loading} onClick={refreshQR} title="Actualiser" />
                </Flexbox>
            </Flexbox>
        );
    };

    const renderErrorStep = () => (
        <Flexbox gap={12} style={{ padding: 24 }}>
            <Flexbox align="center" gap={8} horizontal>
                <Avatar avatar={<Icon icon={XCircle} />} background="rgba(255, 77, 79, 0.15)" size={40} />
                <Title level={4} style={{ margin: 0 }}>Bridge WhatsApp hors ligne</Title>
            </Flexbox>

            <Alert
                message="Bridge non disponible"
                description={
                    <Flexbox gap={8}>
                        <Text>Le serveur bridge WhatsApp n'est pas en cours d'exécution. Démarrez-le avec :</Text>
                        <code style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: 6, display: 'block', fontSize: 12 }}>
                            cd whatsapp-mcp/whatsapp-bridge && go run main.go
                        </code>
                    </Flexbox>
                }
                type="error"
                showIcon
            />

            <Button onClick={() => { setError(null); setStep('list'); checkAllAccountsStatus(); }}>
                Réessayer
            </Button>
        </Flexbox>
    );

    const renderContent = () => {
        switch (step) {
            case 'list':
                return renderListStep();
            case 'qr':
                return renderQRStep();
            case 'error':
                return renderErrorStep();
            default:
                return renderListStep();
        }
    };

    return (
        <Modal
            centered
            footer={null}
            onCancel={onClose}
            open={open}
            title={
                <Flexbox align="center" gap={8} horizontal>
                    <Avatar avatar={<WhatsAppLogo size={18} />} background="rgba(37, 211, 102, 0.15)" size={28} />
                    <span>Connecter WhatsApp</span>
                </Flexbox>
            }
            width={700}
        >
            {renderContent()}
        </Modal>
    );
});

WhatsAppSetupModal.displayName = 'WhatsAppSetupModal';

export default WhatsAppSetupModal;
