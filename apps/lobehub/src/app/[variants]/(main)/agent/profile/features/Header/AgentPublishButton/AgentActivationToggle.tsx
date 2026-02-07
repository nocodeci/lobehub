'use client';

import { Button, Icon } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { Power, PowerOff } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/components/AntdStaticMethods';
import { lambdaClient } from '@/libs/trpc/client';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

/**
 * Agent Activation Toggle Component
 * 
 * Simple toggle button to activate/deactivate an agent for production use (24/7)
 * - Activated: Agent is running in production mode (e.g., WhatsApp Bridge)
 * - Deactivated: Agent is stopped
 */
const AgentActivationToggle = memo(() => {
    const { t } = useTranslation('setting');
    const [isLoading, setIsLoading] = useState(false);

    const meta = useAgentStore(agentSelectors.currentAgentMeta, isEqual);
    const updateAgentMeta = useAgentStore((s) => s.updateAgentMeta);

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
                // Deactivate: Set marketIdentifier to empty string (null/undefined don't work)
                setLocalIsActive(false); // Immediate UI feedback
                await updateAgentMeta({ marketIdentifier: '' });
                message.success(t('agentActivation.deactivated'));
            } else {
                // Activate: Call the server to get an identifier
                const result = await lambdaClient.market.agent.publishOrCreate.mutate({
                    avatar: meta?.avatar,
                    config: {},
                    description: meta?.description || '',
                    identifier: meta?.marketIdentifier || undefined,
                    name: meta?.title || 'Agent',
                    tags: meta?.tags,
                });

                if (result.success && result.identifier) {
                    setLocalIsActive(true); // Immediate UI feedback
                    await updateAgentMeta({ marketIdentifier: result.identifier });
                    message.success(t('agentActivation.activated'));
                }
            }
        } catch (error) {
            // Revert local state on error
            setLocalIsActive(!!meta?.marketIdentifier);
            console.error('Agent activation error:', error);
            message.error(t('agentActivation.error'));
        } finally {
            setIsLoading(false);
        }
    }, [localIsActive, isLoading, meta, t, updateAgentMeta]);

    return (
        <Button
            icon={<Icon icon={localIsActive ? Power : PowerOff} />}
            loading={isLoading}
            onClick={handleToggle}
            type={localIsActive ? 'primary' : 'default'}
        >
            {localIsActive ? t('agentActivation.active') : t('agentActivation.inactive')}
        </Button>
    );
});

AgentActivationToggle.displayName = 'AgentActivationToggle';

export default AgentActivationToggle;
