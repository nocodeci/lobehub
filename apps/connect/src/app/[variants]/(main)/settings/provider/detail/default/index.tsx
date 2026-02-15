'use client';

import { Alert, Button } from 'antd';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useBYOKCheck } from '@/hooks/useSubscription';
import { useAiInfraStore } from '@/store/aiInfra';
import { useServerConfigStore } from '@/store/serverConfig';

import ModelList from '../../features/ModelList';
import ProviderConfig, { type ProviderConfigProps } from '../../features/ProviderConfig';

interface ProviderDetailProps extends ProviderConfigProps {
  showConfig?: boolean;
}
const ProviderDetail = memo<ProviderDetailProps>(({ showConfig = true, ...card }) => {
  const useFetchAiProviderItem = useAiInfraStore((s) => s.useFetchAiProviderItem);
  const useFetchAiProviderList = useAiInfraStore((s) => s.useFetchAiProviderList);
  const isMobile = useServerConfigStore((s) => s.isMobile);

  const { canUseBYOK, plan } = useBYOKCheck();

  useFetchAiProviderList({ enabled: isMobile });
  useFetchAiProviderItem(card.id);

  return (
    <Flexbox gap={24} paddingBlock={8}>
      {/* BYOK restriction banner for Free/Starter plans */}
      {!canUseBYOK && (
        <Alert
          description={
            <Flexbox gap={8}>
              <span>
                La configuration de vos propres clés API (BYOK) est disponible à partir du plan Pro.
                Vous êtes actuellement sur le plan <strong>{plan === 'free' ? 'Gratuit' : 'Starter'}</strong>.
              </span>
              <Button
                href="/subscription"
                size="small"
                style={{ alignSelf: 'flex-start' }}
                type="primary"
              >
                Passer au plan Pro
              </Button>
            </Flexbox>
          }
          message="Fonctionnalité BYOK — Plan Pro requis"
          showIcon
          type="warning"
        />
      )}
      {showConfig && <ProviderConfig {...card} />}
      <ModelList id={card.id} {...card.settings} />
    </Flexbox>
  );
});

export default ProviderDetail;
