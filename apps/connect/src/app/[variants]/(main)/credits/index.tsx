'use client';

import { Icon } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Button, Card, Divider, InputNumber, Spin, Tag, Typography, message } from 'antd';
import { cssVar } from 'antd-style';
import {
  AlertTriangle,
  ArrowUpCircle,
  Check,
  Coins,
  CreditCard,
  Lock,
  Sparkle,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

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

const TOPUP_OPTIONS = [
  { credits: 500, label: '$5', popular: false, value: 5 },
  { credits: 1000, label: '$10', popular: true, value: 10 },
  { credits: 2500, label: '$25', popular: false, value: 25 },
  { credits: 5000, label: '$50', popular: false, value: 50 },
];

const MODEL_PRICING = [
  { cost: '$0.01', credits: 1, model: 'GPT-4o-mini', provider: 'OpenAI' },
  { cost: '$0.03', credits: 3, model: 'GPT-4o', provider: 'OpenAI' },
  { cost: '$0.01', credits: 1, model: 'Gemini Flash', provider: 'Google' },
  { cost: '$0.02', credits: 2, model: 'Gemini 1.5 Pro', provider: 'Google' },
  { cost: '$0.01', credits: 1, model: 'DeepSeek Chat', provider: 'DeepSeek' },
  { cost: '$0.02', credits: 2, model: 'DeepSeek Reasoner', provider: 'DeepSeek' },
  { cost: '$0.01', credits: 1, model: 'Llama 3.1 (Groq)', provider: 'Groq' },
  { cost: '$0.02', credits: 2, model: 'Claude Haiku', pro: true, provider: 'Anthropic' },
  { cost: '$0.05', credits: 5, model: 'Claude Sonnet', pro: true, provider: 'Anthropic' },
  { cost: '$0.20', credits: 20, model: 'Claude Opus', pro: true, provider: 'Anthropic' },
];

const CreditsPage = memo(() => {
  const [creditSummary, setCreditSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [topUpLoading, setTopUpLoading] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(10);

  const isFree = creditSummary?.plan === 'Gratuit';
  const canTopUp = !isFree;

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscription/credits');
      if (res.ok) {
        const data = await res.json();
        setCreditSummary(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Handle return from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topup = params.get('topup');
    const amount = params.get('amount');

    if (topup === 'success') {
      message.success(`Crédits ajoutés avec succès${amount ? ` : $${amount}` : ''} !`);
      window.history.replaceState({}, '', '/credits');
      fetchCredits();
    } else if (topup === 'cancelled') {
      message.info('Recharge annulée.');
      window.history.replaceState({}, '', '/credits');
    }
  }, [fetchCredits]);

  const handleTopUp = useCallback(
    async (amountDollars: number) => {
      if (!canTopUp) {
        message.warning(
          'La recharge de crédits est disponible à partir du plan Starter. Passez à un plan supérieur.',
        );
        return;
      }

      setTopUpLoading(amountDollars);
      try {
        const res = await fetch('/api/subscription/credits/topup', {
          body: JSON.stringify({ amount: amountDollars }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur lors de la recharge');
        if (data.url) {
          window.location.href = data.url;
        } else {
          message.success('Crédits ajoutés avec succès !');
          fetchCredits();
        }
      } catch (error: any) {
        message.error(error.message || 'Erreur lors de la recharge de crédits.');
      } finally {
        setTopUpLoading(null);
      }
    },
    [canTopUp, fetchCredits],
  );

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Flexbox>
    );
  }

  return (
    <Flexbox
      gap={24}
      style={{
        margin: '0 auto',
        maxWidth: 800,
        overflow: 'auto',
        padding: '24px 16px',
        width: '100%',
      }}
    >
      {/* Header */}
      <Flexbox align="center" gap={8} horizontal>
        <Icon icon={Coins} size={28} style={{ color: '#faad14' }} />
        <Title level={3} style={{ margin: 0 }}>
          Crédits IA
        </Title>
      </Flexbox>

      {/* Credit Balance */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #ff7a00 0%, #ff5500 100%)',
          border: 'none',
          borderRadius: 16,
          color: '#fff',
        }}
      >
        <Flexbox gap={16}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Solde disponible</Text>
          <Title level={1} style={{ color: '#fff', margin: 0 }}>
            {creditSummary?.remainingDollars || '$0.00'}
          </Title>

          {/* Usage bar */}
          {creditSummary && creditSummary.limit > 0 && (
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 6,
                height: 10,
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <div
                style={{
                  background:
                    creditSummary.remaining / creditSummary.limit < 0.2
                      ? '#ff4d4f'
                      : '#fff',
                  borderRadius: 6,
                  height: '100%',
                  transition: 'width 0.3s',
                  width: `${Math.max(0, Math.min(100, (creditSummary.remaining / creditSummary.limit) * 100))}%`,
                }}
              />
            </div>
          )}

          <Flexbox gap={4} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              Utilisé : {creditSummary?.usedDollars || '$0.00'} sur{' '}
              {creditSummary?.creditValueDollars || '$0.00'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              Plan : {creditSummary?.plan || 'Gratuit'}
              {creditSummary && creditSummary.topUp > 0 && (
                <> | Top-up : {creditSummary.topUpDollars}</>
              )}
            </Text>
          </Flexbox>

          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            Renouvellement :{' '}
            {creditSummary
              ? new Date(creditSummary.periodEnd).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '—'}
          </Text>
        </Flexbox>
      </Card>

      {/* Low balance warning */}
      {creditSummary && creditSummary.limit > 0 && creditSummary.remaining / creditSummary.limit < 0.2 && (
        <Card
          style={{
            background: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: 12,
          }}
        >
          <Flexbox align="center" gap={12} horizontal>
            <Icon icon={AlertTriangle} size={20} style={{ color: '#fa8c16' }} />
            <Flexbox gap={2}>
              <Text strong style={{ color: '#d46b08' }}>
                Crédits bientôt épuisés
              </Text>
              <Text style={{ color: '#d46b08', fontSize: 13 }}>
                Il vous reste {creditSummary.remainingDollars}. Rechargez vos crédits pour
                continuer à utiliser l&apos;IA sans interruption.
              </Text>
            </Flexbox>
          </Flexbox>
        </Card>
      )}

      {/* Top-Up Section */}
      <Card style={{ borderRadius: 16 }}>
        <Flexbox gap={20}>
          <Flexbox align="center" gap={8} horizontal>
            <Icon icon={ArrowUpCircle} size={20} style={{ color: cssVar.colorPrimary }} />
            <Title level={4} style={{ margin: 0 }}>
              Recharger des crédits
            </Title>
          </Flexbox>

          {isFree ? (
            <Card
              style={{
                background: cssVar.colorFillQuaternary,
                border: `1px solid ${cssVar.colorBorderSecondary}`,
                borderRadius: 12,
              }}
            >
              <Flexbox align="center" gap={12} horizontal>
                <Icon icon={Lock} size={24} style={{ color: cssVar.colorTextQuaternary }} />
                <Flexbox gap={4}>
                  <Text strong>Recharge non disponible pour le plan Gratuit</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Passez au plan Starter ou supérieur pour pouvoir recharger vos crédits IA.
                  </Text>
                  <Button
                    onClick={() => {
                      window.location.hash = '#/subscription';
                    }}
                    size="small"
                    style={{ marginTop: 8, width: 'fit-content' }}
                    type="primary"
                  >
                    Voir les plans
                  </Button>
                </Flexbox>
              </Flexbox>
            </Card>
          ) : (
            <>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Ajoutez des crédits à votre compte. Les crédits top-up ne sont pas réinitialisés
                mensuellement et restent disponibles jusqu&apos;à utilisation.
              </Text>

              {/* Quick top-up options */}
              <Flexbox gap={12} horizontal style={{ flexWrap: 'wrap' }}>
                {TOPUP_OPTIONS.map((option) => (
                  <Card
                    key={option.value}
                    hoverable
                    onClick={() => handleTopUp(option.value)}
                    style={{
                      border: option.popular
                        ? `2px solid ${cssVar.colorPrimary}`
                        : undefined,
                      borderRadius: 12,
                      cursor: topUpLoading ? 'wait' : 'pointer',
                      flex: '1 1 140px',
                      minWidth: 140,
                      position: 'relative',
                      textAlign: 'center',
                    }}
                  >
                    {option.popular && (
                      <Tag
                        color="blue"
                        style={{
                          fontSize: 10,
                          left: '50%',
                          position: 'absolute',
                          top: -10,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        Populaire
                      </Tag>
                    )}
                    <Flexbox align="center" gap={4}>
                      <Text style={{ fontSize: 24, fontWeight: 800 }}>{option.label}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {option.credits} crédits
                      </Text>
                      {topUpLoading === option.value && <Spin size="small" />}
                    </Flexbox>
                  </Card>
                ))}
              </Flexbox>

              {/* Custom amount */}
              <Divider style={{ margin: '4px 0' }}>ou montant personnalisé</Divider>
              <Flexbox align="center" gap={12} horizontal>
                <InputNumber
                  addonBefore="$"
                  min={1}
                  max={1000}
                  onChange={(val) => setCustomAmount(val || 10)}
                  style={{ flex: 1 }}
                  value={customAmount}
                />
                <Button
                  icon={<Icon icon={CreditCard} size={14} />}
                  loading={topUpLoading === customAmount}
                  onClick={() => handleTopUp(customAmount)}
                  type="primary"
                >
                  Recharger ${customAmount}
                </Button>
              </Flexbox>
            </>
          )}
        </Flexbox>
      </Card>

      {/* Model Pricing */}
      <Card style={{ borderRadius: 16 }}>
        <Flexbox gap={16}>
          <Flexbox align="center" gap={8} horizontal>
            <Icon icon={Zap} size={20} style={{ color: cssVar.colorPrimary }} />
            <Title level={4} style={{ margin: 0 }}>
              Tarification par modèle
            </Title>
          </Flexbox>

          <Text type="secondary" style={{ fontSize: 13 }}>
            Chaque modèle IA a un coût différent par message. Les modèles Claude sont réservés aux
            plans Pro et supérieurs.
          </Text>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                borderCollapse: 'collapse',
                fontSize: 13,
                minWidth: 500,
                width: '100%',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `2px solid ${cssVar.colorBorderSecondary}`,
                  }}
                >
                  <th style={{ fontWeight: 700, padding: '10px 12px', textAlign: 'left' }}>
                    Modèle
                  </th>
                  <th style={{ fontWeight: 700, padding: '10px 12px', textAlign: 'left' }}>
                    Fournisseur
                  </th>
                  <th style={{ fontWeight: 700, padding: '10px 12px', textAlign: 'center' }}>
                    Coût / message
                  </th>
                  <th style={{ fontWeight: 700, padding: '10px 12px', textAlign: 'center' }}>
                    Accès
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODEL_PRICING.map((row) => (
                  <tr
                    key={row.model}
                    style={{
                      borderBottom: `1px solid ${cssVar.colorBorderSecondary}`,
                    }}
                  >
                    <td style={{ fontWeight: 500, padding: '10px 12px' }}>
                      {row.model}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Text type="secondary">{row.provider}</Text>
                    </td>
                    <td style={{ fontWeight: 600, padding: '10px 12px', textAlign: 'center' }}>
                      {row.cost}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {row.pro ? (
                        <Tag color="purple" style={{ margin: 0 }}>
                          Pro+
                        </Tag>
                      ) : (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Flexbox>
      </Card>

      {/* FAQ */}
      <Card style={{ borderRadius: 16 }}>
        <Flexbox gap={16}>
          <Title level={4} style={{ margin: 0 }}>
            Questions fréquentes
          </Title>

          <Flexbox gap={12}>
            <Flexbox gap={4}>
              <Text strong>Qu&apos;est-ce qu&apos;un crédit ?</Text>
              <Paragraph style={{ fontSize: 13, margin: 0 }} type="secondary">
                1 crédit = $0.01. Chaque message IA consomme un nombre de crédits qui dépend du
                modèle utilisé. Par exemple, un message GPT-4o-mini coûte 1 crédit ($0.01) tandis
                qu&apos;un message Claude Opus coûte 20 crédits ($0.20).
              </Paragraph>
            </Flexbox>

            <Divider style={{ margin: '4px 0' }} />

            <Flexbox gap={4}>
              <Text strong>Que se passe-t-il quand mes crédits sont épuisés ?</Text>
              <Paragraph style={{ fontSize: 13, margin: 0 }} type="secondary">
                L&apos;accès à l&apos;IA est coupé : le chat IA, les automatisations WhatsApp et
                l&apos;exécution d&apos;agents ne fonctionneront plus. Rechargez vos crédits ou
                attendez le renouvellement mensuel.
              </Paragraph>
            </Flexbox>

            <Divider style={{ margin: '4px 0' }} />

            <Flexbox gap={4}>
              <Text strong>Les crédits top-up expirent-ils ?</Text>
              <Paragraph style={{ fontSize: 13, margin: 0 }} type="secondary">
                Non. Les crédits achetés en top-up restent sur votre compte jusqu&apos;à
                utilisation. Seuls les crédits inclus dans votre abonnement sont réinitialisés
                chaque mois.
              </Paragraph>
            </Flexbox>

            <Divider style={{ margin: '4px 0' }} />

            <Flexbox gap={4}>
              <Text strong>Pourquoi Claude est réservé au plan Pro ?</Text>
              <Paragraph style={{ fontSize: 13, margin: 0 }} type="secondary">
                Les modèles Claude d&apos;Anthropic ont un coût d&apos;API significativement plus
                élevé. Pour maintenir un service de qualité et des prix accessibles, l&apos;accès à
                Claude est réservé aux plans Pro et supérieurs.
              </Paragraph>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Card>
    </Flexbox>
  );
});

CreditsPage.displayName = 'CreditsPage';

export default CreditsPage;
