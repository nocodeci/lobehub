'use client';

import { Icon } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Button, Card, Progress, Tag, Typography } from 'antd';
import { cssVar } from 'antd-style';
import { Check, CreditCard, Crown, Zap } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

interface PlanFeature {
  included: boolean;
  label: string;
}

interface Plan {
  current?: boolean;
  features: PlanFeature[];
  icon: typeof Zap;
  monthlyPrice: number;
  name: string;
  popular?: boolean;
  yearlyPrice: number;
}

const PLANS: Plan[] = [
  {
    features: [
      { included: true, label: '5 agents' },
      { included: true, label: '100 messages/jour' },
      { included: true, label: '1 compte WhatsApp' },
      { included: false, label: 'Modèles premium' },
      { included: false, label: 'Support prioritaire' },
    ],
    icon: Zap,
    monthlyPrice: 0,
    name: 'Gratuit',
    yearlyPrice: 0,
  },
  {
    current: true,
    features: [
      { included: true, label: '20 agents' },
      { included: true, label: '1 000 messages/jour' },
      { included: true, label: '3 comptes WhatsApp' },
      { included: true, label: 'Modèles premium' },
      { included: false, label: 'Support prioritaire' },
    ],
    icon: Crown,
    monthlyPrice: 19,
    name: 'Base',
    yearlyPrice: 180,
  },
  {
    features: [
      { included: true, label: '50 agents' },
      { included: true, label: '5 000 messages/jour' },
      { included: true, label: '10 comptes WhatsApp' },
      { included: true, label: 'Modèles premium' },
      { included: true, label: 'Support prioritaire' },
    ],
    icon: Crown,
    monthlyPrice: 49,
    name: 'Premium',
    popular: true,
    yearlyPrice: 468,
  },
  {
    features: [
      { included: true, label: 'Agents illimités' },
      { included: true, label: 'Messages illimités' },
      { included: true, label: 'WhatsApp illimité' },
      { included: true, label: 'Modèles premium' },
      { included: true, label: 'Support prioritaire' },
    ],
    icon: Crown,
    monthlyPrice: 99,
    name: 'Ultimate',
    yearlyPrice: 948,
  },
];

