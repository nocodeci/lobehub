'use client';

import { Flexbox } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { Loader2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/components/AntdStaticMethods';
import { useAgentGroupStore } from '@/store/agentGroup';
import { agentGroupSelectors } from '@/store/agentGroup/selectors';

/**
 * Group Activation Toggle Component
 *
 * Simple toggle button to activate/deactivate a group for production use (24/7)
 * - Activated: Group is running in production mode
 * - Deactivated: Group is stopped
 */
const GroupActivationToggle = memo(() => {
    const { t } = useTranslation('setting');
    const [isLoading, setIsLoading] = useState(false);

    const meta = useAgentGroupStore(agentGroupSelectors.currentGroupMeta, isEqual);
    const updateGroupMeta = useAgentGroupStore((s) => s.updateGroupMeta);

    // Use local state to track activation for immediate UI feedback
    const [localIsActive, setLocalIsActive] = useState(!!meta?.marketIdentifier);

    // Sync local state with store when meta changes
    useEffect(() => {
        setLocalIsActive(!!meta?.marketIdentifier);
    }, [meta?.marketIdentifier]);

    const handleToggle = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            if (localIsActive) {
                // Deactivate
                setLocalIsActive(false);
                await updateGroupMeta({ marketIdentifier: '' });
                message.success(t('agentActivation.deactivated'));
            } else {
                // Activate: generate a local identifier
                const identifier = `group-active-${Date.now()}`;
                setLocalIsActive(true);
                await updateGroupMeta({ marketIdentifier: identifier });
                message.success(t('agentActivation.activated'));
            }
        } catch (error) {
            // Revert local state on error
            setLocalIsActive(!!meta?.marketIdentifier);
            console.error('Group activation error:', error);
            message.error(t('agentActivation.error'));
        } finally {
            setIsLoading(false);
        }
    }, [localIsActive, isLoading, meta, t, updateGroupMeta]);

    return (
        <Flexbox
            align="center"
            gap={8}
            horizontal
            onClick={handleToggle}
            style={{
                background: localIsActive
                    ? 'linear-gradient(135deg, rgba(82, 196, 26, 0.12), rgba(82, 196, 26, 0.06))'
                    : cssVar.colorFillTertiary,
                border: `1px solid ${localIsActive ? 'rgba(82, 196, 26, 0.35)' : cssVar.colorBorderSecondary}`,
                borderRadius: 20,
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                padding: '6px 14px 6px 10px',
                transition: 'all 0.25s ease',
                userSelect: 'none',
            }}
        >
            {isLoading ? (
                <Loader2
                    size={14}
                    style={{
                        animation: 'spin 1s linear infinite',
                        color: localIsActive ? '#52c41a' : cssVar.colorTextTertiary,
                    }}
                />
            ) : (
                <Flexbox
                    align="center"
                    justify="center"
                    style={{
                        background: localIsActive ? '#52c41a' : cssVar.colorTextQuaternary,
                        borderRadius: '50%',
                        boxShadow: localIsActive ? '0 0 6px rgba(82, 196, 26, 0.5)' : 'none',
                        height: 8,
                        transition: 'all 0.25s ease',
                        width: 8,
                    }}
                />
            )}
            <span
                style={{
                    color: localIsActive ? '#52c41a' : cssVar.colorTextSecondary,
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1,
                    transition: 'color 0.25s ease',
                }}
            >
                {localIsActive ? t('agentActivation.active') : t('agentActivation.inactive')}
            </span>
        </Flexbox>
    );
});

GroupActivationToggle.displayName = 'GroupActivationToggle';

export default GroupActivationToggle;
