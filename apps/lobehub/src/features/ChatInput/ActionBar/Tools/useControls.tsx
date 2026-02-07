import {
  KLAVIS_SERVER_TYPES,
  type KlavisServerType,
  LOBEHUB_SKILL_PROVIDERS,
  type LobehubSkillProviderType,
  RECOMMENDED_SKILLS,
  RecommendedSkillType,
} from '@lobechat/const';
import { Avatar, Flexbox, Icon, type ItemType } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { ToyBrick } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import PluginAvatar from '@/components/Plugins/PluginAvatar';
import { useCheckPluginsIsInstalled } from '@/hooks/useCheckPluginsIsInstalled';
import { useFetchInstalledPlugins } from '@/hooks/useFetchInstalledPlugins';
import { useWhatsAppStatus } from '@/hooks/useWhatsAppStatus';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';
import { serverConfigSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useToolStore } from '@/store/tool';
import {
  builtinToolSelectors,
  klavisStoreSelectors,
  lobehubSkillStoreSelectors,
  pluginSelectors,
} from '@/store/tool/selectors';

import { useAgentId } from '../../hooks/useAgentId';
import KlavisServerItem from './KlavisServerItem';
import LobehubSkillServerItem from './LobehubSkillServerItem';
import ToolItem from './ToolItem';

const SKILL_ICON_SIZE = 20;
const WHATSAPP_TOOL_ID = 'lobe-whatsapp-local';

/**
 * Klavis 服务器图标组件
 */
const KlavisIcon = memo<Pick<KlavisServerType, 'icon' | 'label'>>(({ icon, label }) => {
  if (typeof icon === 'string') {
    return (
      <Avatar
        alt={label}
        avatar={icon}
        shape={'square'}
        size={SKILL_ICON_SIZE}
        style={{ flex: 'none' }}
      />
    );
  }

  return <Icon fill={cssVar.colorText} icon={icon} size={SKILL_ICON_SIZE} />;
});

KlavisIcon.displayName = 'KlavisIcon';

/**
 * LobeHub Skill Provider 图标组件
 */
const LobehubSkillIcon = memo<Pick<LobehubSkillProviderType, 'icon' | 'label'>>(
  ({ icon, label }) => {
    if (typeof icon === 'string') {
      return (
        <Avatar
          alt={label}
          avatar={icon}
          shape={'square'}
          size={SKILL_ICON_SIZE}
          style={{ flex: 'none' }}
        />
      );
    }

    return <Icon fill={cssVar.colorText} icon={icon} size={SKILL_ICON_SIZE} />;
  },
);

LobehubSkillIcon.displayName = 'LobehubSkillIcon';

