import { useCallback, useEffect, useRef, useState } from 'react';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';

interface WhatsAppAccount {
    id: string;
    isConnected?: boolean;
    jid?: string;
    name?: string;
    phone?: string;
}

/**
 * Hook pour gérer et synchroniser le statut des comptes WhatsApp
 */
export const useWhatsAppStatus = () => {
    const [accountsStatus, setAccountsStatus] = useState<Record<string, boolean>>({});
    const [isChecking, setIsChecking] = useState(false);
    const checkingRef = useRef(false);

    const userSettings = useUserStore(settingsSelectors.currentSettings);
    const setSettings = useUserStore((s) => s.setSettings);

    const whatsappSettings = ((userSettings.tool as any)?.whatsapp || {}) as any;
    const accounts = (whatsappSettings.accounts || []) as WhatsAppAccount[];

    // Utiliser useRef pour éviter les re-renders inutiles
    const accountsRef = useRef(accounts);
    accountsRef.current = accounts;

    const updateAccountMeta = useCallback(
        async (id: string, meta: Partial<WhatsAppAccount>) => {
            const currentAccounts = accountsRef.current;
            const account = currentAccounts.find((a) => a.id === id);

            // Ne mettre à jour que si les données ont changé
            if (account) {
                const hasChanged =
                    meta.isConnected !== account.isConnected ||
                    meta.phone !== account.phone ||
                    meta.jid !== account.jid;

                if (!hasChanged) return;
            }

            const nextAccounts = currentAccounts.map((a) => (a.id === id ? { ...a, ...meta } : a));

            await setSettings({
                tool: {
                    ...(userSettings.tool as any),
                    whatsapp: { ...whatsappSettings, accounts: nextAccounts },
                },
            } as any);
        },
        [setSettings, userSettings.tool, whatsappSettings],
    );

    const checkAccountStatus = useCallback(
        async (accountId: string): Promise<boolean> => {
            try {
                const response = await fetch(
                    `/api/whatsapp?action=status&accountId=${encodeURIComponent(accountId)}`,
                );
                const data = await response.json();

                if (data.success && data.data.connected) {
                    await updateAccountMeta(accountId, {
                        phone: data.data.phone,
                        jid: data.data.jid,
                        isConnected: true,
                    });
                    return true;
                } else {
                    await updateAccountMeta(accountId, { isConnected: false });
                    return false;
                }
            } catch {
                await updateAccountMeta(accountId, { isConnected: false });
                return false;
            }
        },
        [updateAccountMeta],
    );

    const checkAllAccountsStatus = useCallback(async () => {
        if (checkingRef.current) return;

        const currentAccounts = accountsRef.current;
        if (currentAccounts.length === 0) return;

        checkingRef.current = true;
        setIsChecking(true);

        const statusMap: Record<string, boolean> = {};

        for (const account of currentAccounts) {
            const isConnected = await checkAccountStatus(account.id);
            statusMap[account.id] = isConnected;
        }

        setAccountsStatus(statusMap);
        setIsChecking(false);
        checkingRef.current = false;
    }, [checkAccountStatus]);

    // Vérifier le statut au montage et toutes les 30 secondes
    useEffect(() => {
        checkAllAccountsStatus();

        const interval = setInterval(() => {
            checkAllAccountsStatus();
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [checkAllAccountsStatus]);

    return {
        accountsStatus,
        checkAccountStatus,
        checkAllAccountsStatus,
        isChecking,
    };
};
