import { ActionIcon, Block, Flexbox, Icon } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { LucideArrowRight, LucideBolt } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import urlJoin from 'url-join';

import { ModelItemRender, ProviderItemRender } from '@/components/ModelSelect';

import { styles } from '../../styles';
import type { ListItem } from '../../types';
import { menuKey } from '../../utils';
import { MultipleProvidersModelItem } from './MultipleProvidersModelItem';
import { SingleProviderModelItem } from './SingleProviderModelItem';

interface ListItemRendererProps {
  activeKey: string;
  isProviderEnabled?: (providerId: string) => boolean;
  isScrolling: boolean;
  item: ListItem;
  newLabel: string;
  onClose: () => void;
  onModelChange: (modelId: string, providerId: string) => Promise<void>;
}

export const ListItemRenderer = memo<ListItemRendererProps>(
  ({ activeKey, isProviderEnabled, isScrolling, item, newLabel, onModelChange, onClose }) => {
    const { t } = useTranslation('components');
    const navigate = useNavigate();

    const getProviderEnabled = (providerId: string) => isProviderEnabled?.(providerId) ?? true;

    switch (item.type) {
      case 'no-provider': {
        return (
          <Block
            className={styles.menuItem}
            clickable
            gap={8}
            horizontal
            key="no-provider"
            onClick={() => navigate('/settings/provider/all')}
            style={{ color: cssVar.colorTextTertiary }}
            variant={'borderless'}
          >
            {t('ModelSwitchPanel.emptyProvider')}
            <Icon icon={LucideArrowRight} />
          </Block>
        );
      }

      case 'group-header': {
        const disabled = !getProviderEnabled(item.provider.id);

        return (
          <Flexbox
            className={styles.groupHeader}
            horizontal
            justify="space-between"
            key={`header-${item.provider.id}`}
            paddingBlock={'12px 4px'}
            paddingInline={'12px 8px'}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            <ProviderItemRender
              logo={item.provider.logo}
              name={item.provider.name}
              provider={item.provider.id}
              source={item.provider.source}
            />
            <ActionIcon
              className="settings-icon"
              disabled={disabled}
              icon={LucideBolt}
              onClick={(e) => {
                if (disabled) return;
                e.preventDefault();
                e.stopPropagation();
                const url = urlJoin('/settings/provider', item.provider.id || 'all');
                if (e.ctrlKey || e.metaKey) {
                  window.open(url, '_blank');
                } else {
                  navigate(url);
                }
              }}
              size={'small'}
              title={t('ModelSwitchPanel.goToSettings')}
            />
          </Flexbox>
        );
      }

      case 'empty-model': {
        return (
          <Flexbox
            className={styles.menuItem}
            gap={8}
            horizontal
            key={`empty-${item.provider.id}`}
            onClick={() => navigate(`/settings/provider/${item.provider.id}`)}
            style={{ color: cssVar.colorTextTertiary }}
          >
            {t('ModelSwitchPanel.emptyModel')}
            <Icon icon={LucideArrowRight} />
          </Flexbox>
        );
      }

      case 'provider-model-item': {
        const key = menuKey(item.provider.id, item.model.id);
        const isActive = key === activeKey;
        const disabled = !getProviderEnabled(item.provider.id);

        return (
          <Block
            className={styles.menuItem}
            clickable={!disabled}
            key={key}
            onClick={
              disabled
                ? undefined
                : async () => {
                    onModelChange(item.model.id, item.provider.id);
                    onClose();
                  }
            }
            style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            variant={isActive ? 'filled' : 'borderless'}
          >
            <ModelItemRender
              {...item.model}
              {...item.model.abilities}
              newBadgeLabel={newLabel}
              showInfoTag
            />
          </Block>
        );
      }

      case 'model-item-single': {
        const singleProvider = item.data.providers[0];
        const key = menuKey(singleProvider.id, item.data.model.id);
        const isActive = key === activeKey;
        const disabled = !getProviderEnabled(singleProvider.id);

        return (
          <Block
            className={styles.menuItem}
            clickable={!disabled}
            key={key}
            onClick={
              disabled
                ? undefined
                : async () => {
                    onModelChange(item.data.model.id, singleProvider.id);
                    onClose();
                  }
            }
            style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            variant={isActive ? 'filled' : 'borderless'}
          >
            <SingleProviderModelItem data={item.data} newLabel={newLabel} />
          </Block>
        );
      }

      case 'model-item-multiple': {
        return (
          <Flexbox key={item.data.displayName} style={{ marginBlock: 1, marginInline: 4 }}>
            <MultipleProvidersModelItem
              activeKey={activeKey}
              data={item.data}
              isScrolling={isScrolling}
              isProviderEnabled={getProviderEnabled}
              newLabel={newLabel}
              onClose={onClose}
              onModelChange={onModelChange}
            />
          </Flexbox>
        );
      }

      default: {
        return null;
      }
    }
  },
);

ListItemRenderer.displayName = 'ListItemRenderer';
