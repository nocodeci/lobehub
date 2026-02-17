'use client';

import {
  type KlavisServerType,
  type LobehubSkillProviderType,
  getKlavisServerByServerIdentifier,
  getLobehubSkillProviderById,
} from '@lobechat/const';
import { Flexbox, Icon, Markdown, Tag, Text, useModalContext } from '@lobehub/ui';
import { Avatar, Button, Tabs } from 'antd';
import { createStaticStyles, cssVar } from 'antd-style';

import { BookOpen, Bot, Code, ExternalLink, Loader2, SquareArrowOutUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSkillConnect } from '@/features/SkillStore/LobeHubList/useSkillConnect';
import { useToolStore } from '@/store/tool';
import { klavisStoreSelectors, lobehubSkillStoreSelectors } from '@/store/tool/selectors';
import { KlavisServerStatus } from '@/store/tool/slices/klavisStore';
import { LobehubSkillStatus } from '@/store/tool/slices/lobehubSkillStore/types';

const styles = createStaticStyles(({ css, cssVar }) => ({
  authorLink: css`
    cursor: pointer;

    display: inline-flex;
    gap: 4px;
    align-items: center;

    color: ${cssVar.colorPrimary};

    &:hover {
      text-decoration: underline;
    }
  `,
  detailItem: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  detailLabel: css`
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
  `,
  header: css`
    display: flex;
    gap: 16px;
    align-items: center;

    padding: 16px;
    border-radius: 12px;

    background: ${cssVar.colorFillTertiary};
  `,
  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 56px;
    height: 56px;
    border-radius: 12px;

    background: ${cssVar.colorBgContainer};
  `,
  introduction: css`
    font-size: 14px;
    line-height: 1.8;
    color: ${cssVar.colorText};
  `,
  sectionTitle: css`
    font-size: 14px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  title: css`
    font-size: 18px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  toolTag: css`
    font-family: ${cssVar.fontFamilyCode};
    font-size: 12px;
  `,
  tabsWrapper: css`
    .ant-tabs-nav {
      margin-bottom: 16px;
    }
  `,
  toolsContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  trustWarning: css`
    font-size: 12px;
    line-height: 1.6;
    color: ${cssVar.colorTextTertiary};
  `,
}));

export type IntegrationType = 'builtin' | 'klavis' | 'lobehub';

export interface BuiltinSkillMeta {
  avatar: string;
  description: string;
  identifier: string;
  label: string;
}

export interface IntegrationDetailContentProps {
  builtinMeta?: BuiltinSkillMeta;
  identifier: string;
  serverName?: string;
  type: IntegrationType;
}

const BUILTIN_EMOJI_MAP: Record<string, string> = {
  '💻': '1f4bb',
  '📓': '1f4d3',
  '✅': '2705',
  '🧠': '1f9e0',
};

export const IntegrationDetailContent = ({
  type,
  identifier,
  serverName,
  builtinMeta,
}: IntegrationDetailContentProps) => {
  const { t } = useTranslation(['plugin', 'setting']);
  const { close } = useModalContext();

  const {
    handleConnect,
    isConnecting,
    isConnected: hookIsConnected,
  } = useSkillConnect({
    identifier,
    serverName,
    type: type === 'builtin' ? 'lobehub' : type,
  });

  const hasTriggeredConnectRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredConnectRef.current && hookIsConnected) {
      close();
    }
  }, [hookIsConnected, close]);

  const handleConnectWithTracking = async () => {
    hasTriggeredConnectRef.current = true;
    await handleConnect();
  };

  const config = useMemo((): KlavisServerType | LobehubSkillProviderType | undefined => {
    if (type === 'builtin') return undefined;
    if (type === 'klavis') {
      return getKlavisServerByServerIdentifier(identifier);
    }
    return getLobehubSkillProviderById(identifier);
  }, [type, identifier]);

  const klavisServers = useToolStore(klavisStoreSelectors.getServers);
  const lobehubSkillServers = useToolStore(lobehubSkillStoreSelectors.getServers);

  const serverState = useMemo(() => {
    if (type === 'klavis') {
      return klavisServers.find((s) => s.identifier === identifier);
    }
    return lobehubSkillServers.find((s) => s.identifier === identifier);
  }, [type, identifier, klavisServers, lobehubSkillServers]);

  const isConnected = useMemo(() => {
    if (!serverState) return false;
    if (type === 'klavis') {
      return serverState.status === KlavisServerStatus.CONNECTED;
    }
    return serverState.status === LobehubSkillStatus.CONNECTED;
  }, [type, serverState]);

  const tools = useMemo(() => {
    return serverState?.tools?.map((tool) => tool.name) || [];
  }, [serverState]);

  if (!config && type !== 'builtin') return null;

  // For builtin skills, use builtinMeta; for others, use config
  const isBuiltin = type === 'builtin' && builtinMeta;
  const label = isBuiltin ? builtinMeta.label : config!.label;
  const description = isBuiltin ? builtinMeta.description : config!.description;
  const introduction = isBuiltin ? builtinMeta.description : config!.introduction;
  const author = isBuiltin ? 'Connect' : config!.author;
  const authorUrl = isBuiltin ? undefined : config!.authorUrl;
  const icon = isBuiltin ? builtinMeta.avatar : config!.icon;

  // For builtin skills, skip i18n lookup and use metadata directly
  const localizedDescription = isBuiltin
    ? description
    : (() => {
        const i18nIdentifier =
          type === 'klavis'
            ? (config as KlavisServerType).identifier
            : (config as LobehubSkillProviderType).id;
        const i18nPrefix =
          type === 'klavis' ? 'tools.klavis.servers' : 'tools.lobehubSkill.providers';
        return t(`${i18nPrefix}.${i18nIdentifier}.description`, {
          defaultValue: description,
          ns: 'setting',
        });
      })();
  const localizedIntroduction = isBuiltin
    ? introduction
    : (() => {
        const i18nIdentifier =
          type === 'klavis'
            ? (config as KlavisServerType).identifier
            : (config as LobehubSkillProviderType).id;
        const i18nPrefix =
          type === 'klavis' ? 'tools.klavis.servers' : 'tools.lobehubSkill.providers';
        return t(`${i18nPrefix}.${i18nIdentifier}.introduction`, {
          defaultValue: introduction,
          ns: 'setting',
        });
      })();

  const renderIcon = () => {
    if (isBuiltin) {
      const avatar = builtinMeta.avatar;
      if (avatar.startsWith('data:')) {
        return <img alt={label} height={36} src={avatar} style={{ borderRadius: 8 }} width={36} />;
      }
      const emojiCode = BUILTIN_EMOJI_MAP[avatar];
      if (emojiCode) {
        return (
          <Avatar
            shape="square"
            size={36}
            style={{ color: 'var(--ant-color-text)', fontSize: 24, marginInlineEnd: 0 }}
          >
            <img
              alt={avatar}
              height={36}
              loading="lazy"
              src={`https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/${emojiCode}.webp`}
              style={{ color: 'transparent', flex: '0 0 auto' }}
              width={36}
            />
          </Avatar>
        );
      }
      return (
        <Avatar
          shape="square"
          size={36}
          style={{ color: 'var(--ant-color-text)', fontSize: 24, marginInlineEnd: 0 }}
        >
          {avatar}
        </Avatar>
      );
    }
    if (typeof icon === 'string') {
      return <img alt={label} height={36} src={icon} style={{ borderRadius: 8 }} width={36} />;
    }
    return <Icon fill={cssVar.colorText} icon={icon} size={36} />;
  };

  const handleAuthorClick = () => {
    if (authorUrl) {
      window.open(authorUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderConnectButton = () => {
    if (isBuiltin || isConnected) return null;

    if (isConnecting) {
      return (
        <Button disabled icon={<Icon icon={Loader2} spin />} type="default">
          {t('tools.klavis.connect', { defaultValue: 'Connect', ns: 'setting' })}
        </Button>
      );
    }

    return (
      <Button
        icon={<Icon icon={SquareArrowOutUpRight} />}
        onClick={handleConnectWithTracking}
        type="primary"
      >
        {t('tools.klavis.connect', { defaultValue: 'Connect', ns: 'setting' })}
      </Button>
    );
  };

  return (
    <Flexbox gap={16}>
      {/* Header */}
      <Flexbox
        align="center"
        className={styles.header}
        horizontal
        justify="space-between"
        style={{ flexWrap: 'nowrap' }}
      >
        <Flexbox align="center" gap={16} horizontal>
          <div className={styles.icon}>{renderIcon()}</div>
          <Flexbox gap={4}>
            <span className={styles.title}>{label}</span>
            <Text className={styles.introduction} style={{ fontSize: 14 }}>
              {localizedDescription}
            </Text>
          </Flexbox>
        </Flexbox>
        {renderConnectButton()}
      </Flexbox>

      {/* Tabs */}
      <Flexbox className={styles.tabsWrapper}>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              children: (
                <Flexbox gap={20}>
                  <Markdown>{localizedIntroduction}</Markdown>

                  {/* Developed by */}
                  <Flexbox gap={8}>
                    <Flexbox align="center" gap={4} horizontal>
                      <Text className={styles.detailLabel}>
                        {t('integrationDetail.developedBy')}
                      </Text>
                      <span
                        className={styles.authorLink}
                        onClick={handleAuthorClick}
                        style={{ cursor: authorUrl ? 'pointer' : 'default' }}
                      >
                        {author}
                        {authorUrl && <Icon icon={ExternalLink} size={12} />}
                      </span>
                    </Flexbox>
                    <Text className={styles.trustWarning} type="secondary">
                      {t('integrationDetail.trustWarning')}
                    </Text>
                  </Flexbox>

                  {/* Details */}
                  <Flexbox gap={12}>
                    <Text className={styles.detailLabel}>
                      {t('integrationDetail.details')}
                    </Text>
                    <Flexbox gap={16} horizontal>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('integrationDetail.author')}
                        </span>
                        <span
                          className={styles.authorLink}
                          onClick={handleAuthorClick}
                          style={{ cursor: authorUrl ? 'pointer' : 'default' }}
                        >
                          {author}
                          {authorUrl && <Icon icon={ExternalLink} size={12} />}
                        </span>
                      </div>
                    </Flexbox>
                  </Flexbox>
                </Flexbox>
              ),
              icon: <Icon icon={BookOpen} size={16} />,
              key: 'overview',
              label: t('integrationDetail.tabs.overview', { defaultValue: 'Aperçu' }),
            },
            {
              children: (
                <Flexbox gap={12}>
                  {tools.length > 0 ? (
                    <>
                      <Flexbox align="center" gap={8} horizontal>
                        <span className={styles.sectionTitle}>
                          {t('integrationDetail.tools')}
                        </span>
                        <Tag>{tools.length}</Tag>
                      </Flexbox>
                      <div className={styles.toolsContainer}>
                        {tools.map((tool) => (
                          <Tag className={styles.toolTag} key={tool}>
                            {tool}
                          </Tag>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Text type="secondary">
                      {isConnected
                        ? t('integrationDetail.noTools', {
                            defaultValue: 'No tools available for this skill.',
                          })
                        : t('integrationDetail.connectFirst', {
                            defaultValue: 'Connect this skill to see available tools.',
                          })}
                    </Text>
                  )}
                </Flexbox>
              ),
              icon: <Icon icon={Code} size={16} />,
              key: 'schema',
              label: t('integrationDetail.tabs.schema', {
                defaultValue: 'Fonctionnalités',
              }),
            },
            {
              children: (
                <Flexbox gap={12}>
                  <Text type="secondary">
                    {t('integrationDetail.agentsUsingSkill', {
                      defaultValue:
                        'Agents using this skill will appear here once the skill is connected and assigned.',
                    })}
                  </Text>
                </Flexbox>
              ),
              icon: <Icon icon={Bot} size={16} />,
              key: 'agents',
              label: t('integrationDetail.tabs.agents', {
                defaultValue: 'Agents utilisant cette compétence',
              }),
            },
          ]}
        />
      </Flexbox>
    </Flexbox>
  );
};
