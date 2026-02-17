'use client';

import { Flexbox } from '@lobehub/ui';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  Bot,
  Crown,
  ExternalLink,
  Mail,
  MoreVertical,
  Shield,
  Share2,
  Trash2,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface AgentInfo {
  avatar?: string;
  id: string;
  title: string;
}

interface TeamMember {
  assignedAgentIds?: string[];
  email: string;
  id: string;
  invitedAt: string;
  joinedAt?: string;
  name?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active' | 'inactive';
}

interface TeamLimits {
  current: number;
  limit: number;
  plan: string;
}

interface MembershipTeam {
  agents: { avatar?: string; id: string; title: string }[];
  ownerEmail?: string;
  ownerId: string;
  ownerName?: string;
  role: string;
  status: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
  owner: 'Propriétaire',
  viewer: 'Lecteur',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'blue',
  editor: 'green',
  owner: 'gold',
  viewer: 'default',
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: 'Peut gérer les agents, les produits, les paramètres et les membres',
  editor: 'Peut créer et modifier les agents et les produits',
  owner: 'Accès complet à toutes les fonctionnalités',
  viewer: 'Peut uniquement consulter les agents et les conversations',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'green',
  inactive: 'red',
  pending: 'orange',
};

const TeamPage = memo(() => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [limits, setLimits] = useState<TeamLimits>({ current: 0, limit: 0, plan: 'free' });
  const [agentsList, setAgentsList] = useState<AgentInfo[]>([]);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [agentModalMember, setAgentModalMember] = useState<TeamMember | null>(null);
  const [agentModalSelected, setAgentModalSelected] = useState<string[]>([]);
  const [memberships, setMemberships] = useState<MembershipTeam[]>([]);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setLimits(data.limits || { current: 0, limit: 0, plan: 'free' });
        setAgentsList(data.agents || []);
      }
    } catch {
      message.error('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMemberships = useCallback(async () => {
    try {
      setMembershipLoading(true);
      const res = await fetch('/api/team/my-membership');
      if (res.ok) {
        const data = await res.json();
        setMemberships(data.memberships || []);
      }
    } catch {
      // silently fail — membership is not critical
    } finally {
      setMembershipLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchMemberships();
  }, [fetchMembers, fetchMemberships]);

  const handleInvite = async (values: { assignedAgentIds?: string[]; email: string; name?: string; role: string }) => {
    try {
      setInviting(true);
      const res = await fetch('/api/team', {
        body: JSON.stringify({ action: 'invite', ...values }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          message.success(`Invitation envoyée à ${values.email}`);
          setInviteModalOpen(false);
          form.resetFields();
          fetchMembers();
        } else {
          message.error(data.error || 'Erreur lors de l\'invitation');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        message.error(data.error || 'Erreur lors de l\'invitation');
      }
    } catch {
      message.error('Erreur réseau');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      const res = await fetch('/api/team', {
        body: JSON.stringify({ action: 'remove', memberId }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (res.ok) {
        message.success('Membre retiré');
        fetchMembers();
      }
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      const res = await fetch('/api/team', {
        body: JSON.stringify({ action: 'updateRole', memberId, role: newRole }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (res.ok) {
        message.success('Rôle mis à jour');
        fetchMembers();
      }
    } catch {
      message.error('Erreur lors de la mise à jour');
    }
  };

  const handleUpdateAgents = async (memberId: string, agentIds: string[]) => {
    try {
      const res = await fetch('/api/team', {
        body: JSON.stringify({ action: 'updateAgents', assignedAgentIds: agentIds, memberId }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (res.ok) {
        message.success('Agents mis à jour');
        fetchMembers();
      }
    } catch {
      message.error('Erreur lors de la mise à jour');
    }
  };

  const openAgentModal = (member: TeamMember) => {
    setAgentModalMember(member);
    setAgentModalSelected(member.assignedAgentIds || []);
    setAgentModalOpen(true);
  };

  const handleResendInvite = async (memberId: string) => {
    try {
      const res = await fetch('/api/team', {
        body: JSON.stringify({ action: 'resend', memberId }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (res.ok) {
        message.success('Invitation renvoyée');
      }
    } catch {
      message.error('Erreur lors du renvoi');
    }
  };

  const canInvite = limits.limit === -1 || limits.current < limits.limit;

  const columns = [
    {
      dataIndex: 'name',
      key: 'member',
      render: (_: string, record: TeamMember) => (
        <Flexbox horizontal align="center" gap={12}>
          <Avatar
            style={{
              background: record.role === 'owner' ? '#6366f1' : '#e5e7eb',
              color: record.role === 'owner' ? '#fff' : '#6b7280',
              flexShrink: 0,
            }}
          >
            {(record.name || record.email).charAt(0).toUpperCase()}
          </Avatar>
          <Flexbox>
            <Text strong style={{ fontSize: 13 }}>
              {record.name || '—'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </Flexbox>
        </Flexbox>
      ),
      title: 'Membre',
    },
    {
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={ROLE_COLORS[role] || 'default'}>
          {role === 'owner' && <Crown size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
          {role === 'admin' && <Shield size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
          {ROLE_LABELS[role] || role}
        </Tag>
      ),
      title: 'Rôle',
      width: 160,
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          color={STATUS_COLORS[status] || 'default'}
          text={<Text style={{ fontSize: 12 }}>{STATUS_LABELS[status] || status}</Text>}
        />
      ),
      title: 'Statut',
      width: 120,
    },
    {
      dataIndex: 'assignedAgentIds',
      key: 'agents',
      render: (ids: string[] | undefined, record: TeamMember) => {
        if (record.role === 'owner') {
          return <Tag color="gold" style={{ fontSize: 11 }}>Tous les agents</Tag>;
        }
        const assigned = (ids || []).map((id) => agentsList.find((a) => a.id === id)).filter(Boolean);
        if (assigned.length === 0) {
          return <Text type="secondary" style={{ fontSize: 11 }}>Aucun agent</Text>;
        }
        return (
          <Flexbox horizontal gap={4} style={{ flexWrap: 'wrap' }}>
            {assigned.slice(0, 3).map((a: any) => (
              <Tag key={a.id} style={{ fontSize: 11, margin: 0 }}>
                <Bot size={10} style={{ marginRight: 3, verticalAlign: -1 }} />
                {a.title}
              </Tag>
            ))}
            {assigned.length > 3 && (
              <Tag style={{ fontSize: 11, margin: 0 }}>+{assigned.length - 3}</Tag>
            )}
          </Flexbox>
        );
      },
      title: 'Agents assign\u00e9s',
      width: 200,
    },
    {
      dataIndex: 'invitedAt',
      key: 'invitedAt',
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {date ? new Date(date).toLocaleDateString('fr-FR') : '—'}
        </Text>
      ),
      title: 'Ajouté le',
      width: 120,
    },
    {
      key: 'actions',
      render: (_: unknown, record: TeamMember) => {
        if (record.role === 'owner') return null;
        return (
          <Dropdown
            menu={{
              items: [
                {
                  icon: <Bot size={14} />,
                  key: 'agents',
                  label: 'G\u00e9rer les agents',
                  onClick: () => openAgentModal(record),
                },
                ...(record.status === 'pending' ? [{
                  icon: <Mail size={14} />,
                  key: 'resend',
                  label: 'Renvoyer l\'invitation',
                  onClick: () => handleResendInvite(record.id),
                }] : []),
                {
                  children: [
                    { key: 'admin', label: 'Administrateur', onClick: () => handleChangeRole(record.id, 'admin') },
                    { key: 'editor', label: 'Éditeur', onClick: () => handleChangeRole(record.id, 'editor') },
                    { key: 'viewer', label: 'Lecteur', onClick: () => handleChangeRole(record.id, 'viewer') },
                  ],
                  key: 'role',
                  label: 'Changer le rôle',
                },
                { type: 'divider' as const, key: 'divider' },
                {
                  danger: true,
                  icon: <Trash2 size={14} />,
                  key: 'remove',
                  label: 'Retirer',
                  onClick: () => handleRemove(record.id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button
              icon={<MoreVertical size={16} />}
              size="small"
              type="text"
            />
          </Dropdown>
        );
      },
      title: '',
      width: 50,
    },
  ];

  return (
    <Flexbox style={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Flexbox
        horizontal
        align="center"
        justify="space-between"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 0,
          padding: '24px 32px',
        }}
      >
        <Flexbox horizontal align="center" gap={12}>
          <UsersRound size={28} color="#fff" />
          <Flexbox>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Gestion d'équipe & Revente d'agents
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              Invitez vos clients, assignez-leur des agents IA et gérez leurs accès
            </Text>
          </Flexbox>
        </Flexbox>
        <Flexbox horizontal align="center" gap={12}>
          <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 12 }}>
            {limits.current}/{limits.limit === -1 ? '∞' : limits.limit} membres
          </Tag>
          <Tooltip title={!canInvite ? `Limite atteinte pour le plan ${limits.plan}. Passez à un plan supérieur.` : undefined}>
            <Button
              disabled={!canInvite}
              icon={<UserPlus size={16} />}
              onClick={() => setInviteModalOpen(true)}
              style={canInvite ? { background: '#fff', borderColor: '#fff', color: '#6366f1' } : undefined}
              type="primary"
            >
              Inviter un membre
            </Button>
          </Tooltip>
        </Flexbox>
      </Flexbox>

      {/* Shared Agents Section (memberships from resellers) */}
      {!membershipLoading && memberships.length > 0 && (
        <Flexbox style={{ padding: '24px 32px 0' }}>
          <Flexbox horizontal align="center" gap={8} style={{ marginBottom: 16 }}>
            <Share2 size={18} color="#6366f1" />
            <Title level={5} style={{ margin: 0 }}>Agents partagés avec vous</Title>
          </Flexbox>
          <Flexbox gap={16}>
            {memberships.map((team) => (
              <Card
                key={team.ownerId}
                size="small"
                style={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                }}
              >
                <Flexbox gap={12}>
                  <Flexbox horizontal align="center" justify="space-between">
                    <Flexbox horizontal align="center" gap={10}>
                      <Avatar
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        {(team.ownerName || team.ownerEmail || 'R').charAt(0).toUpperCase()}
                      </Avatar>
                      <Flexbox>
                        <Text strong style={{ fontSize: 14 }}>
                          {team.ownerName || 'Reseller'}
                        </Text>
                        {team.ownerEmail && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {team.ownerEmail}
                          </Text>
                        )}
                      </Flexbox>
                    </Flexbox>
                    <Flexbox horizontal align="center" gap={8}>
                      <Tag color={ROLE_COLORS[team.role] || 'default'}>
                        {ROLE_LABELS[team.role] || team.role}
                      </Tag>
                      <Badge
                        color={STATUS_COLORS[team.status] || 'default'}
                        text={<Text style={{ fontSize: 11 }}>{STATUS_LABELS[team.status] || team.status}</Text>}
                      />
                    </Flexbox>
                  </Flexbox>

                  {team.agents.length === 0 ? (
                    <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                      Aucun agent assigné pour le moment.
                    </Text>
                  ) : (
                    <Flexbox gap={8}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {team.agents.length} agent{team.agents.length > 1 ? 's' : ''} accessible{team.agents.length > 1 ? 's' : ''}
                      </Text>
                      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
                        {team.agents.map((agent) => (
                          <Card
                            key={agent.id}
                            size="small"
                            hoverable
                            style={{
                              borderRadius: 10,
                              minWidth: 160,
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              window.open(`/chat?agent=${agent.id}&owner=${team.ownerId}`, '_blank');
                            }}
                          >
                            <Flexbox horizontal align="center" gap={8}>
                              <Bot size={18} color="#6366f1" />
                              <Flexbox style={{ flex: 1, minWidth: 0 }}>
                                <Text strong style={{ fontSize: 13 }} ellipsis>
                                  {agent.title}
                                </Text>
                              </Flexbox>
                              <ExternalLink size={14} color="#9ca3af" />
                            </Flexbox>
                          </Card>
                        ))}
                      </Flexbox>
                    </Flexbox>
                  )}
                </Flexbox>
              </Card>
            ))}
          </Flexbox>
        </Flexbox>
      )}

      {/* Content */}
      <Flexbox style={{ flex: 1, padding: '24px 32px' }}>
        {/* Roles info cards */}
        <Flexbox horizontal gap={12} style={{ marginBottom: 24 }}>
          {['admin', 'editor', 'viewer'].map((role) => (
            <Card
              key={role}
              size="small"
              style={{ borderRadius: 10, flex: 1 }}
            >
              <Flexbox gap={4}>
                <Tag color={ROLE_COLORS[role]} style={{ width: 'fit-content', fontSize: 11 }}>
                  {ROLE_LABELS[role]}
                </Tag>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {ROLE_DESCRIPTIONS[role]}
                </Text>
              </Flexbox>
            </Card>
          ))}
        </Flexbox>

        {/* Table */}
        {loading ? (
          <Flexbox align="center" justify="center" style={{ padding: 80 }}>
            <Spin size="large" />
          </Flexbox>
        ) : members.length === 0 ? (
          <Card
            style={{
              background: 'linear-gradient(135deg, #f0f0ff 0%, #e8e0ff 100%)',
              border: '1px dashed #c4b5fd',
              borderRadius: 16,
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <Flexbox align="center" gap={16}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={32} color="#fff" />
              </div>
              <Title level={5} style={{ margin: 0 }}>
                Commencez à revendre vos agents IA
              </Title>
              <Text type="secondary" style={{ fontSize: 13, maxWidth: 420 }}>
                Créez des agents IA, invitez vos clients ici et assignez-leur les agents auxquels ils auront accès. Chaque client ne verra que ses agents assignés.
              </Text>
              <Flexbox horizontal gap={12} style={{ marginTop: 8 }}>
                <Button
                  disabled={!canInvite}
                  icon={<UserPlus size={16} />}
                  onClick={() => setInviteModalOpen(true)}
                  type="primary"
                  style={{ background: '#6366f1', borderColor: '#6366f1' }}
                >
                  Inviter votre premier client
                </Button>
              </Flexbox>
              <Flexbox gap={8} style={{ marginTop: 16, textAlign: 'left', maxWidth: 420 }}>
                <Text strong style={{ fontSize: 12, color: '#6366f1' }}>Comment ça marche ?</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  1. Créez un ou plusieurs agents IA dans votre espace
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  2. Invitez un client par email et assignez-lui des agents
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  3. Votre client se connecte et ne voit que les agents que vous lui avez assignés
                </Text>
              </Flexbox>
            </Flexbox>
          </Card>
        ) : (
          <Table
            columns={columns}
            dataSource={members}
            pagination={false}
            rowKey="id"
            size="middle"
            style={{ borderRadius: 10 }}
          />
        )}

        {/* Upgrade banner if at limit */}
        {!canInvite && limits.limit >= 0 && (
          <Card
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: 'none',
              borderRadius: 12,
              marginTop: 16,
            }}
          >
            <Flexbox horizontal align="center" justify="space-between">
              <Flexbox>
                <Text strong>Limite de membres atteinte</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Votre plan {limits.plan} permet {limits.limit} membre{limits.limit > 1 ? 's' : ''}. Passez à un plan supérieur pour inviter plus de personnes.
                </Text>
              </Flexbox>
              <Button type="primary" href="/subscription">
                Mettre à niveau
              </Button>
            </Flexbox>
          </Card>
        )}
      </Flexbox>

      {/* Invite Modal */}
      <Modal
        cancelText="Annuler"
        okButtonProps={{ loading: inviting }}
        okText="Envoyer l'invitation"
        onCancel={() => {
          setInviteModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        open={inviteModalOpen}
        title={
          <Flexbox horizontal align="center" gap={8}>
            <UserPlus size={20} />
            Inviter un membre
          </Flexbox>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInvite}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Adresse email"
            name="email"
            rules={[
              { message: 'Veuillez entrer une adresse email', required: true },
              { message: 'Adresse email invalide', type: 'email' },
            ]}
          >
            <Input placeholder="collaborateur@entreprise.com" />
          </Form.Item>
          <Form.Item label="Nom (optionnel)" name="name">
            <Input placeholder="Jean Dupont" />
          </Form.Item>
          <Form.Item
            initialValue="editor"
            label="Rôle"
            name="role"
            rules={[{ message: 'Veuillez sélectionner un rôle', required: true }]}
          >
            <Select
              options={[
                { label: 'Administrateur — Accès complet sauf facturation', value: 'admin' },
                { label: 'Éditeur — Peut créer et modifier', value: 'editor' },
                { label: 'Lecteur — Consultation uniquement', value: 'viewer' },
              ]}
            />
          </Form.Item>
          {agentsList.length > 0 && (
            <Form.Item
              label={
                <Flexbox horizontal align="center" gap={6}>
                  <Bot size={14} />
                  Agents accessibles
                </Flexbox>
              }
              name="assignedAgentIds"
              extra="Sélectionnez les agents auxquels ce membre aura accès. Sans sélection, aucun agent ne sera visible."
            >
              <Select
                mode="multiple"
                placeholder="Sélectionner des agents..."
                options={agentsList.map((a) => ({
                  label: a.title,
                  value: a.id,
                }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
          <Card
            size="small"
            style={{
              background: '#f0f0ff',
              border: '1px solid #e0e0ff',
              borderRadius: 8,
            }}
          >
            <Flexbox horizontal align="center" gap={8}>
              <Mail size={16} color="#6366f1" />
              <Text style={{ fontSize: 12 }}>
                Un email d'invitation sera envoyé à cette adresse avec un lien pour rejoindre votre espace de travail.
              </Text>
            </Flexbox>
          </Card>
        </Form>
      </Modal>

      {/* Agent Management Modal */}
      <Modal
        cancelText="Annuler"
        okText="Enregistrer"
        onCancel={() => {
          setAgentModalOpen(false);
          setAgentModalMember(null);
        }}
        onOk={() => {
          if (agentModalMember) {
            handleUpdateAgents(agentModalMember.id, agentModalSelected);
          }
          setAgentModalOpen(false);
          setAgentModalMember(null);
        }}
        open={agentModalOpen}
        title={
          <Flexbox horizontal align="center" gap={8}>
            <Bot size={20} />
            Gérer les agents — {agentModalMember?.name || agentModalMember?.email}
          </Flexbox>
        }
      >
        <Flexbox gap={12} style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Sélectionnez les agents auxquels ce membre aura accès. Il ne verra que ces agents dans son espace.
          </Text>
          {agentsList.length === 0 ? (
            <Card size="small" style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8 }}>
              <Text style={{ fontSize: 12 }}>Vous n'avez aucun agent. Créez un agent d'abord.</Text>
            </Card>
          ) : (
            <Flexbox gap={6} style={{ maxHeight: 350, overflowY: 'auto' }}>
              {agentsList.map((agent) => {
                const isSelected = agentModalSelected.includes(agent.id);
                return (
                  <Flexbox
                    key={agent.id}
                    horizontal
                    align="center"
                    gap={10}
                    onClick={() => {
                      setAgentModalSelected((prev) =>
                        prev.includes(agent.id)
                          ? prev.filter((id) => id !== agent.id)
                          : [...prev, agent.id]
                      );
                    }}
                    style={{
                      border: `1px solid ${isSelected ? '#6366f1' : '#f0f0f0'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      padding: '10px 14px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: `2px solid ${isSelected ? '#6366f1' : '#d1d5db'}`,
                        background: isSelected ? '#6366f1' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isSelected && (
                        <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                    <Bot size={16} color={isSelected ? '#6366f1' : '#9ca3af'} />
                    <Text strong={isSelected} style={{ fontSize: 13 }}>{agent.title}</Text>
                  </Flexbox>
                );
              })}
            </Flexbox>
          )}
          <Text type="secondary" style={{ fontSize: 11 }}>
            {agentModalSelected.length === 0
              ? 'Aucun agent sélectionné — ce membre ne verra aucun agent'
              : `${agentModalSelected.length} agent${agentModalSelected.length > 1 ? 's' : ''} sélectionné${agentModalSelected.length > 1 ? 's' : ''}`}
          </Text>
        </Flexbox>
      </Modal>
    </Flexbox>
  );
});

export default TeamPage;
