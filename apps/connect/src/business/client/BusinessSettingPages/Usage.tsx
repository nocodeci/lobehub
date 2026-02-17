'use client';

import { FormGroup } from '@lobehub/ui';
import { Card, Col, Progress, Row, Statistic, Tag, Typography } from 'antd';
import {
  Activity,
  BarChart3,
  Bot,
  Clock,
  Coins,
  Database,
  HardDrive,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import SettingHeader from '@/app/[variants]/(main)/settings/features/SettingHeader';

const { Text, Title } = Typography;

interface CreditSummary {
  creditValueDollars: string;
  limit: number;
  periodEnd: string;
  periodStart: string;
  plan: string;
  remaining: number;
  remainingDollars: string;
  topUp: number;
  topUpDollars: string;
  used: number;
  usedDollars: string;
}

interface PlanLimitsData {
  canCreateAgent: { allowed: boolean; limit: number };
  canUseBYOK: { allowed: boolean };
  currentUsage: { agents: number };
  limits: {
    agents: number;
    byokAllowed: boolean;
    credits: number;
    name: string;
    storage: number;
    teamMembers: number;
    whatsappAccounts: number;
  };
  plan: string;
  summary: Record<string, string>;
}

const Usage = memo<{ mobile?: boolean }>(() => {
  const [credits, setCredits] = useState<CreditSummary | null>(null);
  const [planData, setPlanData] = useState<PlanLimitsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/subscription/credits').then((r) => r.json()),
      fetch('/api/subscription/limits').then((r) => r.json()),
    ])
      .then(([creditsData, limitsData]) => {
        setCredits(creditsData);
        setPlanData(limitsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const creditPercent =
    credits && credits.limit > 0
      ? Math.min(100, Math.round((credits.used / credits.limit) * 100))
      : 0;

  const agentPercent =
    planData && planData.limits.agents > 0
      ? Math.min(100, Math.round((planData.currentUsage.agents / planData.limits.agents) * 100))
      : 0;

  const daysRemaining = credits?.periodEnd
    ? Math.max(
        0,
        Math.ceil((new Date(credits.periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  const periodDays = credits?.periodStart && credits?.periodEnd
    ? Math.ceil(
        (new Date(credits.periodEnd).getTime() - new Date(credits.periodStart).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 30;

  const periodPercent = Math.min(100, Math.round(((periodDays - daysRemaining) / periodDays) * 100));

  return (
    <>
      <SettingHeader title="Statistiques d'utilisation" />

      <FormGroup collapsible={false} gap={16} title="Aperçu du mois" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Zap size={18} style={{ color: '#722ed1' }} />}
                title="Plan actuel"
                value={credits?.plan || 'Gratuit'}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Coins size={18} style={{ color: '#faad14' }} />}
                title="Crédits consommés"
                value={credits?.usedDollars || '$0.00'}
                suffix={
                  <Text style={{ fontSize: 12 }} type="secondary">
                    sur {credits?.creditValueDollars || '$0.00'}
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Bot size={18} style={{ color: '#1677ff' }} />}
                title="Agents actifs"
                value={planData?.currentUsage.agents || 0}
                suffix={
                  planData?.limits.agents && planData.limits.agents > 0
                    ? `/ ${planData.limits.agents}`
                    : '/ ∞'
                }
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Clock size={18} style={{ color: '#52c41a' }} />}
                title="Jours restants"
                value={daysRemaining}
                suffix="jours"
              />
            </Card>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Détail de l'utilisation" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <Coins size={18} style={{ color: '#faad14' }} />
                  <Text strong>Crédits de calcul</Text>
                </div>

                <div>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text type="secondary">
                      {credits?.used?.toLocaleString('fr-FR') || 0} /{' '}
                      {credits?.limit === -1
                        ? '∞'
                        : credits?.limit?.toLocaleString('fr-FR') || 0}{' '}
                      crédits
                    </Text>
                    <Tag
                      color={
                        creditPercent > 90 ? 'red' : creditPercent > 70 ? 'orange' : 'green'
                      }
                    >
                      {creditPercent}%
                    </Tag>
                  </div>
                  <Progress
                    percent={creditPercent}
                    showInfo={false}
                    strokeColor={
                      creditPercent > 90
                        ? '#ff4d4f'
                        : creditPercent > 70
                          ? '#faad14'
                          : '#52c41a'
                    }
                  />
                </div>

                {credits && credits.topUp > 0 && (
                  <div
                    style={{
                      background: 'var(--ant-color-fill-quaternary)',
                      borderRadius: 8,
                      padding: '8px 12px',
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      <TrendingUp size={12} style={{ marginRight: 4 }} />
                      Crédits top-up disponibles : <strong>{credits.topUpDollars}</strong> (
                      {credits.topUp.toLocaleString('fr-FR')} crédits)
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <Bot size={18} style={{ color: '#1677ff' }} />
                  <Text strong>Agents</Text>
                </div>

                <div>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text type="secondary">
                      {planData?.currentUsage.agents || 0} /{' '}
                      {planData?.limits.agents === -1
                        ? '∞'
                        : planData?.limits.agents || 0}{' '}
                      agents
                    </Text>
                    <Tag color={agentPercent > 90 ? 'red' : agentPercent > 70 ? 'orange' : 'blue'}>
                      {agentPercent}%
                    </Tag>
                  </div>
                  <Progress
                    percent={agentPercent}
                    showInfo={false}
                    strokeColor="#1677ff"
                  />
                </div>

                <div
                  style={{
                    background: 'var(--ant-color-fill-quaternary)',
                    borderRadius: 8,
                    padding: '8px 12px',
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    <Activity size={12} style={{ marginRight: 4 }} />
                    BYOK :{' '}
                    {planData?.canUseBYOK?.allowed ? (
                      <Tag color="green">Activé</Tag>
                    ) : (
                      <Tag color="default">Pro+ requis</Tag>
                    )}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <Clock size={18} style={{ color: '#52c41a' }} />
                  <Text strong>Période de facturation</Text>
                </div>
                <div>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text type="secondary">
                      Jour {periodDays - daysRemaining} / {periodDays}
                    </Text>
                    <Text type="secondary">{daysRemaining} jours restants</Text>
                  </div>
                  <Progress percent={periodPercent} showInfo={false} strokeColor="#52c41a" />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Début :{' '}
                    {credits?.periodStart
                      ? new Date(credits.periodStart).toLocaleDateString('fr-FR')
                      : '—'}
                  </Text>
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Fin :{' '}
                    {credits?.periodEnd
                      ? new Date(credits.periodEnd).toLocaleDateString('fr-FR')
                      : '—'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={12} xs={24}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                  <HardDrive size={18} style={{ color: '#fa8c16' }} />
                  <Text strong>Limites du plan</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    {
                      icon: <Database size={14} />,
                      label: 'Stockage',
                      value: planData?.summary?.storage || '—',
                    },
                    {
                      icon: <Users size={14} />,
                      label: 'Équipe',
                      value: planData?.summary?.team || '—',
                    },
                    {
                      icon: <MessageSquare size={14} />,
                      label: 'WhatsApp',
                      value: planData?.summary?.whatsapp || '—',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                        {item.icon}
                        <Text style={{ fontSize: 13 }}>{item.label}</Text>
                      </div>
                      <Text strong style={{ fontSize: 13 }}>
                        {item.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
});

export default Usage;
