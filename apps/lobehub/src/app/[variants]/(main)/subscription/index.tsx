'use client';

import { Icon } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Button, Card, Divider, Spin, Switch, Tag, Typography, message } from 'antd';
import { cssVar } from 'antd-style';
import { Atom, Check, CreditCard, ExternalLink, Sparkle, Zap } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';

const { Title, Text } = Typography;

type PlanKey = 'base' | 'premium' | 'ultimate';
type BillingCycle = 'monthly' | 'yearly';

interface PlanConfig {
  credits: string;
  description: string;
  features: string[];
  icon: typeof Zap;
  monthlyPrice: number;
  name: string;
  planKey: PlanKey;
  popular?: boolean;
  trialDays?: number;
  yearlyPrice: number;
}

const PLANS: PlanConfig[] = [
  {
    credits: '10,000,000',
    description: 'Pour une utilisation légère et occasionnelle',
    features: [
      'GPT-4o mini (~14,000 messages)',
      'DeepSeek R1 (~3,800 messages)',
      'Claude 3.5 Sonnet (~600 messages)',
      'Stockage fichiers 2 GB',
      'Stockage vecteurs 10,000 entrées',
      'Recherche web',
      'Support e-mail prioritaire',
    ],
    icon: Sparkle,
    monthlyPrice: 19,
    name: 'Version de base',
    planKey: 'base',
    yearlyPrice: 15,
  },
  {
    credits: '40,000,000',
    description: 'Essai gratuit de 3 jours, puis facturation mensuelle ou annuelle.',
    features: [
      'GPT-4o mini (~56,000 messages)',
      'DeepSeek R1 (~15,000 messages)',
      'Claude 3.5 Sonnet (~2,400 messages)',
      'Stockage fichiers 10 GB',
      'OCR & Analyse de documents',
      'Jusqu\'à 10 agents simultanés',
      'Connecteurs CRM Natifs',
      'Support Chat & Email 24/7',
    ],
    icon: Zap,
    monthlyPrice: 50,
    name: 'Premium Pro',
    planKey: 'premium',
    popular: true,
    trialDays: 3,
    yearlyPrice: 39,
  },
  {
    credits: '100,000,000',
    description: 'Pour les entreprises sans limites',
    features: [
      'Accès prioritaire GPT-4o',
      'Claude 3.5 Opus inclus',
      'Génération d\'images (DALL-E 3)',
      'Stockage fichiers 50 GB',
      'Agents WhatsApp illimités',
      'Multi-utilisateurs & Rôles (RBAC)',
      'SSO & Logs d\'audit',
      'Account Manager dédié',
      'SLA 99.9%',
    ],
    icon: Atom,
    monthlyPrice: 120,
    name: 'Utilisation intensive',
    planKey: 'ultimate',
    yearlyPrice: 99,
  },
];

interface SubscriptionData {
  billingCycle: BillingCycle;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: number;
  currentPeriodStart: number;
  id: string;
}

interface SubscriptionStatus {
  currentPlan: PlanKey | null;
  status: string;
  subscription: SubscriptionData | null;
}

