'use client';

import { BRANDING_NAME } from '@lobechat/business-const';
import { ActionIcon, Button, Flexbox, Icon } from '@lobehub/ui';
import { useMutation } from '@tanstack/react-query';
import { App, Card, Popconfirm, Switch, Table, Tag, Typography } from 'antd';
import { cssVar } from 'antd-style';
import dayjs from 'dayjs';
import {
  BookOpen,
  Code2,
  Copy,
  Eye,
  EyeOff,
  Key,
  Plus,
  Shield,
  Trash2,
  Webhook,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { lambdaClient } from '@/libs/trpc/client';
import type { ApiKeyItem, CreateApiKeyParams } from '@/types/apiKey';

import SettingHeader from '../features/SettingHeader';

const { Text, Title, Paragraph } = Typography;

const DeveloperPage = memo(() => {
  const { message } = App.useApp();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const keys = await lambdaClient.apiKey.getApiKeys.query();
      setApiKeys(keys as ApiKeyItem[]);
    } catch {
      message.error('Erreur lors du chargement des clés API.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createMutation = useMutation({
    mutationFn: (params: CreateApiKeyParams) => lambdaClient.apiKey.createApiKey.mutate(params),
    onError: () => {
      message.error('Erreur lors de la création de la clé API.');
    },
    onSuccess: (data: any) => {
      message.success('Clé API créée avec succès.');
      if (data?.key) {
        setNewKeyRevealed(data.key);
      }
      fetchKeys();
      setCreateModalOpen(false);
      setNewKeyName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lambdaClient.apiKey.deleteApiKey.mutate({ id }),
    onError: () => {
      message.error('Erreur lors de la suppression.');
    },
    onSuccess: () => {
      message.success('Clé API supprimée.');
      fetchKeys();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { enabled: boolean; id: number }) =>
      lambdaClient.apiKey.updateApiKey.mutate({ id, value: { enabled } }),
    onSuccess: () => {
      fetchKeys();
    },
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copié dans le presse-papiers');
    } catch {
      message.error('Erreur lors de la copie');
    }
  };

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 6) + '••••••••' + key.slice(-4);
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
      title: 'Nom',
    },
    {
      dataIndex: 'key',
      key: 'key',
      render: (key: string, record: ApiKeyItem) => (
        <Flexbox align="center" gap={4} horizontal>
          <code
            style={{
              background: cssVar.colorFillTertiary as string,
              borderRadius: 4,
              fontSize: 12,
              padding: '2px 8px',
            }}
          >
            {visibleKeys[record.id] ? key : maskKey(key)}
          </code>
          <ActionIcon
            icon={visibleKeys[record.id] ? EyeOff : Eye}
            onClick={() => toggleKeyVisibility(record.id)}
            size="small"
          />
          <ActionIcon icon={Copy} onClick={() => handleCopy(key)} size="small" />
        </Flexbox>
      ),
      title: 'Clé API',
      width: 320,
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: ApiKeyItem) => (
        <Switch
          checked={!!enabled}
          onChange={(checked) => toggleMutation.mutate({ enabled: checked, id: record.id })}
          size="small"
        />
      ),
      title: 'Active',
      width: 80,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </Text>
      ),
      title: 'Créée le',
      width: 110,
    },
    {
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (date: Date | null) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Jamais'}
        </Text>
      ),
      title: 'Dernière utilisation',
      width: 160,
    },
    {
      key: 'actions',
      render: (_: any, record: ApiKeyItem) => (
        <Popconfirm
          cancelText="Annuler"
          description="Cette action est irréversible."
          okText="Supprimer"
          onConfirm={() => deleteMutation.mutate(record.id)}
          title="Supprimer cette clé API ?"
        >
          <ActionIcon icon={Trash2} size="small" style={{ color: cssVar.colorError as string }} />
        </Popconfirm>
      ),
      title: '',
      width: 50,
    },
  ];

  const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <SettingHeader title="Développeur" />

      <Flexbox gap={24} style={{ maxWidth: 900 }}>
        {/* Hero section */}
        <Card
          style={{
            background: `linear-gradient(135deg, ${cssVar.colorPrimaryBg} 0%, ${cssVar.colorBgContainer} 100%)`,
            border: `1px solid ${cssVar.colorBorderSecondary}`,
          }}
        >
          <Flexbox gap={12}>
            <Flexbox align="center" gap={12} horizontal>
              <Icon icon={Code2} size={28} style={{ color: cssVar.colorPrimary as string }} />
              <Title level={4} style={{ margin: 0 }}>
                API {BRANDING_NAME}
              </Title>
            </Flexbox>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              Utilisez l&apos;API {BRANDING_NAME} pour intégrer l&apos;intelligence artificielle
              dans vos applications. Créez des clés API pour authentifier vos requêtes.
            </Paragraph>
          </Flexbox>
        </Card>

        {/* Newly created key reveal */}
        {newKeyRevealed && (
          <Card
            style={{
              background: cssVar.colorSuccessBg as string,
              border: `1px solid ${cssVar.colorSuccessBorder}`,
            }}
          >
            <Flexbox gap={8}>
              <Flexbox align="center" gap={8} horizontal>
                <Icon icon={Shield} size={18} style={{ color: cssVar.colorSuccess as string }} />
                <Text strong style={{ color: cssVar.colorSuccess as string }}>
                  Clé API créée — copiez-la maintenant, elle ne sera plus affichée en clair.
                </Text>
              </Flexbox>
              <Flexbox align="center" gap={8} horizontal>
                <code
                  style={{
                    background: cssVar.colorFillTertiary as string,
                    borderRadius: 6,
                    flex: 1,
                    fontSize: 13,
                    padding: '8px 12px',
                    wordBreak: 'break-all',
                  }}
                >
                  {newKeyRevealed}
                </code>
                <Button
                  icon={Copy}
                  onClick={() => {
                    handleCopy(newKeyRevealed);
                    setNewKeyRevealed(null);
                  }}
                  size="small"
                  type="primary"
                >
                  Copier
                </Button>
              </Flexbox>
            </Flexbox>
          </Card>
        )}

        {/* API Keys management */}
        <Card>
          <Flexbox gap={16}>
            <Flexbox align="center" horizontal justify="space-between">
              <Flexbox align="center" gap={8} horizontal>
                <Icon icon={Key} size={20} />
                <Title level={5} style={{ margin: 0 }}>
                  Clés API
                </Title>
                <Tag color="blue">{apiKeys.length}</Tag>
              </Flexbox>
              {!createModalOpen && (
                <Button
                  icon={Plus}
                  onClick={() => setCreateModalOpen(true)}
                  size="small"
                  type="primary"
                >
                  Nouvelle clé
                </Button>
              )}
            </Flexbox>

            {/* Inline create form */}
            {createModalOpen && (
              <Card
                size="small"
                style={{
                  background: cssVar.colorFillQuaternary as string,
                  border: `1px solid ${cssVar.colorBorder}`,
                }}
              >
                <Flexbox align="center" gap={12} horizontal>
                  <input
                    autoFocus
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newKeyName.trim()) {
                        createMutation.mutate({ name: newKeyName.trim() });
                      }
                      if (e.key === 'Escape') {
                        setCreateModalOpen(false);
                        setNewKeyName('');
                      }
                    }}
                    placeholder="Nom de la clé (ex: Mon App, Production, Test...)"
                    style={{
                      background: cssVar.colorBgContainer as string,
                      border: `1px solid ${cssVar.colorBorder}`,
                      borderRadius: 6,
                      flex: 1,
                      fontSize: 14,
                      outline: 'none',
                      padding: '6px 12px',
                    }}
                    value={newKeyName}
                  />
                  <Button
                    disabled={!newKeyName.trim()}
                    loading={createMutation.isPending}
                    onClick={() => createMutation.mutate({ name: newKeyName.trim() })}
                    size="small"
                    type="primary"
                  >
                    Créer
                  </Button>
                  <Button
                    onClick={() => {
                      setCreateModalOpen(false);
                      setNewKeyName('');
                    }}
                    size="small"
                  >
                    Annuler
                  </Button>
                </Flexbox>
              </Card>
            )}

            <Table
              columns={columns}
              dataSource={apiKeys}
              loading={loading}
              locale={{
                emptyText: (
                  <Flexbox align="center" gap={8} padding={32}>
                    <Icon
                      icon={Key}
                      size={32}
                      style={{ color: cssVar.colorTextQuaternary as string }}
                    />
                    <Text type="secondary">Aucune clé API. Créez-en une pour commencer.</Text>
                  </Flexbox>
                ),
              }}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Flexbox>
        </Card>

        {/* Quick start guide */}
        <Card>
          <Flexbox gap={16}>
            <Flexbox align="center" gap={8} horizontal>
              <Icon icon={BookOpen} size={20} />
              <Title level={5} style={{ margin: 0 }}>
                Guide rapide
              </Title>
            </Flexbox>

            <Flexbox gap={16}>
              {/* Example: Chat completion */}
              <Flexbox gap={8}>
                <Flexbox align="center" gap={8} horizontal>
                  <Icon
                    icon={Webhook}
                    size={16}
                    style={{ color: cssVar.colorPrimary as string }}
                  />
                  <Text strong>Envoyer un message à l&apos;IA</Text>
                </Flexbox>
                <div
                  style={{
                    background: '#1e1e2e',
                    borderRadius: 8,
                    overflow: 'auto',
                    padding: '16px 20px',
                    position: 'relative',
                  }}
                >
                  <ActionIcon
                    icon={Copy}
                    onClick={() =>
                      handleCopy(`curl -X POST ${BASE_URL}/webapi/chat/openai \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Bonjour !"}
    ]
  }'`)
                    }
                    size="small"
                    style={{ color: '#888', position: 'absolute', right: 8, top: 8 }}
                  />
                  <pre
                    style={{
                      color: '#cdd6f4',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontSize: 12,
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <span style={{ color: '#89b4fa' }}>curl</span>
                    {' -X POST '}
                    <span style={{ color: '#a6e3a1' }}>{BASE_URL}/webapi/chat/openai</span>
                    {' \\\n  -H '}
                    <span style={{ color: '#f9e2af' }}>
                      &quot;Content-Type: application/json&quot;
                    </span>
                    {' \\\n  -H '}
                    <span style={{ color: '#f9e2af' }}>
                      &quot;Authorization: Bearer YOUR_API_KEY&quot;
                    </span>
                    {" \\\n  -d '{\n    "}
                    <span style={{ color: '#89b4fa' }}>&quot;model&quot;</span>
                    {': '}
                    <span style={{ color: '#a6e3a1' }}>&quot;gpt-4o-mini&quot;</span>
                    {',\n    '}
                    <span style={{ color: '#89b4fa' }}>&quot;messages&quot;</span>
                    {': [\n      {'}
                    <span style={{ color: '#89b4fa' }}>&quot;role&quot;</span>
                    {': '}
                    <span style={{ color: '#a6e3a1' }}>&quot;user&quot;</span>
                    {', '}
                    <span style={{ color: '#89b4fa' }}>&quot;content&quot;</span>
                    {': '}
                    <span style={{ color: '#a6e3a1' }}>&quot;Bonjour !&quot;</span>
                    {"}\n    ]\n  }'"}
                  </pre>
                </div>
              </Flexbox>

              {/* Authentication info */}
              <Card
                size="small"
                style={{
                  background: cssVar.colorFillQuaternary as string,
                  border: `1px solid ${cssVar.colorBorderSecondary}`,
                }}
              >
                <Flexbox gap={8}>
                  <Flexbox align="center" gap={8} horizontal>
                    <Icon
                      icon={Shield}
                      size={16}
                      style={{ color: cssVar.colorWarning as string }}
                    />
                    <Text strong>Authentification</Text>
                  </Flexbox>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Incluez votre clé API dans le header{' '}
                    <code
                      style={{
                        background: cssVar.colorFillTertiary as string,
                        borderRadius: 4,
                        padding: '1px 6px',
                      }}
                    >
                      Authorization: Bearer YOUR_API_KEY
                    </code>{' '}
                    de chaque requête. Ne partagez jamais votre clé API et ne l&apos;incluez pas
                    dans du code côté client.
                  </Text>
                </Flexbox>
              </Card>

              {/* Endpoints list */}
              <Flexbox gap={8}>
                <Text strong>Endpoints disponibles</Text>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      borderCollapse: 'collapse',
                      fontSize: 13,
                      width: '100%',
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `2px solid ${cssVar.colorBorderSecondary}`,
                        }}
                      >
                        <th style={{ fontWeight: 600, padding: '8px 12px', textAlign: 'left' }}>
                          Méthode
                        </th>
                        <th style={{ fontWeight: 600, padding: '8px 12px', textAlign: 'left' }}>
                          Endpoint
                        </th>
                        <th style={{ fontWeight: 600, padding: '8px 12px', textAlign: 'left' }}>
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          desc: 'Chat avec un modèle IA (streaming)',
                          endpoint: '/webapi/chat/{provider}',
                          method: 'POST',
                        },
                        {
                          desc: 'Lister vos agents',
                          endpoint: '/trpc/lambda/agent.getAgents',
                          method: 'GET',
                        },
                        {
                          desc: 'Résumé des crédits',
                          endpoint: '/api/subscription/credits',
                          method: 'GET',
                        },
                      ].map((ep) => (
                        <tr
                          key={ep.endpoint}
                          style={{
                            borderBottom: `1px solid ${cssVar.colorBorderSecondary}`,
                          }}
                        >
                          <td style={{ padding: '8px 12px' }}>
                            <Tag
                              color={ep.method === 'POST' ? 'green' : 'blue'}
                              style={{ margin: 0 }}
                            >
                              {ep.method}
                            </Tag>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <code
                              style={{
                                background: cssVar.colorFillTertiary as string,
                                borderRadius: 4,
                                fontSize: 12,
                                padding: '2px 6px',
                              }}
                            >
                              {ep.endpoint}
                            </code>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <Text type="secondary">{ep.desc}</Text>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Flexbox>
            </Flexbox>
          </Flexbox>
        </Card>
      </Flexbox>
    </>
  );
});

DeveloperPage.displayName = 'DeveloperPage';

export default DeveloperPage;
