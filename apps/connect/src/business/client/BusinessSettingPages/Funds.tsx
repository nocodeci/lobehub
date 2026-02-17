'use client';

import { FormGroup } from '@lobehub/ui';
import { Button, Card, Col, Divider, Progress, Row, Statistic, Table, Tag, Typography, message } from 'antd';
import {
  ArrowUpRight,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

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

const TOP_UP_OPTIONS = [
  { amount: 5, credits: 500, label: '5€' },
  { amount: 10, credits: 1000, label: '10€' },
  { amount: 25, credits: 2500, label: '25€' },
  { amount: 50, credits: 5000, label: '50€' },
];

const MODEL_PRICING = [
  { cost: 1, model: 'GPT-4o-mini', provider: 'OpenAI' },
  { cost: 3, model: 'GPT-4o', provider: 'OpenAI' },
  { cost: 3, model: 'GPT-4 Turbo', provider: 'OpenAI' },
  { cost: 2, model: 'o1-mini', provider: 'OpenAI' },
  { cost: 5, model: 'o1', provider: 'OpenAI' },
  { cost: 2, model: 'Claude 3 Haiku', provider: 'Anthropic (Pro+)' },
  { cost: 5, model: 'Claude 3.5 Sonnet', provider: 'Anthropic (Pro+)' },
  { cost: 20, model: 'Claude 3 Opus', provider: 'Anthropic (Pro+)' },
  { cost: 1, model: 'Gemini Flash', provider: 'Google' },
  { cost: 2, model: 'Gemini 1.5 Pro', provider: 'Google' },
  { cost: 1, model: 'DeepSeek Chat', provider: 'DeepSeek' },
  { cost: 2, model: 'DeepSeek Reasoner', provider: 'DeepSeek' },
  { cost: 1, model: 'Llama 3.1 70B', provider: 'Groq' },
  { cost: 1, model: 'Mixtral 8x7B', provider: 'Groq' },
];

const Funds = memo<{ mobile?: boolean }>(() => {
  const [credits, setCredits] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [topUpLoading, setTopUpLoading] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/subscription/credits')
      .then((res) => res.json())
      .then((data) => {
        setCredits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTopUp = useCallback(async (amount: number) => {
    setTopUpLoading(amount);
    try {
      const res = await fetch('/api/subscription/credits/topup', {
        body: JSON.stringify({ amount }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        message.error(data.error || 'Erreur lors de la recharge.');
      }
    } catch {
      message.error('Erreur réseau. Veuillez réessayer.');
    } finally {
      setTopUpLoading(null);
    }
  }, []);

  const usagePercent = credits && credits.limit > 0
    ? Math.min(100, Math.round((credits.used / credits.limit) * 100))
    : 0;

  const periodEndDate = credits?.periodEnd
    ? new Date(credits.periodEnd).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const daysRemaining = credits?.periodEnd
    ? Math.max(0, Math.ceil((new Date(credits.periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <SettingHeader title="Gestion des crédits" />

      <FormGroup collapsible={false} gap={16} title="Solde actuel" variant={'filled'}>
        <Row gutter={[16, 16]}>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Coins size={18} style={{ color: '#faad14' }} />}
                title="Crédits restants"
                value={credits?.remaining === -1 ? '∞' : credits?.remaining?.toLocaleString('fr-FR') || '0'}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<TrendingUp size={18} style={{ color: '#1677ff' }} />}
                title="Crédits utilisés"
                value={credits?.used?.toLocaleString('fr-FR') || '0'}
                suffix={credits?.limit && credits.limit > 0 ? `/ ${credits.limit.toLocaleString('fr-FR')}` : ''}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<DollarSign size={18} style={{ color: '#722ed1' }} />}
                title="Valeur restante"
                value={credits?.remainingDollars || '$0.00'}
              />
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card loading={loading}>
              <Statistic
                prefix={<Clock size={18} style={{ color: '#fa8c16' }} />}
                title="Renouvellement"
                value={`${daysRemaining}j`}
                suffix={<Text style={{ fontSize: 12 }} type="secondary">restants</Text>}
              />
            </Card>
          </Col>
        </Row>

        {!loading && credits && credits.limit > 0 && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Utilisation ce mois</Text>
                <Text type="secondary">{usagePercent}%</Text>
              </div>
              <Progress
                percent={usagePercent}
                showInfo={false}
                status={usagePercent > 90 ? 'exception' : usagePercent > 70 ? 'active' : 'normal'}
                strokeColor={usagePercent > 90 ? '#ff4d4f' : usagePercent > 70 ? '#faad14' : '#52c41a'}
              />
              <div style={{ display: 'flex', gap: 16 }}>
                <Text style={{ fontSize: 12 }} type="secondary">
                  Plan : <Tag color="blue">{credits.plan}</Tag>
                </Text>
                <Text style={{ fontSize: 12 }} type="secondary">
                  Renouvellement : {periodEndDate}
                </Text>
                {credits.topUp > 0 && (
                  <Text style={{ fontSize: 12 }} type="secondary">
                    Top-up : <Tag color="green">{credits.topUpDollars}</Tag>
                  </Text>
                )}
              </div>
            </div>
          </Card>
        )}
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Recharger des crédits" variant={'filled'}>
        <Row gutter={[16, 16]}>
          {TOP_UP_OPTIONS.map((option) => (
            <Col key={option.amount} md={6} xs={12}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#722ed115',
                      borderRadius: 12,
                      display: 'flex',
                      height: 48,
                      justifyContent: 'center',
                      margin: '0 auto',
                      width: 48,
                    }}
                  >
                    <Package color="#722ed1" size={24} />
                  </div>
                  <Title level={4} style={{ margin: 0 }}>
                    {option.label}
                  </Title>
                  <Text type="secondary">{option.credits.toLocaleString('fr-FR')} crédits</Text>
                  <Button
                    block
                    icon={<Plus size={14} />}
                    loading={topUpLoading === option.amount}
                    onClick={() => handleTopUp(option.amount)}
                    type="primary"
                  >
                    Acheter
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </FormGroup>

      <FormGroup collapsible gap={16} title="Tarification des modèles" variant={'filled'}>
        <Text type="secondary" style={{ marginBottom: 8 }}>
          1 crédit = 0,01€ — Le coût est déduit par message envoyé.
        </Text>
        <Table
          columns={[
            {
              dataIndex: 'model',
              key: 'model',
              render: (text: string) => <Text strong>{text}</Text>,
              title: 'Modèle',
            },
            {
              dataIndex: 'provider',
              key: 'provider',
              render: (text: string) => {
                const isRestricted = text.includes('Pro+');
                return (
                  <>
                    {text.replace(' (Pro+)', '')}
                    {isRestricted && (
                      <Tag color="purple" style={{ marginLeft: 4 }}>
                        Pro+
                      </Tag>
                    )}
                  </>
                );
              },
              title: 'Fournisseur',
            },
            {
              dataIndex: 'cost',
              key: 'cost',
              render: (cost: number) => (
                <Tag color={cost <= 1 ? 'green' : cost <= 3 ? 'blue' : cost <= 5 ? 'orange' : 'red'}>
                  {cost} crédit{cost > 1 ? 's' : ''} / message
                </Tag>
              ),
              title: 'Coût',
            },
            {
              key: 'price',
              render: (_: any, record: any) => (
                <Text type="secondary">{(record.cost * 0.01).toFixed(2)}€</Text>
              ),
              title: 'Prix / message',
            },
          ]}
          dataSource={MODEL_PRICING.map((m, i) => ({ ...m, key: i }))}
          pagination={false}
          size="small"
        />
      </FormGroup>
    </>
  );
});

export default Funds;