const SubscriptionPage = memo(() => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const userSettings = useUserStore(settingsSelectors.currentSettings);
  const setSettings = useUserStore((s) => s.setSettings);
  const stripeCustomerId = (userSettings as any)?.subscription?.stripeCustomerId as
    | string
    | undefined;

  // Fetch subscription status
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const params = stripeCustomerId ? `?customerId=${stripeCustomerId}` : '';
      const res = await fetch(`/api/subscription${params}`);
      const data = await res.json();
      setSubStatus(data);
    } catch {
      setSubStatus({ currentPlan: null, status: 'none', subscription: null });
    } finally {
      setLoading(false);
    }
  }, [stripeCustomerId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Start checkout
  const handleCheckout = useCallback(
    async (plan: PlanKey, overrideCycle?: BillingCycle) => {
      const cycle = overrideCycle || billingCycle;
      const loadingKey = `${plan}-${cycle}`;
      setCheckoutLoading(loadingKey);
      try {
        const res = await fetch('/api/subscription', {
          body: JSON.stringify({ billingCycle: cycle, customerId: stripeCustomerId, plan }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.url) window.location.href = data.url;
      } catch (error: any) {
        message.error(error.message || 'Erreur lors du paiement.');
      } finally {
        setCheckoutLoading(null);
      }
    },
    [billingCycle, stripeCustomerId],
  );

  // Handle URL params: checkout result OR redirect from landing page
  const [autoCheckoutDone, setAutoCheckoutDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    const sessionId = params.get('session_id');
    const planParam = params.get('plan') as PlanKey | null;
    const cycleParam = params.get('cycle') as BillingCycle | null;

    if (checkout === 'success' && sessionId) {
      message.success('Abonnement activé avec succès !');
      window.history.replaceState({}, '', '/subscription');
      fetchStatus();
    } else if (checkout === 'cancelled') {
      message.info('Paiement annulé.');
      window.history.replaceState({}, '', '/subscription');
    } else if (planParam && PLANS.some((p) => p.planKey === planParam) && !autoCheckoutDone) {
      // Redirect from landing page — set billing cycle and auto-trigger checkout
      const cycle = (cycleParam && ['monthly', 'yearly'].includes(cycleParam)) ? cycleParam : 'monthly';
      setBillingCycle(cycle);
      setAutoCheckoutDone(true);
      window.history.replaceState({}, '', '/subscription');
      // Trigger checkout with the cycle from the URL
      setTimeout(() => {
        handleCheckout(planParam, cycle);
      }, 500);
    }
  }, [fetchStatus, autoCheckoutDone, handleCheckout]);

  // Open Stripe portal
  const handlePortal = useCallback(async () => {
    if (!stripeCustomerId) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/subscription/portal', {
        body: JSON.stringify({ customerId: stripeCustomerId }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de l\'ouverture du portail.');
    } finally {
      setPortalLoading(false);
    }
  }, [stripeCustomerId]);

  const currentPlan = subStatus?.currentPlan;
  const isActive = subStatus?.status === 'active';
  const currentPlanConfig = useMemo(
    () => PLANS.find((p) => p.planKey === currentPlan),
    [currentPlan],
  );

  const renewalDate = useMemo(() => {
    if (!subStatus?.subscription?.currentPeriodEnd) return null;
    return new Date(subStatus.subscription.currentPeriodEnd * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [subStatus]);

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Flexbox>
    );
  }

  return (
    <Flexbox
      gap={32}
      style={{
        margin: '0 auto',
        maxWidth: 960,
        overflow: 'auto',
        padding: '24px 16px',
        width: '100%',
      }}
    >
      {/* Current Plan Summary */}
      <Card style={{ borderRadius: 12 }}>
        <Flexbox gap={16}>
          <Flexbox align="center" gap={12} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
            <Flexbox align="center" gap={8} horizontal>
              <Icon
                icon={currentPlanConfig?.icon || Sparkle}
                size={20}
                style={{ color: cssVar.colorPrimary }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {isActive && currentPlanConfig
                  ? `Plan actuel : ${currentPlanConfig.name}`
                  : 'Aucun abonnement actif'}
              </Title>
              {isActive && subStatus?.subscription?.billingCycle && (
                <Tag color="blue">
                  {subStatus.subscription.billingCycle === 'yearly' ? 'Annuel' : 'Mensuel'}
                </Tag>
              )}
              {subStatus?.subscription?.cancelAtPeriodEnd && (
                <Tag color="warning">Annulation prévue</Tag>
              )}
            </Flexbox>
            {isActive && currentPlanConfig && (
              <Text style={{ fontSize: 24, fontWeight: 700 }}>
                ${billingCycle === 'yearly' ? currentPlanConfig.yearlyPrice : currentPlanConfig.monthlyPrice}
                <Text style={{ fontSize: 14, fontWeight: 400 }}>/mois</Text>
              </Text>
            )}
          </Flexbox>

          {isActive && currentPlanConfig && (
            <>
              <Flexbox gap={4}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {currentPlanConfig.credits} crédits / mois
                </Text>
              </Flexbox>

              <Flexbox align="center" gap={8} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
                {renewalDate && (
                  <Text type="secondary">
                    {subStatus?.subscription?.cancelAtPeriodEnd
                      ? `Expire le ${renewalDate}`
                      : `Prochain renouvellement : ${renewalDate}`}
                  </Text>
                )}
                {stripeCustomerId && (
                  <Button
                    icon={<Icon icon={ExternalLink} size={14} />}
                    loading={portalLoading}
                    onClick={handlePortal}
                    size="small"
                    type="text"
                  >
                    Gérer l&apos;abonnement
                  </Button>
                )}
              </Flexbox>
            </>
          )}

          {!isActive && (
            <Text type="secondary">
              Choisissez un plan ci-dessous pour commencer.
            </Text>
          )}
        </Flexbox>
      </Card>

      {/* Billing Cycle Toggle */}
      <Flexbox align="center" gap={16} horizontal justify="center">
        <Text style={{ fontWeight: billingCycle === 'monthly' ? 600 : 400 }}>Mensuel</Text>
        <Switch
          checked={billingCycle === 'yearly'}
          onChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <Flexbox align="center" gap={6} horizontal>
          <Text style={{ fontWeight: billingCycle === 'yearly' ? 600 : 400 }}>Annuel</Text>
          <Tag
            color="success"
            style={{
              background: 'rgba(82, 196, 26, 0.1)',
              border: 'none',
              color: '#52c41a',
              margin: 0,
            }}
          >
            -23%
          </Tag>
        </Flexbox>
      </Flexbox>

      {/* Plans Grid */}
      <Flexbox gap={16} horizontal style={{ flexWrap: 'wrap' }}>
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.planKey && isActive;
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const loadingKey = `${plan.planKey}-${billingCycle}`;

          return (
            <Card
              key={plan.planKey}
              style={{
                border: isCurrent
                  ? `2px solid ${cssVar.colorPrimary}`
                  : plan.popular
                    ? '2px solid #075e54'
                    : undefined,
                borderRadius: 16,
                flex: '1 1 280px',
                minWidth: 280,
                position: 'relative',
              }}
            >
              {plan.popular && !isCurrent && (
                <Tag
                  color="default"
                  style={{
                    background: '#075e54',
                    border: 'none',
                    color: '#fff',
                    left: '50%',
                    position: 'absolute',
                    top: -12,
                    transform: 'translateX(-50%)',
                  }}
                >
                  Populaire
                </Tag>
              )}
              {isCurrent && (
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
                  {plan.trialDays && !isCurrent && (
                    <Tag color="processing" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700, margin: 0 }}>
                      {plan.trialDays} jours d&apos;essai gratuit
                    </Tag>
                  )}
                </Flexbox>

                <Text type="secondary" style={{ fontSize: 13 }}>
                  {plan.description}
                </Text>

                <Flexbox>
                  <Text style={{ fontSize: 32, fontWeight: 800 }}>
                    ${price}
                  </Text>
                  <Text type="secondary">/mois</Text>
                  {billingCycle === 'yearly' && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Facturé ${plan.planKey === 'base' ? '180' : plan.planKey === 'premium' ? '468' : '1,188'}/an
                    </Text>
                  )}
                </Flexbox>

                <Text strong style={{ fontSize: 13 }}>
                  {plan.credits} crédits / mois
                </Text>

                <Divider dashed style={{ margin: '4px 0' }} />

                <Flexbox gap={8}>
                  {plan.features.map((feature) => (
                    <Flexbox align="center" gap={6} horizontal key={feature}>
                      <Icon icon={Check} size={14} style={{ color: cssVar.colorSuccess }} />
                      <Text style={{ fontSize: 13 }}>{feature}</Text>
                    </Flexbox>
                  ))}
                </Flexbox>

                <Button
                  block
                  disabled={isCurrent}
                  loading={checkoutLoading === loadingKey}
                  onClick={() => handleCheckout(plan.planKey)}
                  style={
                    plan.popular && !isCurrent
                      ? { '--ant-color-primary-text': '#fff', background: '#075e54', border: 'none', color: '#fff', fontWeight: 700, height: 44 } as React.CSSProperties
                      : { fontWeight: 600, height: 44 }
                  }
                  type={plan.popular ? 'primary' : 'default'}
                >
                  {isCurrent ? 'Plan actuel' : plan.trialDays ? `Essayer ${plan.trialDays} jours gratuit` : 'Commencer'}
                </Button>
              </Flexbox>
            </Card>
          );
        })}
      </Flexbox>

      {/* Manage Billing */}
      {stripeCustomerId && (
        <Card style={{ borderRadius: 12 }}>
          <Flexbox align="center" gap={16} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
            <Flexbox gap={4}>
              <Flexbox align="center" gap={8} horizontal>
                <Icon icon={CreditCard} size={18} />
                <Title level={5} style={{ margin: 0 }}>
                  Facturation
                </Title>
              </Flexbox>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Gérez vos moyens de paiement, factures et abonnement via le portail Stripe.
              </Text>
            </Flexbox>
            <Button
              icon={<Icon icon={ExternalLink} size={14} />}
              loading={portalLoading}
              onClick={handlePortal}
              type="primary"
            >
              Ouvrir le portail de facturation
            </Button>
          </Flexbox>
        </Card>
      )}
    </Flexbox>
  );
});

SubscriptionPage.displayName = 'SubscriptionPage';

export default SubscriptionPage;
