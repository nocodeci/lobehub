'use client';

import {
    Flexbox,
    Button,
} from '@lobehub/ui';
import { Typography, Switch, Tag, Table as AntTable, Divider, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import {
    Zap,
    Sparkle,
    Atom,
    Gift,
    Check,
    CircleHelp,
    ChevronDown,
    CreditCard,
} from 'lucide-react';
import {
    OpenAI,
    Anthropic,
    Google,
    DeepSeek,
    Groq,
    Mistral,
    Meta,
} from '@lobehub/icons';
import React, { useState, useEffect } from 'react';
import { useStripeCheckout } from '@/lib/useStripeCheckout';

const { Title, Text } = Typography;

const useStyles = createStyles(({ css, token }: { css: any; token: any }) => ({
    main: css`
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #000;
  `,
    container: css`
    width: 100%;
    max-width: 1200px;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  `,
    heroWrapper: css`
    padding: 120px 0 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: visible;
  `,
    heroGlow1: css`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(circle, rgba(7, 94, 84, 0.05) 0%, transparent 70%);
    z-index: 0;
  `,
    heroTitle: css`
    font-size: 56px;
    font-weight: 900;
    letter-spacing: -2px;
    margin-bottom: 16px;
    z-index: 1;
  `,
    heroSubtitle: css`
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 1.6;
    max-width: 800px;
    margin-bottom: 32px;
    z-index: 1;
  `,
    // segmentedWrapper removed — replaced by Switch toggle
    pricingGrid: css`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    margin-bottom: 48px;
    align-items: start;
    & > div {
      flex: 1 1 240px;
      min-width: 240px;
    }
    @media (max-width: 768px) {
      & > div {
        flex: 1 1 100%;
      }
    }
  `,
    byokCard: css`
    width: 100%;
    background: #f8f9fa;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1px solid rgba(0,0,0,0.04);
    margin-bottom: 24px;
  `,
    card: css`
    background: #f8f9fa;
    border-radius: 24px;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid rgba(0,0,0,0.04);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    &:hover {
      border-color: rgba(7, 94, 84, 0.1);
      background: #fff;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }
  `,
    featuredCard: css`
    background: #fff;
    border: 2px solid #000;
    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    position: relative;
    transform: scale(1.02);
    z-index: 2;
    @media (max-width: 1024px) {
        transform: scale(1);
    }
  `,
    planIcon: css`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #c57948, #803718);
    color: #ffc385;
    border: 2px solid #ffc385;
    margin-bottom: 8px;
  `,
    priceValue: css`
    font-size: 40px;
    font-weight: 900;
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: #000;
    &::before { content: '€'; font-size: 0.6em; }
  `,
    sectionTitle: css`
        font-size: 13px;
        font-weight: 700;
        color: #000;
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
    `,
    featureList: css`
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,
    featureItem: css`
        display: flex;
        align-items: flex-start;
        gap: 12px;
    `,
    checkIcon: css`
        flex-shrink: 0;
        margin-top: 2px;
        color: #52c41a;
        fill: #52c41a;
        stroke: #fff;
    `,
    modelInfo: css`
        display: flex;
        flex-direction: column;
        line-height: 1.4;
        .name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px; color: #000; }
        .desc { font-size: 12px; opacity: 0.6; color: #000; }
    `,
    viewMore: css`
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 12px;
        margin-top: 16px;
        font-size: 14px;
        font-weight: 700;
        color: rgba(0,0,0,0.4);
        cursor: pointer;
        transition: color 0.2s;
        &:hover { color: #075e54; }
    `,
    enterpriseBar: css`
    width: 100%;
    padding: 32px;
    background: #fdfdfd;
    border-radius: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin: 40px 0 80px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  `,
    tableSection: css`
    width: 100%;
    padding-bottom: 80px;
  `,
}));

const PricingPage = () => {
    const { styles, cx } = useStyles();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [pricingMode, setPricingMode] = useState<'standard' | 'byok'>('standard');
    const [mounted, setMounted] = useState(false);
    const { checkout, isLoading } = useStripeCheckout();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const FeatureSection = ({ title, showHelp = false, children }: { title: string, showHelp?: boolean, children: React.ReactNode }) => (
        <div style={{ marginBottom: 8 }}>
            <div className={styles.sectionTitle}>
                {title} {showHelp && <CircleHelp size={14} style={{ opacity: 0.5 }} />}
            </div>
            {children}
        </div>
    );

    const FeatureLine = ({ label, subLabel, icon = true }: { label: string | React.ReactNode, subLabel?: string, icon?: boolean }) => (
        <div className={styles.featureItem}>
            {icon && <Check size={16} className={styles.checkIcon} />}
            <div className={styles.modelInfo}>
                <div className="name">{label}</div>
                {subLabel && <div className="desc">{subLabel}</div>}
            </div>
        </div>
    );

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <section className={styles.heroWrapper}>
                    <div className={styles.heroGlow1} />
                    <h1 className={styles.heroTitle}>Plans et tarifs</h1>
                    <p className={styles.heroSubtitle}>
                        Automatisez votre WhatsApp avec l'IA. Commencez gratuitement, <br />
                        puis choisissez le plan adapté à votre croissance.
                    </p>

                    <Button
                        size="large"
                        type="primary"
                        icon={<Gift size={20} />}
                        onClick={() => window.location.href = 'https://app.connect.wozif.com'}
                        style={{
                            fontWeight: 700,
                            minWidth: 240,
                            height: 56,
                            borderRadius: 16,
                            marginBottom: 48,
                            zIndex: 1,
                            background: '#075e54'
                        }}
                    >
                        Commencer gratuitement
                    </Button>

                    <Flexbox horizontal align="center" gap={8} style={{ position: 'relative' }}>
                        <span style={{ fontSize: 14, fontWeight: 500, opacity: billingCycle === 'monthly' ? 1 : 0.5 }}>Mensuel</span>
                        <Switch
                            checked={billingCycle === 'yearly'}
                            onChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                            style={{ backgroundColor: billingCycle === 'yearly' ? '#52c41a' : '#a8a8a8' }}
                        />
                        <Flexbox horizontal align="center" gap={6}>
                            <span style={{ fontSize: 14, fontWeight: 600, opacity: billingCycle === 'yearly' ? 1 : 0.5 }}>Facturation annuelle</span>
                            <Tag color="success" style={{ background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a', margin: 0, fontSize: 11 }}>-17%</Tag>
                        </Flexbox>
                    </Flexbox>
                </section>

                {/* BYOK Toggle */}
                <div className={styles.byokCard}>
                    <Flexbox gap={12}>
                        <Flexbox horizontal align="center" justify="space-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Mode de tarification</h3>
                                <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>
                                    {pricingMode === 'byok'
                                        ? 'BYOK : Utilisez vos propres clés API — Économisez jusqu\'à 51%'
                                        : 'Crédits Connect inclus — ou passez en BYOK pour économiser (Pro+)'}
                                </p>
                            </div>
                            <Flexbox horizontal align="center" gap={12}>
                                <span style={{ fontWeight: pricingMode === 'standard' ? 700 : 400, fontSize: 14 }}>Crédits Connect</span>
                                <Switch
                                    checked={pricingMode === 'byok'}
                                    onChange={(checked) => setPricingMode(checked ? 'byok' : 'standard')}
                                    style={{ backgroundColor: pricingMode === 'byok' ? '#52c41a' : '#a8a8a8' }}
                                />
                                <Flexbox horizontal align="center" gap={6}>
                                    <span style={{ fontWeight: pricingMode === 'byok' ? 700 : 400, fontSize: 14 }}>BYOK</span>
                                    <Tag color="success" style={{ margin: 0, fontSize: 11 }}>-50%</Tag>
                                    <span style={{ fontSize: 11, color: '#999' }}>(Pro+)</span>
                                </Flexbox>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </div>

                <section className={styles.pricingGrid}>
                    {/* Plan Gratuit */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #52c41a, #389e0d)', borderColor: '#95de64', color: '#95de64' }}>
                                <Sparkle size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Gratuit</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Idéal pour tester la plateforme</p>
                            </div>
                            <div>
                                <div style={{ fontSize: 32, fontWeight: 800 }}>Gratuit</div>
                            </div>
                            <Button type="default" block onClick={() => window.location.href = 'https://app.connect.wozif.com'} style={{ fontWeight: 600, height: 44, borderRadius: 12 }}>Commencer gratuitement</Button>
                        </Flexbox>
                        <Divider dashed style={{ margin: 0 }} />
                        <div className={styles.featureList}>
                            <FeatureLine label="1 agent WhatsApp" />
                            <FeatureLine label="250 crédits/mois (~25 messages)" />
                            <FeatureLine label="Stockage 500 MB" />
                            <FeatureLine label='Branding "Powered by Connect"' />
                            <FeatureLine label="Support communauté" />
                        </div>
                    </div>

                    {/* Plan Starter */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon}>
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Starter</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour petites entreprises et freelances</p>
                            </div>
                            <div>
                                <div style={{ fontSize: 32, fontWeight: 800 }}>{billingCycle === 'yearly' ? '24€' : '29€'}</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/mois</div>
                                {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5 }}>Facturé 290€/an</div>}
                            </div>
                            <Button type="primary" block loading={isLoading('starter')} onClick={() => checkout('starter', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>
                        <Divider dashed style={{ margin: 0 }} />
                        <div className={styles.featureList}>
                            <FeatureLine label="3 agents WhatsApp" />
                            <FeatureLine label="5,000,000 crédits/mois" />
                            <FeatureLine label="Tous les modèles IA (GPT-4o, Claude, DeepSeek)" />
                            <FeatureLine label="Stockage 5 GB" />
                            <FeatureLine label="Support email" />
                            <FeatureLine label="Crédits supplémentaires : 15€/10M" />
                        </div>
                    </div>

                    {/* Plan Pro */}
                    <div className={cx(styles.card, styles.featuredCard)} style={{ position: 'relative' }}>
                        {pricingMode === 'byok' ? (
                            <Tag color="success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Économisez 51%</Tag>
                        ) : (
                            <Tag style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#075e54', border: 'none', color: '#fff' }}>Populaire</Tag>
                        )}
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #075e54, #128c7e)', borderColor: '#fff' }}>
                                <Atom size={18} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Pro
                                    <Tag color="processing" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700 }}>3 jours d'essai gratuit</Tag>
                                </h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour PME et agences en croissance</p>
                            </div>
                            <div>
                                {pricingMode === 'byok' ? (
                                    <>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>{billingCycle === 'yearly' ? '33€' : '39€'}</div>
                                        <div style={{ fontSize: 13, opacity: 0.5 }}>/mois <Tag color="success" style={{ margin: 0, fontSize: 10 }}>BYOK</Tag></div>
                                        {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5 }}>Facturé 390€/an</div>}
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>{billingCycle === 'yearly' ? '66€' : '79€'}</div>
                                        <div style={{ fontSize: 13, opacity: 0.5 }}>/mois</div>
                                        {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5 }}>Facturé 790€/an</div>}
                                    </>
                                )}
                            </div>
                            <Button type="primary" block loading={isLoading('pro')} onClick={() => checkout('pro', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 48, borderRadius: 14, background: '#000', color: '#fff', border: 'none' }}>Essayer 3 jours gratuit</Button>
                        </Flexbox>
                        <Divider dashed style={{ margin: 0 }} />
                        <div className={styles.featureList}>
                            <FeatureLine label="10 agents WhatsApp" />
                            <FeatureLine label={pricingMode === 'byok' ? 'Crédits illimités (vos clés API)' : '40M crédits (~56,000 messages)'} />
                            <FeatureLine label="Tous les modèles IA (GPT-4o, Claude, DeepSeek)" />
                            <FeatureLine label="Stockage 20 GB" />
                            <FeatureLine label="Connecteurs CRM natifs" />
                            <FeatureLine label="Support prioritaire 24/7" />
                            <FeatureLine label="Crédits supplémentaires : 12€/10M" />
                        </div>
                    </div>

                    {/* Plan Business */}
                    <div className={styles.card} style={{ position: 'relative' }}>
                        {pricingMode === 'byok' && (
                            <Tag color="success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Économisez 50%</Tag>
                        )}
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #f7a82f, #bb7227)', borderColor: '#fff' }}>
                                <CreditCard size={18} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Business</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour grandes entreprises</p>
                            </div>
                            <div>
                                {pricingMode === 'byok' ? (
                                    <>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>{billingCycle === 'yearly' ? '83€' : '99€'}</div>
                                        <div style={{ fontSize: 13, opacity: 0.5 }}>/mois <Tag color="success" style={{ margin: 0, fontSize: 10 }}>BYOK</Tag></div>
                                        {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5 }}>Facturé 990€/an</div>}
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>{billingCycle === 'yearly' ? '166€' : '199€'}</div>
                                        <div style={{ fontSize: 13, opacity: 0.5 }}>/mois</div>
                                        {billingCycle === 'yearly' && <div style={{ fontSize: 12, opacity: 0.5 }}>Facturé 1 990€/an</div>}
                                    </>
                                )}
                            </div>
                            <Button type="primary" block loading={isLoading('business')} onClick={() => checkout('business', billingCycle as 'monthly' | 'yearly')} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>
                        <Divider dashed style={{ margin: 0 }} />
                        <div className={styles.featureList}>
                            <FeatureLine label="50 agents WhatsApp" />
                            <FeatureLine label={pricingMode === 'byok' ? 'Crédits illimités (vos clés API)' : '150M crédits'} />
                            <FeatureLine label="Tous les modèles IA + priorité" />
                            <FeatureLine label="Stockage 100 GB" />
                            <FeatureLine label="Multi-utilisateurs (5 sièges inclus)" />
                            <FeatureLine label="SSO & Logs d'audit" />
                            <FeatureLine label="Account Manager dédié" />
                            <FeatureLine label="Crédits supplémentaires : 10€/10M" />
                        </div>
                    </div>

                    {/* Plan Enterprise */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #722ed1, #531dab)', borderColor: '#b37feb', color: '#b37feb' }}>
                                <Sparkle size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Enterprise</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Solution sur mesure pour corporations</p>
                            </div>
                            <div>
                                <div style={{ fontSize: 32, fontWeight: 800 }}>Sur devis</div>
                            </div>
                            <Button type="primary" block onClick={() => window.location.href = 'mailto:contact@wozif.com'} style={{ fontWeight: 700, height: 44, borderRadius: 12, background: '#075e54', border: 'none' }}>Contacter les ventes</Button>
                        </Flexbox>
                        <Divider dashed style={{ margin: 0 }} />
                        <div className={styles.featureList}>
                            <FeatureLine label="Agents WhatsApp illimités" />
                            <FeatureLine label="Crédits personnalisés" />
                            <FeatureLine label="Infrastructure dédiée" />
                            <FeatureLine label="Stockage illimité" />
                            <FeatureLine label="Multi-utilisateurs illimités" />
                            <FeatureLine label="SLA 99.9%" />
                            <FeatureLine label="Onboarding personnalisé" />
                            <FeatureLine label="Support dédié 24/7" />
                        </div>
                    </div>
                </section>

                <section className={styles.tableSection}>
                    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Consommation par modèle</h2>
                    <AntTable
                        dataSource={[
                            { key: '1', model: 'GPT-4o mini', input: '0.15M', output: '0.6M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '2', model: 'GPT-4o', input: '2.5M', output: '10M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '3', model: 'GPT-4.1', input: '2M', output: '8M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '4', model: 'GPT-4.1 mini', input: '0.4M', output: '1.6M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '5', model: 'o3 mini', input: '1.1M', output: '4.4M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '6', model: 'Claude 3.5 Sonnet', input: '3M', output: '15M', iconBg: '#d97757', icon: <Anthropic.Avatar size={14} /> },
                            { key: '7', model: 'Claude 3.5 Haiku', input: '0.8M', output: '4M', iconBg: '#d97757', icon: <Anthropic.Avatar size={14} /> },
                            { key: '8', model: 'Claude 3 Opus', input: '15M', output: '75M', iconBg: '#d97757', icon: <Anthropic.Avatar size={14} /> },
                            { key: '9', model: 'DeepSeek R1', input: '0.55M', output: '2.19M', iconBg: '#4d6bfe', icon: <DeepSeek.Avatar size={14} /> },
                            { key: '10', model: 'DeepSeek V3', input: '0.27M', output: '1.1M', iconBg: '#4d6bfe', icon: <DeepSeek.Avatar size={14} /> },
                            { key: '11', model: 'Gemini 2.0 Flash', input: '0.1M', output: '0.4M', iconBg: '#4285f4', icon: <Google.Avatar size={14} /> },
                            { key: '12', model: 'Gemini 1.5 Pro', input: '1.25M', output: '5M', iconBg: '#4285f4', icon: <Google.Avatar size={14} /> },
                            { key: '13', model: 'Gemini 1.5 Flash', input: '0.075M', output: '0.3M', iconBg: '#4285f4', icon: <Google.Avatar size={14} /> },
                            { key: '14', model: 'Mistral Large', input: '2M', output: '6M', iconBg: '#f7931a', icon: <Mistral.Avatar size={14} /> },
                            { key: '15', model: 'Mistral Small', input: '0.2M', output: '0.6M', iconBg: '#f7931a', icon: <Mistral.Avatar size={14} /> },
                            { key: '16', model: 'Llama 3.3 70B', input: '0.6M', output: '0.6M', iconBg: '#0668e1', icon: <Meta.Avatar size={14} /> },
                            { key: '17', model: 'Llama 3.1 8B', input: '0.05M', output: '0.05M', iconBg: '#0668e1', icon: <Meta.Avatar size={14} /> },
                            { key: '18', model: 'Groq Llama 3 70B', input: '0.59M', output: '0.79M', iconBg: '#f55036', icon: <Groq.Avatar size={14} /> },
                        ]}
                        columns={[
                            {
                                title: 'Modèle',
                                dataIndex: 'model',
                                key: 'model',
                                render: (text: string, record: any) => (
                                    <Flexbox horizontal align="center" gap={12}>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: record.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}> {record.icon} </div>
                                        <span style={{ fontWeight: 500 }}>{text}</span>
                                    </Flexbox>
                                )
                            },
                            { title: 'Entrée / 1M Tokens', dataIndex: 'input', key: 'input', align: 'right' as const, render: (text: string) => <Flexbox horizontal align="center" gap={8} justify="flex-end"><span style={{ fontWeight: 600 }}>{text}</span> <Tag style={{ margin: 0 }}>Crédits</Tag></Flexbox> },
                            { title: 'Sortie / 1M Tokens', dataIndex: 'output', key: 'output', align: 'right' as const, render: (text: string) => <Flexbox horizontal align="center" gap={8} justify="flex-end"><span style={{ fontWeight: 600 }}>{text}</span> <Tag style={{ margin: 0 }}>Crédits</Tag></Flexbox> },
                        ]}
                        pagination={false}
                        size="large"
                        style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}
                    />
                </section>
            </div>
        </main>
    );
};

export default PricingPage;
