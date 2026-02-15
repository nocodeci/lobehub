'use client';

import { Alert, Button } from 'antd';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import Loading from '@/components/Loading/BrandTextLoading';
import { useBYOKCheck } from '@/hooks/useSubscription';
import { useClientDataSWR } from '@/libs/swr';
import { aiProviderService } from '@/services/aiProvider';
import { useAiInfraStore } from '@/store/aiInfra';

import ModelList from '../../features/ModelList';
import ProviderConfig from '../../features/ProviderConfig';

const ClientMode = memo<{ id: string }>(({ id }) => {
  const useFetchAiProviderItem = useAiInfraStore((s) => s.useFetchAiProviderItem);
  useFetchAiProviderItem(id);

  const { canUseBYOK, plan } = useBYOKCheck();

  const { data, isLoading } = useClientDataSWR(`get-client-provider-${id}`, () =>
    aiProviderService.getAiProviderById(id),
  );

  if (isLoading || !data || !data.id) return <Loading debugId="Provider > ClientMode" />;

  return (
    <Flexbox gap={24} paddingBlock={8}>
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
      <ProviderConfig {...data} id={id} name={data.name || ''} />
      <ModelList id={id} />
    </Flexbox>
  );
});

export default ClientMode;
