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

type PlanKey = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';
type PricingMode = 'standard' | 'byok';

interface PlanConfig {
  name: string;
  description: string;
  planKey: PlanKey;
  agents: number;
  credits: string;
  storage: string;
  features: string[];
  icon: typeof Zap;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  trialDays?: number;
  contactSales?: boolean;
  byokMonthlyPrice?: number;
  byokYearlyPrice?: number;
  byokDiscount?: number;
}

const PLANS: PlanConfig[] = [
  {
    name: 'Gratuit',
    description: 'Idéal pour tester la plateforme',
    planKey: 'free',
    agents: 1,
    credits: '250',
    storage: '500 MB',
    features: [
      '1 agent WhatsApp',
      '250 crédits/mois (~25 messages)',
      'Stockage 500 MB',
      'Branding "Powered by Connect"',
      'Support communauté',
    ],
    icon: Sparkle,
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  {
    name: 'Starter',
    description: 'Pour petites entreprises et freelances',
    planKey: 'starter',
    agents: 3,
    credits: '5,000,000',
    storage: '5 GB',
    features: [
      '3 agents WhatsApp',
      '5,000,000 crédits/mois',
      'Tous les modèles IA (GPT-4o, Claude, DeepSeek)',
      'Stockage 5 GB',
      'Support email',
      'Crédits supplémentaires : 15€/10M',
    ],
    icon: Zap,
    monthlyPrice: 29,
    yearlyPrice: 24.17,
    // BYOK not available - only from Pro plan and above
  },
  {
    name: 'Pro',
    description: 'Pour PME et agences en croissance',
    planKey: 'pro',
    agents: 10,
    credits: '40,000,000',
    storage: '20 GB',
    features: [
      '10 agents WhatsApp',
      '40M crédits (~56,000 messages)',
      'Tous les modèles IA (GPT-4o, Claude, DeepSeek)',
      'Stockage 20 GB',
      'Connecteurs CRM natifs',
      'Support prioritaire 24/7',
      'Crédits supplémentaires : 12€/10M',
    ],
    icon: Atom,
    monthlyPrice: 79,
    yearlyPrice: 65.83,
    popular: true,
    trialDays: 3,
    byokMonthlyPrice: 39,
    byokYearlyPrice: 32.5,
    byokDiscount: 51,
  },
  {
    name: 'Business',
    description: 'Pour grandes entreprises',
    planKey: 'business',
    agents: 50,
    credits: '150,000,000',
    storage: '100 GB',
    features: [
      '50 agents WhatsApp',
      '150M crédits',
      'Tous les modèles IA + priorité',
      'Stockage 100 GB',
      'Multi-utilisateurs (5 sièges inclus)',
      'SSO & Logs d\'audit',
      'Account Manager dédié',
      'Crédits supplémentaires : 10€/10M',
    ],
    icon: CreditCard,
    monthlyPrice: 199,
    yearlyPrice: 165.83,
    byokMonthlyPrice: 99,
    byokYearlyPrice: 82.5,
    byokDiscount: 50,
  },
  {
    name: 'Enterprise',
    description: 'Solution sur mesure pour corporations',
    planKey: 'enterprise',
    agents: -1,
    credits: 'Illimité',
    storage: 'Illimité',
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
    icon: Sparkle,
    monthlyPrice: 0,
    yearlyPrice: 0,
    contactSales: true,
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
  const [pricingMode, setPricingMode] = useState<PricingMode>('standard');
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
      // Handle free plan
      if (plan === 'free') {
        message.info('Le plan gratuit est automatiquement activé.');
        return;
      }
      
      // Handle enterprise plan
      if (plan === 'enterprise') {
        window.open('mailto:sales@connect.wozif.com?subject=Demande Enterprise', '_blank');
        return;
      }

      const cycle = overrideCycle || billingCycle;
      const loadingKey = `${plan}-${cycle}-${pricingMode}`;
      setCheckoutLoading(loadingKey);
      try {
        const res = await fetch('/api/subscription', {
          body: JSON.stringify({ billingCycle: cycle, customerId: stripeCustomerId, plan, mode: pricingMode }),
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
    [billingCycle, pricingMode, stripeCustomerId],
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
      const successPlan = params.get('plan');
      // Save plan to user settings immediately (fallback before webhook)
      if (successPlan && setSettings) {
        const currentGeneral = (userSettings as any)?.general || {};
        setSettings({
          general: {
            ...currentGeneral,
            subscriptionPlan: successPlan,
          },
        } as any);
      }
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

      {/* Pricing Mode Toggle - Only for Pro and above */}
      <Card style={{ borderRadius: 16, padding: '20px 24px' }}>
        <Flexbox gap={16}>
          <Flexbox gap={8}>
            <Title level={5} style={{ margin: 0 }}>Mode de tarification</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {pricingMode === 'byok' ? 
                'Option BYOK disponible à partir du plan Pro - Économisez jusqu\'à 51%' : 
                'Choisissez entre les crédits Connect ou utilisez vos propres clés API (BYOK disponible à partir du plan Pro)'}
            </Text>
          </Flexbox>
          <Flexbox align="center" gap={16} horizontal justify="space-between">
            <Flexbox gap={4}>
              <Text strong>Crédits Connect</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Utilisez nos crédits IA pré-payés</Text>
            </Flexbox>
            <Flexbox align="center" gap={12} horizontal>
              <Text style={{ fontWeight: pricingMode === 'standard' ? 600 : 400 }}>Crédits Connect</Text>
              <Switch
                checked={pricingMode === 'byok'}
                onChange={(checked) => setPricingMode(checked ? 'byok' : 'standard')}
              />
              <Flexbox align="center" gap={6} horizontal>
                <Text style={{ fontWeight: pricingMode === 'byok' ? 600 : 400 }}>BYOK</Text>
                <Tag color="success" style={{ margin: 0 }}>-50%</Tag>
                <Text type="secondary" style={{ fontSize: 11 }}>(Pro+)</Text>
              </Flexbox>
            </Flexbox>
          </Flexbox>
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
          <Tag color="success" style={{ margin: 0 }}>-17%</Tag>
        </Flexbox>
      </Flexbox>

      {/* Plans Grid */}
      <Flexbox gap={16} horizontal style={{ flexWrap: 'wrap' }}>
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.planKey && isActive;
          
          // Calculate price based on mode and cycle
          // BYOK only available for Pro, Business, Enterprise
          const byokAvailable = plan.planKey === 'pro' || plan.planKey === 'business' || plan.planKey === 'enterprise';
          let price;
          if (pricingMode === 'byok' && plan.byokMonthlyPrice && byokAvailable) {
            price = billingCycle === 'yearly' ? (plan.byokYearlyPrice || plan.byokMonthlyPrice) : plan.byokMonthlyPrice;
          } else {
            price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          }
          
          const loadingKey = `${plan.planKey}-${billingCycle}-${pricingMode}`;
          const isFree = plan.planKey === 'free';
          const isEnterprise = plan.contactSales;
          const showByokBadge = pricingMode === 'byok' && plan.byokDiscount && !isFree && byokAvailable;

          return (
            <Card
              key={plan.planKey}
              style={{
                border: isCurrent
                  ? `2px solid ${cssVar.colorPrimary}`
                  : plan.popular
                    ? '2px solid #ff7a00'
                    : undefined,
                borderRadius: 16,
                flex: '1 1 280px',
                minWidth: 280,
                position: 'relative',
              }}
            >
              {plan.popular && !isCurrent && !showByokBadge && (
                <Tag
                  color="default"
                  style={{
                    background: 'linear-gradient(135deg, #ff7a00, #ff5500)',
                    border: 'none',
                    borderRadius: 20,
                    boxShadow: '0 2px 8px rgba(255, 85, 0, 0.4)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    left: '50%',
                    letterSpacing: 0.5,
                    padding: '4px 16px',
                    position: 'absolute',
                    top: -14,
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                  }}
                >
                  ⭐ Populaire
                </Tag>
              )}
              {showByokBadge && !isCurrent && (
                <Tag
                  color="success"
                  style={{
                    left: '50%',
                    position: 'absolute',
                    top: -12,
                    transform: 'translateX(-50%)',
                  }}
                >
                  Économisez {plan.byokDiscount}%
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
                  {isEnterprise ? (
                    <Text style={{ fontSize: 24, fontWeight: 700 }}>Sur devis</Text>
                  ) : (
                    <>
                      <Text style={{ fontSize: 32, fontWeight: 800 }}>
                        {isFree ? 'Gratuit' : `${Math.round(price)}€`}
                      </Text>
                      {!isFree && <Text type="secondary">/mois</Text>}
                      {billingCycle === 'yearly' && !isFree && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Facturé {Math.round(price * 12)}€/an
                        </Text>
                      )}
                    </>
                  )}
                </Flexbox>

                <Flexbox gap={4}>
                  <Text strong style={{ fontSize: 13 }}>
                    {plan.agents === -1 ? 'Agents illimités' : `${plan.agents} agent${plan.agents > 1 ? 's' : ''} WhatsApp`}
                  </Text>
                  {!isEnterprise && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {pricingMode === 'byok' && byokAvailable ? 'Crédits illimités (vos clés API)' : `${plan.credits} crédits/mois`}
                    </Text>
                  )}
                </Flexbox>

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
                  disabled={isCurrent || (isFree && !isActive)}
                  loading={checkoutLoading === loadingKey}
                  onClick={() => handleCheckout(plan.planKey)}
                  style={
                    plan.popular && !isCurrent
                      ? { '--ant-color-primary-text': '#fff', background: 'linear-gradient(135deg, #ff7a00, #ff5500)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, height: 48 } as React.CSSProperties
                      : { fontWeight: 600, height: 44 }
                  }
                  type={plan.popular ? 'primary' : 'default'}
                >
                  {isCurrent 
                    ? 'Plan actuel' 
                    : isEnterprise 
                    ? 'Contacter les ventes' 
                    : isFree 
                    ? 'Plan actif' 
                    : plan.trialDays 
                    ? `Essayer ${plan.trialDays} jours gratuit` 
                    : 'Commencer'}
                </Button>
              </Flexbox>
            </Card>
          );
        })}
      </Flexbox>

      {/* Detailed Comparison Table */}
      <Card style={{ borderRadius: 16, overflow: 'auto' }}>
        <Flexbox gap={16}>
          <Title level={4} style={{ margin: 0 }}>
            Comparaison détaillée des plans
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Retrouvez toutes les fonctionnalités incluses dans chaque plan Connect.
          </Text>
        </Flexbox>

        <div style={{ overflowX: 'auto', marginTop: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${cssVar.colorBorderSecondary}` }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, fontSize: 14, width: '30%' }}>Fonctionnalité</th>
                {PLANS.map((p) => (
                  <th key={p.planKey} style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    fontWeight: 700,
                    fontSize: 14,
                    color: p.planKey === currentPlan && isActive ? cssVar.colorPrimary : undefined,
                  }}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category: General */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Général
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                <td style={{ padding: '10px 16px' }}>Agents IA</td>
                {PLANS.map((p) => (
                  <td key={p.planKey} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 500 }}>
                    {p.agents === -1 ? 'Illimités' : p.agents}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                <td style={{ padding: '10px 16px' }}>Crédits / mois</td>
                {PLANS.map((p) => (
                  <td key={p.planKey} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 500 }}>
                    {p.credits}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                <td style={{ padding: '10px 16px' }}>Stockage</td>
                {PLANS.map((p) => (
                  <td key={p.planKey} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 500 }}>
                    {p.storage}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                <td style={{ padding: '10px 16px' }}>Comptes WhatsApp</td>
                {(['1', '2', '5', '20', 'Illimités']).map((val, i) => (
                  <td key={i} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 500 }}>
                    {val}
                  </td>
                ))}
              </tr>

              {/* Category: AI Models */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Modèles IA
                </td>
              </tr>
              {[
                { label: 'GPT-4o / GPT-4o-mini', plans: [true, true, true, true, true] },
                { label: 'Claude 3.5 Sonnet / Haiku', plans: [true, true, true, true, true] },
                { label: 'DeepSeek V3 / R1', plans: [true, true, true, true, true] },
                { label: 'Gemini 2.0 Flash', plans: [true, true, true, true, true] },
                { label: 'Priorité d\'accès aux modèles', plans: [false, false, false, true, true] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.plans.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: WhatsApp Features */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  WhatsApp & Messagerie
                </td>
              </tr>
              {[
                { label: 'Connexion WhatsApp (QR Code)', plans: [true, true, true, true, true] },
                { label: 'Réponses automatiques', plans: [true, true, true, true, true] },
                { label: 'Messages programmés', plans: [false, true, true, true, true] },
                { label: 'Groupes WhatsApp', plans: [false, false, false, true, true] },
                { label: 'Diffusion en masse', plans: [false, false, true, true, true] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.plans.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: Agent Features */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Agents & Automatisation
                </td>
              </tr>
              {[
                { label: 'Prompt système personnalisé', plans: [true, true, true, true, true] },
                { label: 'Base de connaissances (RAG)', plans: [false, true, true, true, true] },
                { label: 'Outils & Compétences (MCP)', plans: [false, true, true, true, true] },
                { label: 'Groupes d\'agents (Teams)', plans: [false, false, false, true, true] },
                { label: 'Workflows automatisés', plans: [false, false, true, true, true] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.plans.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: Integrations */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Intégrations
                </td>
              </tr>
              {[
                { label: 'Google Calendar', plans: [false, true, true, true, true] },
                { label: 'Gmail', plans: [false, true, true, true, true] },
                { label: 'Connecteurs CRM natifs', plans: [false, false, true, true, true] },
                { label: 'Webhooks', plans: [false, false, true, true, true] },
                { label: 'API REST', plans: [false, false, true, true, true] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.plans.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: Security & Admin */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Sécurité & Administration
                </td>
              </tr>
              {[
                { label: 'BYOK (Bring Your Own Key)', plans: [false, false, true, true, true] },
                { label: 'SSO (Google, etc.)', plans: [false, false, false, true, true] },
                { label: 'Logs d\'audit', plans: [false, false, false, true, true] },
                { label: 'Multi-utilisateurs', plans: [false, false, false, true, true] },
                { label: 'Infrastructure dédiée', plans: [false, false, false, false, true] },
                { label: 'SLA 99.9%', plans: [false, false, false, false, true] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.plans.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: Support */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Support
                </td>
              </tr>
              {[
                { label: 'Support communauté', values: ['✓', '✓', '✓', '✓', '✓'] },
                { label: 'Support email', values: ['—', '✓', '✓', '✓', '✓'] },
                { label: 'Support prioritaire 24/7', values: ['—', '—', '✓', '✓', '✓'] },
                { label: 'Account Manager dédié', values: ['—', '—', '—', '✓', '✓'] },
                { label: 'Onboarding personnalisé', values: ['—', '—', '—', '—', '✓'] },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                  <td style={{ padding: '10px 16px' }}>{row.label}</td>
                  {row.values.map((val, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {val === '✓' ? (
                        <Icon icon={Check} size={16} style={{ color: cssVar.colorSuccess }} />
                      ) : (
                        <span style={{ color: cssVar.colorTextQuaternary }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Category: Pricing extras */}
              <tr style={{ background: cssVar.colorFillQuaternary }}>
                <td colSpan={PLANS.length + 1} style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: cssVar.colorPrimary }}>
                  Crédits supplémentaires
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}>
                <td style={{ padding: '10px 16px' }}>Prix / 10M crédits</td>
                {['—', '15€', '12€', '10€', 'Sur devis'].map((val, i) => (
                  <td key={i} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: val === '—' ? cssVar.colorTextQuaternary : undefined }}>
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

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