const SubscriptionPage = memo(() => {
  const { t } = useTranslation('common');

  return (
    <Flexbox
      gap={32}
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '24px 16px',
        width: '100%',
      }}
    >
      {/* Current Plan Summary */}
      <Card
        style={{
          borderRadius: 12,
        }}
      >
        <Flexbox gap={16}>
          <Flexbox align="center" gap={12} horizontal justify="space-between">
            <Flexbox align="center" gap={8} horizontal>
              <Icon icon={Crown} size={20} style={{ color: cssVar.colorPrimary }} />
              <Title level={4} style={{ margin: 0 }}>
                Plan actuel : Base
              </Title>
              <Tag color="blue">Mensuel</Tag>
            </Flexbox>
            <Text style={{ fontSize: 24, fontWeight: 700 }}>
              19€<Text style={{ fontSize: 14, fontWeight: 400 }}>/mois</Text>
            </Text>
          </Flexbox>

          <Flexbox gap={12}>
            <Flexbox align="center" gap={8} horizontal justify="space-between">
              <Text>Messages utilisés ce mois</Text>
              <Text strong>342 / 1 000</Text>
            </Flexbox>
            <Progress percent={34} showInfo={false} strokeColor={cssVar.colorPrimary} />
          </Flexbox>

          <Flexbox align="center" gap={8} horizontal justify="space-between">
            <Text type="secondary">Prochain renouvellement : 11 mars 2026</Text>
            <Button danger size="small" type="text">
              Annuler l&apos;abonnement
            </Button>
          </Flexbox>
        </Flexbox>
      </Card>

      {/* Plans Grid */}
      <Flexbox gap={16}>
        <Title level={4} style={{ margin: 0 }}>
          Changer de plan
        </Title>
        <Flexbox gap={16} horizontal style={{ flexWrap: 'wrap' }}>
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              style={{
                border: plan.current
                  ? `2px solid ${cssVar.colorPrimary}`
                  : plan.popular
                    ? `2px solid ${cssVar.colorSuccess}`
                    : undefined,
                borderRadius: 12,
                flex: '1 1 200px',
                minWidth: 200,
                position: 'relative',
              }}
            >
              {plan.popular && (
                <Tag
                  color="success"
                  style={{
                    left: '50%',
                    position: 'absolute',
                    top: -12,
                    transform: 'translateX(-50%)',
                  }}
                >
                  Populaire
                </Tag>
              )}
              {plan.current && (
                <Tag
                  color="blue"
                  style={{
                    left: '50%',
                    position: 'absolute',
                    top: -12,
                    transform: 'translateX(-50%)',
                  }}
                >
                  Plan actuel
                </Tag>
              )}
              <Flexbox gap={16}>
                <Flexbox align="center" gap={8} horizontal>
                  <Icon icon={plan.icon} size={18} />
                  <Title level={5} style={{ margin: 0 }}>
                    {plan.name}
                  </Title>
                </Flexbox>

                <Flexbox>
                  <Text style={{ fontSize: 28, fontWeight: 700 }}>
                    {plan.monthlyPrice === 0 ? 'Gratuit' : `${plan.monthlyPrice}€`}
                  </Text>
                  {plan.monthlyPrice > 0 && (
                    <Text type="secondary">/mois</Text>
                  )}
                </Flexbox>

                <Flexbox gap={8}>
                  {plan.features.map((feature) => (
                    <Flexbox align="center" gap={6} horizontal key={feature.label}>
                      <Icon
                        icon={Check}
                        size={14}
                        style={{
                          color: feature.included
                            ? cssVar.colorSuccess
                            : cssVar.colorTextQuaternary,
                        }}
                      />
                      <Text
                        style={{
                          color: feature.included ? undefined : cssVar.colorTextQuaternary,
                          fontSize: 13,
                        }}
                      >
                        {feature.label}
                      </Text>
                    </Flexbox>
                  ))}
                </Flexbox>

                <Button
                  block
                  disabled={plan.current}
                  type={plan.popular ? 'primary' : 'default'}
                >
                  {plan.current ? 'Plan actuel' : plan.monthlyPrice === 0 ? 'Rétrograder' : 'Choisir'}
                </Button>
              </Flexbox>
            </Card>
          ))}
        </Flexbox>
      </Flexbox>

      {/* Billing History */}
      <Card style={{ borderRadius: 12 }}>
        <Flexbox gap={16}>
          <Flexbox align="center" gap={8} horizontal>
            <Icon icon={CreditCard} size={18} />
            <Title level={5} style={{ margin: 0 }}>
              Historique de facturation
            </Title>
          </Flexbox>
          <Flexbox gap={8}>
            {[
              { amount: '19,00€', date: '11 fév. 2026', status: 'Payé' },
              { amount: '19,00€', date: '11 jan. 2026', status: 'Payé' },
              { amount: '19,00€', date: '11 déc. 2025', status: 'Payé' },
            ].map((invoice) => (
              <Flexbox
                align="center"
                horizontal
                justify="space-between"
                key={invoice.date}
                style={{
                  borderBottom: `1px solid ${cssVar.colorBorderSecondary}`,
                  paddingBlock: 8,
                }}
              >
                <Text>{invoice.date}</Text>
                <Flexbox align="center" gap={12} horizontal>
                  <Text strong>{invoice.amount}</Text>
                  <Tag color="success">{invoice.status}</Tag>
                </Flexbox>
              </Flexbox>
            ))}
          </Flexbox>
        </Flexbox>
      </Card>
    </Flexbox>
  );
});

SubscriptionPage.displayName = 'SubscriptionPage';

export default SubscriptionPage;
