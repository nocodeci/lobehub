'use client';

import { FormGroup } from '@lobehub/ui';
import { Badge, Button, Card, Col, Divider, Row, Segmented, Tag, Typography, message } from 'antd';
import {
  Bot,
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Database,
  Key,
  MessageSquare,
  Rocket,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import SettingHeader from '@/app/[variants]/(main)/settings/features/SettingHeader';

const { Text, Title } = Typography;

type BillingCycle = 'monthly' | 'yearly';

interface PlanConfig {
  agents: string;
  color: string;
  credits: string;
  cta: string;
  description: string;
  features: string[];
  icon: any;
  key: string;
  monthlyPrice: number;
  name: string;
  popular?: boolean;
  storage: string;
  yearlyPrice: number;
}

const PLANS_CONFIG: PlanConfig[] = [
  {
    agents: '1',
    color: '#8c8c8c',
    credits: '250',
    cta: 'Plan actuel',
    description: 'Idéal pour tester la plateforme',
    features: [
      '1 agent WhatsApp',
      '250 crédits/mois',
      'Stockage 500 MB',
      'Support communauté',
    ],
    icon: Zap,
    key: 'free',
    monthlyPrice: 0,
    name: 'Gratuit',
    storage: '500 MB',
    yearlyPrice: 0,
  },
  {
    agents: '3',
    color: '#1677ff',
    credits: '5,000,000',
    cta: 'Commencer',
    description: 'Pour petites entreprises et freelances',
    features: [
      '3 agents WhatsApp',
      '5M crédits/mois',
      'Tous les modèles IA',
      'Stockage 5 GB',
      'Support email',
      'Crédits supplémentaires : 15€/10M',
    ],
    icon: Rocket,
    key: 'starter',
    monthlyPrice: 29,
    name: 'Starter',
    storage: '5 GB',
    yearlyPrice: 290,
  },
  {
    agents: '10',
    color: '#722ed1',
    credits: '40,000,000',
    cta: 'Essai gratuit 7 jours',
    description: 'Pour PME et agences en croissance',
    features: [
      '10 agents WhatsApp',
      '40M crédits/mois',
      'Tous les modèles IA + Claude',
      'Stockage 20 GB',
      'BYOK (vos propres clés API)',
      'Connecteurs CRM natifs',
      'Support prioritaire 24/7',
      'Crédits supplémentaires : 12€/10M',
    ],
    icon: Crown,
    key: 'pro',
    monthlyPrice: 79,
    name: 'Pro',
    popular: true,
    storage: '20 GB',
    yearlyPrice: 790,
  },
  {
    agents: '50',
    color: '#fa8c16',
    credits: '150,000,000',
    cta: 'Contacter les ventes',
    description: 'Pour grandes entreprises',
    features: [
      '50 agents WhatsApp',
      '150M crédits/mois',
      'Tous les modèles IA + priorité',
      'Stockage 100 GB',
      'Multi-utilisateurs (5 sièges)',
      'SSO & Logs d\'audit',
      'Account Manager dédié',
      'Crédits supplémentaires : 10€/10M',
    ],
    icon: Shield,
    key: 'business',
    monthlyPrice: 199,
    name: 'Business',
    storage: '100 GB',
    yearlyPrice: 1990,
  },
  {
    agents: 'Illimité',
    color: '#eb2f96',
    credits: 'Illimité',
    cta: 'Contacter les ventes',
    description: 'Solution sur mesure',
    features: [
      'Agents WhatsApp illimités',
      'Crédits personnalisés',
      'Infrastructure dédiée',
      'Stockage illimité',
      'Multi-utilisateurs illimités',
      'SLA 99.9%',
      'Onboarding personnalisé',
      'Support dédié 24/7',
    ],
    icon: Star,
    key: 'enterprise',
    monthlyPrice: 0,
    name: 'Enterprise',
    storage: 'Illimité',
    yearlyPrice: 0,
  },
];

const Plans = memo<{ mobile?: boolean }>(() => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = useCallback(
    async (planKey: string) => {
      if (planKey === 'free') return;
      if (planKey === 'enterprise') {
        window.open('mailto:contact@wozif.com?subject=Connect Enterprise', '_blank');
        return;
      }

      setLoading(planKey);
      try {
        const res = await fetch('/api/subscription', {
          body: JSON.stringify({ billingCycle, plan: planKey }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          message.error(data.error || 'Erreur lors de la création de la session de paiement.');
        }
      } catch {
        message.error('Erreur réseau. Veuillez réessayer.');
      } finally {
        setLoading(null);
      }
    },
    [billingCycle],
  );

  return (
    <>
      <SettingHeader title="Plans d'abonnement" />
      <FormGroup
        collapsible={false}
        extra={
          <Segmented
            onChange={(v) => setBillingCycle(v as BillingCycle)}
            options={[
              { label: 'Mensuel', value: 'monthly' },
              { label: 'Annuel (-17%)', value: 'yearly' },
            ]}
            value={billingCycle}
          />
        }
        gap={16}
        title="Choisissez votre plan"
        variant={'filled'}
      >
        <Row gutter={[16, 16]}>
          {PLANS_CONFIG.map((plan) => {
            const Icon = plan.icon;
            const price =
              billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
            const isEnterprise = plan.key === 'enterprise';
            const isFree = plan.key === 'free';

            const card = (
              <Card
                hoverable
                key={plan.key}
                style={{
                  border: plan.popular ? `2px solid ${plan.color}` : undefined,
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <div
                      style={{
                        alignItems: 'center',
                        background: `${plan.color}15`,
                        borderRadius: 8,
                        display: 'flex',
                        height: 40,
                        justifyContent: 'center',
                        width: 40,
                      }}
                    >
                      <Icon color={plan.color} size={20} />
                    </div>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {plan.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {plan.description}
                      </Text>
                    </div>
                  </div>

                  <div>
                    {isEnterprise ? (
                      <Title level={3} style={{ margin: 0 }}>
                        Sur devis
                      </Title>
                    ) : isFree ? (
                      <Title level={3} style={{ margin: 0 }}>
                        Gratuit
                      </Title>
                    ) : (
                      <div style={{ alignItems: 'baseline', display: 'flex', gap: 4 }}>
                        <Title level={3} style={{ margin: 0 }}>
                          {price}€
                        </Title>
                        <Text type="secondary">/mois</Text>
                      </div>
                    )}
                    {billingCycle === 'yearly' && !isFree && !isEnterprise && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Facturé {plan.yearlyPrice}€/an
                      </Text>
                    )}
                  </div>

                  <Divider style={{ margin: 0 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                      <Bot size={14} />
                      <Text style={{ fontSize: 13 }}>
                        <strong>{plan.agents}</strong> agents
                      </Text>
                    </div>
                    <div style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                      <MessageSquare size={14} />
                      <Text style={{ fontSize: 13 }}>
                        <strong>{plan.credits}</strong> crédits/mois
                      </Text>
                    </div>
                    <div style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                      <Database size={14} />
                      <Text style={{ fontSize: 13 }}>
                        <strong>{plan.storage}</strong> stockage
                      </Text>
                    </div>
                  </div>

                  <Divider style={{ margin: 0 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        style={{ alignItems: 'flex-start', display: 'flex', gap: 8 }}
                      >
                        <Check color={plan.color} size={14} style={{ flexShrink: 0, marginTop: 3 }} />
                        <Text style={{ fontSize: 13 }}>{feature}</Text>
                      </div>
                    ))}
                  </div>

                  <Button
                    block
                    disabled={isFree}
                    icon={isEnterprise ? <ChevronRight size={16} /> : <CreditCard size={16} />}
                    loading={loading === plan.key}
                    onClick={() => handleSubscribe(plan.key)}
                    type={plan.popular ? 'primary' : 'default'}
                    style={{
                      background: plan.popular ? plan.color : undefined,
                      borderColor: plan.popular ? plan.color : undefined,
                      marginTop: 'auto',
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            );

            return (
              <Col key={plan.key} lg={plan.popular ? 6 : 5} md={8} sm={12} xs={24}>
                {plan.popular ? (
                  <Badge.Ribbon color={plan.color} text="Populaire">
                    {card}
                  </Badge.Ribbon>
                ) : (
                  card
                )}
              </Col>
            );
          })}
        </Row>
      </FormGroup>

      <FormGroup collapsible={false} gap={16} title="Comparaison des fonctionnalités" variant={'filled'}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Fonctionnalité</th>
                {PLANS_CONFIG.map((p) => (
                  <th key={p.key} style={{ padding: '8px 12px', textAlign: 'center' }}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Agents WhatsApp', values: ['1', '3', '10', '50', '∞'] },
                { feature: 'Crédits/mois', values: ['250', '5M', '40M', '150M', '∞'] },
                { feature: 'Stockage', values: ['500 MB', '5 GB', '20 GB', '100 GB', '∞'] },
                { feature: 'BYOK (clés API)', values: ['—', '—', '✓', '✓', '✓'] },
                { feature: 'Claude (Anthropic)', values: ['—', '✓', '✓', '✓', '✓'] },
                { feature: 'Multi-utilisateurs', values: ['—', '—', '—', '5 sièges', '∞'] },
                { feature: 'Équipe', values: ['—', '2', '5', '20', '∞'] },
                { feature: 'Support', values: ['Forum', 'Email', '24/7', 'Dédié', 'Dédié'] },
              ].map((row) => (
                <tr key={row.feature} style={{ borderTop: '1px solid var(--ant-color-border)' }}>
                  <td style={{ fontWeight: 500, padding: '8px 12px' }}>{row.feature}</td>
                  {row.values.map((val, i) => (
                    <td key={i} style={{ padding: '8px 12px', textAlign: 'center' }}>
                      {val === '✓' ? (
                        <Tag color="green">✓</Tag>
                      ) : val === '—' ? (
                        <Text type="secondary">—</Text>
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormGroup>
    </>
  );
});

export default Plans;