export const useControls = ({
  setUpdating,
}: {
  setUpdating: (updating: boolean) => void;
}) => {
  const { t } = useTranslation('setting');
  const tt = t as any;

  const userSettings = useUserStore(settingsSelectors.currentSettings);
  const setSettings = useUserStore((s) => s.setSettings);

  // Hook pour synchroniser le statut WhatsApp
  useWhatsAppStatus();

  const whatsappSettings = ((userSettings.tool as any)?.whatsapp || {}) as any;
  const whatsappAccounts = (
    whatsappSettings.accounts && whatsappSettings.accounts.length > 0
      ? whatsappSettings.accounts
      : [{ id: 'whatsapp-1', name: 'WhatsApp 1' }]
  ) as Array<{
    id: string;
    isConnected?: boolean;
    name?: string;
    phone?: string;
  }>;
  const activeWhatsAppAccountId = (whatsappSettings.activeAccountId || whatsappAccounts[0]?.id || 'whatsapp-1') as string;
  const agentId = useAgentId();
  const list = useToolStore(pluginSelectors.installedPluginMetaList, isEqual);
  const [checked, togglePlugin] = useAgentStore((s) => [
    agentByIdSelectors.getAgentPluginsById(agentId)(s),
    s.togglePlugin,
  ]);
  const builtinList = useToolStore(builtinToolSelectors.metaList, isEqual);
  const plugins = useAgentStore((s) => agentByIdSelectors.getAgentPluginsById(agentId)(s));


  // Klavis 相关状态
  const allKlavisServers = useToolStore(klavisStoreSelectors.getServers, isEqual);
  const isKlavisEnabledInEnv = useServerConfigStore(serverConfigSelectors.enableKlavis);

  // LobeHub Skill 相关状态
  const allLobehubSkillServers = useToolStore(lobehubSkillStoreSelectors.getServers, isEqual);
  const isLobehubSkillEnabled = useServerConfigStore(serverConfigSelectors.enableLobehubSkill);

  const [useFetchPluginStore, useFetchUserKlavisServers, useFetchLobehubSkillConnections] =
    useToolStore((s) => [
      s.useFetchPluginStore,
      s.useFetchUserKlavisServers,
      s.useFetchLobehubSkillConnections,
    ]);

  useFetchPluginStore();
  useFetchInstalledPlugins();
  useCheckPluginsIsInstalled(plugins);

  // 使用 SWR 加载用户的 Klavis 集成（从数据库）
  useFetchUserKlavisServers(isKlavisEnabledInEnv);

  // 使用 SWR 加载用户的 LobeHub Skill 连接
  useFetchLobehubSkillConnections(isLobehubSkillEnabled);

  // 根据 identifier 获取已连接的服务器
  const getServerByName = (identifier: string) => {
    return allKlavisServers.find((server) => server.identifier === identifier);
  };

  // 获取所有 Klavis 服务器类型的 identifier 集合（用于过滤 builtinList）
  // 这里使用 KLAVIS_SERVER_TYPES 而不是已连接的服务器，因为我们要过滤掉所有可能的 Klavis 类型
  const allKlavisTypeIdentifiers = useMemo(
    () => new Set(KLAVIS_SERVER_TYPES.map((type) => type.identifier)),
    [],
  );
  // 过滤掉 builtinList 中的 klavis 工具（它们会单独显示在 Klavis 区域）
  const filteredBuiltinList = useMemo(
    () =>
      isKlavisEnabledInEnv
        ? builtinList.filter((item) => !allKlavisTypeIdentifiers.has(item.identifier))
        : builtinList,
    [builtinList, allKlavisTypeIdentifiers, isKlavisEnabledInEnv],
  );

  // 获取推荐的 Klavis skill IDs
  const recommendedKlavisIds = useMemo(
    () =>
      new Set(
        RECOMMENDED_SKILLS.filter((s) => s.type === RecommendedSkillType.Klavis).map((s) => s.id),
      ),
    [],
  );

  // 获取推荐的 Lobehub skill IDs
  const recommendedLobehubIds = useMemo(
    () =>
      new Set(
        RECOMMENDED_SKILLS.filter((s) => s.type === RecommendedSkillType.Lobehub).map((s) => s.id),
      ),
    [],
  );

  // 获取已安装的 Klavis server IDs
  const installedKlavisIds = useMemo(
    () => new Set(allKlavisServers.map((s) => s.identifier)),
    [allKlavisServers],
  );

  // 获取已安装的 Lobehub skill IDs
  const installedLobehubIds = useMemo(
    () => new Set(allLobehubSkillServers.map((s) => s.identifier)),
    [allLobehubSkillServers],
  );

  // Klavis 服务器列表项 - 只展示已安装或推荐的
  const klavisServerItems = useMemo(
    () =>
      isKlavisEnabledInEnv
        ? KLAVIS_SERVER_TYPES.filter(
          (type) =>
            installedKlavisIds.has(type.identifier) || recommendedKlavisIds.has(type.identifier),
        ).map((type) => ({
          icon: <KlavisIcon icon={type.icon} label={type.label} />,
          key: type.identifier,
          label: (
            <KlavisServerItem
              identifier={type.identifier}
              label={type.label}
              server={getServerByName(type.identifier)}
              serverName={type.serverName}
            />
          ),
        }))
        : [],
    [isKlavisEnabledInEnv, allKlavisServers, installedKlavisIds, recommendedKlavisIds],
  );

  // LobeHub Skill Provider 列表项 - 只展示已安装或推荐的
  const lobehubSkillItems = useMemo(
    () =>
      isLobehubSkillEnabled
        ? LOBEHUB_SKILL_PROVIDERS.filter(
          (provider) =>
            installedLobehubIds.has(provider.id) || recommendedLobehubIds.has(provider.id),
        ).map((provider) => ({
          icon: <LobehubSkillIcon icon={provider.icon} label={provider.label} />,
          key: provider.id, // 使用 provider.id 作为 key，与 pluginId 保持一致
          label: <LobehubSkillServerItem label={provider.label} provider={provider.id} />,
        }))
        : [],
    [isLobehubSkillEnabled, allLobehubSkillServers, installedLobehubIds, recommendedLobehubIds],
  );

  // Créer les éléments de compte WhatsApp (avec indentation visuelle)
  // Doit être déclaré AVANT builtinItems car utilisé dans celui-ci
  const whatsappAccountItems = useMemo(() => {
    if (whatsappAccounts.length === 0) return [];

    // Vérifier si WhatsApp (Bridge) est activé
    const isWhatsAppEnabled = checked.includes(WHATSAPP_TOOL_ID);

    return whatsappAccounts.map((a) => {
      const isActive = a.id === activeWhatsAppAccountId;
      const isConnected = (a as any).isConnected || false;

      // Si WhatsApp n'est pas activé, griser les comptes
      const isDisabled = !isWhatsAppEnabled;
      const opacityValue = isDisabled ? 0.35 : (isActive ? 1 : 0.6);

      return {
        icon: (
          <Flexbox align={'center'} gap={4} horizontal style={{ marginLeft: 8 }}>
            <span style={{
              color: cssVar.colorTextQuaternary,
              fontSize: 10,
              opacity: isDisabled ? 0.5 : 1,
            }}>└</span>
            <Avatar
              avatar="https://hub-apac-1.lobeobjects.space/assets/logos/whatsapp.svg"
              shape={'square'}
              size={SKILL_ICON_SIZE - 4}
              style={{
                flex: 'none',
                opacity: opacityValue,
                borderRadius: '33%',
                filter: isDisabled ? 'grayscale(1)' : 'none',
              }}
            />
          </Flexbox>
        ),
        key: `whatsapp-account:${a.id}`,
        label: (
          <Flexbox
            align={'center'}
            gap={8}
            horizontal
            justify={'space-between'}
            style={{
              width: '100%',
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            <Flexbox align={'center'} gap={6} horizontal>
              <span style={{
                fontSize: 12,
                fontWeight: isActive && !isDisabled ? 600 : 400,
                color: isDisabled ? cssVar.colorTextQuaternary : (isActive ? cssVar.colorText : cssVar.colorTextSecondary),
              }}>
                {a.name || a.id}
              </span>
              {a.phone && (
                <span style={{
                  fontSize: 10,
                  color: cssVar.colorTextQuaternary,
                }}>
                  {a.phone}
                </span>
              )}
            </Flexbox>
            <Flexbox align={'center'} gap={4} horizontal>
              {isConnected && !isDisabled && (
                <span style={{
                  fontSize: 9,
                  color: cssVar.colorSuccess,
                  backgroundColor: `${cssVar.colorSuccess}15`,
                  padding: '1px 5px',
                  borderRadius: 3,
                  fontWeight: 500,
                }}>
                  ✓ Connecté
                </span>
              )}
              {isActive && !isDisabled && (
                <span style={{
                  fontSize: 9,
                  color: cssVar.colorPrimary,
                  backgroundColor: `${cssVar.colorPrimary}15`,
                  padding: '1px 5px',
                  borderRadius: 3,
                  fontWeight: 500,
                }}>
                  Actif
                </span>
              )}
              {isDisabled && (
                <span style={{
                  fontSize: 9,
                  color: cssVar.colorTextQuaternary,
                  padding: '1px 5px',
                }}>
                  Désactivé
                </span>
              )}
            </Flexbox>
          </Flexbox>
        ),
        onClick: isDisabled ? undefined : async () => {
          await setSettings({
            tool: {
              ...(userSettings.tool as any),
              whatsapp: {
                ...whatsappSettings,
                activeAccountId: a.id,
              },
            },
          } as any);
        },
      };
    });
  }, [activeWhatsAppAccountId, checked, setSettings, userSettings.tool, whatsappAccounts, whatsappSettings]);

  // Builtin 工具列表项（不包含 Klavis 和 LobeHub Skill）
  const builtinItems = useMemo(
    () => {
      console.log('[useControls] filteredBuiltinList:', filteredBuiltinList.map(i => i.identifier));
      console.log('[useControls] whatsappAccounts:', whatsappAccounts);
      return filteredBuiltinList.flatMap((item) => {
        const isWhatsAppTool =
          item.identifier === WHATSAPP_TOOL_ID || item.meta?.title === 'WhatsApp (Bridge)';
        if (isWhatsAppTool) {
          console.log('[useControls] Found WhatsApp tool:', item.identifier, 'accounts:', whatsappAccounts.length);
        }
        const baseToolItem = {
          icon: (
            <Avatar
              avatar={item.meta.avatar}
              shape={'square'}
              size={SKILL_ICON_SIZE}
              style={{ flex: 'none' }}
            />
          ),
          key: item.identifier,
          label: (
            <ToolItem
              checked={checked.includes(item.identifier)}
              id={item.identifier}
              label={item.meta?.title}
              onUpdate={async () => {
                setUpdating(true);
                await togglePlugin(item.identifier);
                setUpdating(false);
              }}
            />
          ),
        };

        if (!isWhatsAppTool) return [baseToolItem];

        // Pour WhatsApp, afficher le badge de compteur sur l'élément principal
        const connectedCount = whatsappAccounts.filter((a) => (a as any).isConnected).length;
        const totalCount = whatsappAccounts.length;

        // Retourner l'élément WhatsApp principal suivi des comptes
        const whatsAppMainItem = {
          ...baseToolItem,
          label: (
            <ToolItem
              checked={checked.includes(item.identifier)}
              id={item.identifier}
              label={
                <>
                  <span>{item.meta?.title || item.identifier}</span>
                  <span style={{
                    fontSize: 11,
                    color: connectedCount > 0 ? cssVar.colorSuccess : cssVar.colorTextTertiary,
                    backgroundColor: connectedCount > 0 ? `${cssVar.colorSuccess}15` : cssVar.colorFillQuaternary,
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 500,
                  }}>
                    {connectedCount}/{totalCount}
                  </span>
                </>
              }
              onUpdate={async () => {
                setUpdating(true);
                await togglePlugin(item.identifier);
                setUpdating(false);
              }}
            />
          ),
        };

        // Ajouter les comptes WhatsApp directement après
        return [whatsAppMainItem, ...whatsappAccountItems] as any;
      });
    },
    [
      checked,
      filteredBuiltinList,
      setUpdating,
      togglePlugin,
      whatsappAccounts,
      whatsappAccountItems,
    ],
  );

  // Debug: log builtinItems count
  console.log('[useControls] builtinItems total:', builtinItems.length, builtinItems.map((i: any) => i.key));


  // Skills 列表项（包含 LobeHub Skill 和 Klavis）
  // 已连接的排在前面
  const skillItems = useMemo(() => {
    const allItems = [...lobehubSkillItems, ...klavisServerItems];

    return allItems.sort((a, b) => {
      const isConnectedA =
        installedLobehubIds.has(a.key as string) || installedKlavisIds.has(a.key as string);
      const isConnectedB =
        installedLobehubIds.has(b.key as string) || installedKlavisIds.has(b.key as string);

      if (isConnectedA && !isConnectedB) return -1;
      if (!isConnectedA && isConnectedB) return 1;
      return 0;
    });
  }, [lobehubSkillItems, klavisServerItems, installedLobehubIds, installedKlavisIds]);

  // 区分社区插件和自定义插件
  const communityPlugins = list.filter((item) => item.type !== 'customPlugin');
  const customPlugins = list.filter((item) => item.type === 'customPlugin');

  // 生成插件列表项的函数
  const mapPluginToItem = (item: (typeof list)[0]) => ({
    icon: item?.avatar ? (
      <PluginAvatar avatar={item.avatar} size={SKILL_ICON_SIZE} />
    ) : (
      <Icon icon={ToyBrick} size={SKILL_ICON_SIZE} />
    ),
    key: item.identifier,
    label: (
      <ToolItem
        checked={checked.includes(item.identifier)}
        id={item.identifier}
        label={item.title}
        onUpdate={async () => {
          setUpdating(true);
          await togglePlugin(item.identifier);
          setUpdating(false);
        }}
      />
    ),
  });

  // 构建 LobeHub 分组的 children（包含内置工具和 LobeHub Skill/Klavis）
  const lobehubGroupChildren: ItemType[] = [
    // 1. 内置工具
    ...builtinItems,
    // 2. LobeHub Skill 和 Klavis（作为内置技能）
    ...skillItems,
  ];

  // 构建 Community 分组的 children（只包含社区插件）
  const communityGroupChildren: ItemType[] = communityPlugins.map(mapPluginToItem);

  // 构建 Custom 分组的 children（只包含自定义插件）
  const customGroupChildren: ItemType[] = customPlugins.map(mapPluginToItem);

  // 市场 tab 的 items
  const marketItems: ItemType[] = [
    // LobeHub 分组
    ...(lobehubGroupChildren.length > 0
      ? [
        {
          children: lobehubGroupChildren,
          key: 'lobehub',
          label: tt('skillStore.tabs.lobehub'),
          type: 'group' as const,
        },
      ]
      : []),
    // Community 分组
    ...(communityGroupChildren.length > 0
      ? [
        {
          children: communityGroupChildren,
          key: 'community',
          label: tt('skillStore.tabs.community'),
          type: 'group' as const,
        },
      ]
      : []),
    // Custom 分组（只有在有自定义插件时才显示）
    ...(customGroupChildren.length > 0
      ? [
        {
          children: customGroupChildren,
          key: 'custom',
          label: tt('skillStore.tabs.custom'),
          type: 'group' as const,
        },
      ]
      : []),
  ];

  // 已安装 tab 的 items - 只显示已安装的插件
  const installedPluginItems: ItemType[] = useMemo(() => {
    const installedItems: ItemType[] = [];

    // 已安装的 builtin 工具
    const enabledBuiltinItems = filteredBuiltinList
      .filter((item) => checked.includes(item.identifier))
      .map((item) => ({
        icon: (
          <Avatar
            avatar={item.meta.avatar}
            shape={'square'}
            size={SKILL_ICON_SIZE}
            style={{ flex: 'none' }}
          />
        ),
        key: item.identifier,
        label: (
          <ToolItem
            checked={true}
            id={item.identifier}
            label={item.meta?.title}
            onUpdate={async () => {
              setUpdating(true);
              await togglePlugin(item.identifier);
              setUpdating(false);
            }}
          />
        ),
      }));

    // 已连接的 Klavis 服务器
    const connectedKlavisItems = klavisServerItems.filter((item) =>
      checked.includes(item.key as string),
    );

    // 已连接的 LobeHub Skill Providers
    const connectedLobehubSkillItems = lobehubSkillItems.filter((item) =>
      checked.includes(item.key as string),
    );

    // 合并已启用的 LobeHub Skill 和 Klavis（作为内置技能）
    const enabledSkillItems = [...connectedLobehubSkillItems, ...connectedKlavisItems];

    // 构建内置工具分组的 children（包含内置工具和 LobeHub Skill/Klavis）
    const allBuiltinItems: ItemType[] = [
      // 1. 内置工具
      ...enabledBuiltinItems,
      // 2. divider (如果有内置工具且有 skill items)
      ...(enabledBuiltinItems.length > 0 && enabledSkillItems.length > 0
        ? [{ key: 'installed-divider-builtin-skill', type: 'divider' as const }]
        : []),
      // 3. LobeHub Skill 和 Klavis
      ...enabledSkillItems,
    ];

    if (allBuiltinItems.length > 0) {
      installedItems.push({
        children: allBuiltinItems,
        key: 'installed-lobehub',
        label: tt('skillStore.tabs.lobehub'),
        type: 'group',
      });
    }

    // 已启用的社区插件
    const enabledCommunityPlugins = communityPlugins
      .filter((item) => checked.includes(item.identifier))
      .map((item) => ({
        icon: item?.avatar ? (
          <PluginAvatar avatar={item.avatar} size={SKILL_ICON_SIZE} />
        ) : (
          <Icon icon={ToyBrick} size={SKILL_ICON_SIZE} />
        ),
        key: item.identifier,
        label: (
          <ToolItem
            checked={true}
            id={item.identifier}
            label={item.title}
            onUpdate={async () => {
              setUpdating(true);
              await togglePlugin(item.identifier);
              setUpdating(false);
            }}
          />
        ),
      }));

    // 已启用的自定义插件
    const enabledCustomPlugins = customPlugins
      .filter((item) => checked.includes(item.identifier))
      .map((item) => ({
        icon: item?.avatar ? (
          <PluginAvatar avatar={item.avatar} size={SKILL_ICON_SIZE} />
        ) : (
          <Icon icon={ToyBrick} size={SKILL_ICON_SIZE} />
        ),
        key: item.identifier,
        label: (
          <ToolItem
            checked={true}
            id={item.identifier}
            label={item.title}
            onUpdate={async () => {
              setUpdating(true);
              await togglePlugin(item.identifier);
              setUpdating(false);
            }}
          />
        ),
      }));

    // Community 分组（只包含社区插件）
    if (enabledCommunityPlugins.length > 0) {
      installedItems.push({
        children: enabledCommunityPlugins,
        key: 'installed-community',
        label: tt('skillStore.tabs.community'),
        type: 'group',
      });
    }

    // Custom 分组（只包含自定义插件）
    if (enabledCustomPlugins.length > 0) {
      installedItems.push({
        children: enabledCustomPlugins,
        key: 'installed-custom',
        label: tt('skillStore.tabs.custom'),
        type: 'group',
      });
    }

    return installedItems;
  }, [
    filteredBuiltinList,
    communityPlugins,
    customPlugins,
    klavisServerItems,
    lobehubSkillItems,
    checked,
    togglePlugin,
    setUpdating,
    t,
  ]);

  return { installedPluginItems, marketItems };
};
