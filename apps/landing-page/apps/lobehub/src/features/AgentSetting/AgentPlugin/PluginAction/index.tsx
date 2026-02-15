import { Flexbox } from '@lobehub/ui';
import { Button, Switch, Tag, Tooltip } from 'antd';
import { cssVar } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { QrCode } from 'lucide-react';
import { memo, useState } from 'react';

import { WhatsAppSetupModal } from '@/features/WhatsApp';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';
import { useToolStore } from '@/store/tool';

import { useStore } from '../../store';

const WHATSAPP_TOOL_ID = 'lobe-whatsapp-local';

const PluginSwitch = memo<{ identifier: string }>(({ identifier }) => {
  const pluginManifestLoading = useToolStore((s) => s.pluginInstallLoading, isEqual);
  const [userEnabledPlugins, hasPlugin, toggleAgentPlugin] = useStore((s) => [
    s.config.plugins || [],
    !!s.config.plugins,
    s.toggleAgentPlugin,
  ]);

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const userSettings = useUserStore(settingsSelectors.currentSettings);
  const whatsappSettings = ((userSettings.tool as any)?.whatsapp || {}) as any;
  const whatsappAccounts = (whatsappSettings.accounts || []) as any[];
  const hasConnectedAccount = whatsappAccounts.some((a: any) => a.isConnected);

  const isWhatsApp = identifier === WHATSAPP_TOOL_ID;
  const isEnabled = pluginManifestLoading[identifier] || !hasPlugin
    ? false
    : userEnabledPlugins.includes(identifier);

  return (
    <>
      <Flexbox align={'center'} gap={8} horizontal>
        {isWhatsApp && isEnabled && !hasConnectedAccount && (
          <>
            <Tag
              color="error"
              style={{ margin: 0, fontSize: 11 }}
            >
              Non connecté
            </Tag>
            <Tooltip title="Scanner un QR code pour connecter WhatsApp">
              <Button
                icon={<QrCode size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setWhatsAppModalOpen(true);
                }}
                size="small"
                type="primary"
              >
                Scanner QR
              </Button>
            </Tooltip>
          </>
        )}
        {isWhatsApp && isEnabled && hasConnectedAccount && (
          <Tag
            color="success"
            style={{ margin: 0, fontSize: 11 }}
          >
            Connecté
          </Tag>
        )}
        <Switch
          checked={isEnabled}
          loading={pluginManifestLoading[identifier]}
          onChange={() => {
            toggleAgentPlugin(identifier);
          }}
        />
      </Flexbox>
      {isWhatsApp && (
        <WhatsAppSetupModal
          onClose={() => setWhatsAppModalOpen(false)}
          open={whatsAppModalOpen}
        />
      )}
    </>
  );
});

export default PluginSwitch;
