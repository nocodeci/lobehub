'use client';

import {
    Flexbox,
    Button,
} from '@lobehub/ui';
import { Typography, Segmented, Tag, Table as AntTable, Divider, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import {
    Zap,
    Sparkle,
    Atom,
    Gift,
    Check,
    CircleHelp,
    ChevronDown,
} from 'lucide-react';
import {
    OpenAI,
    Anthropic,
} from '@lobehub/icons';
import React, { useState, useEffect } from 'react';

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
    segmentedWrapper: css`
    background: #f5f5f5;
    padding: 4px;
    border-radius: 16px;
    margin-bottom: 48px;
    z-index: 1;
  `,
    pricingGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
    margin-bottom: 48px;
    align-items: start;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
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
    &::before { content: '$'; font-size: 0.6em; }
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
    const [billingCycle, setBillingCycle] = useState('yearly');
    const [mounted, setMounted] = useState(false);

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
                        Commencez un essai gratuit de GPT / Claude / Gemini avec 500,000 Credits. <br />
                        Aucune carte de crédit requise.
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

                    <div className={styles.segmentedWrapper}>
                        <Segmented
                            size="large"
                            options={[
                                { label: <Flexbox horizontal align="center" gap={6} style={{ padding: '0 12px' }}>Paiement annuel <Tag color="success" style={{ background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a', margin: 0 }}>Remise de 23%</Tag></Flexbox>, value: 'yearly' },
                                { label: <div style={{ padding: '0 12px' }}>Paiement mensuel</div>, value: 'monthly' },
                            ]}
                            value={billingCycle}
                            onChange={setBillingCycle as any}
                            style={{ background: 'transparent' }}
                        />
                    </div>
                </section>

                <section className={styles.pricingGrid}>
                    {/* Basic Plan */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon}>
                                <Sparkle size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Version de base</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour une utilisation légère et occasionnelle</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>{billingCycle === 'yearly' ? '15' : '19'}</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois ({billingCycle === 'yearly' ? 'Paiement annuel' : 'Paiement mensuel'})</div>
                            </div>
                            {billingCycle === 'yearly' && (
                                <Flexbox horizontal align="center" gap={4}>
                                    <span style={{ fontSize: 12, opacity: 0.5 }}>$180 / Par an</span>
                                    <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 21%</Tag>
                                </Flexbox>
                            )}
                            <Button type="primary" block style={{ fontWeight: 700, height: 48, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Calcul des crédits" showHelp>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>10,000,000 / Par mois</div>
                            <div className={styles.featureList}>
                                <FeatureLine label="GPT-4o mini" subLabel="Environ 14,000 messages" />
                                <FeatureLine label="DeepSeek R1" subLabel="Environ 3,800 messages" />
                                <FeatureLine label="Claude 3.5 Sonnet New" subLabel="Environ 600 messages" />
                                <FeatureLine label="Gemini 1.5 Flash" subLabel="Environ 14,000 messages" />
                                <div style={{ opacity: 0.5, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 28 }}>Voir plus de modèles...</div>
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fichiers & Connaissance" showHelp>
                            <div className={styles.featureList}>
                                <FeatureLine label="Stockage de fichiers" subLabel="2.0 GB" />
                                <FeatureLine label="Stockage de vecteurs" subLabel="10,000 entrées (≈ 100MB)" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fournisseurs">
                            <div className={styles.featureList}>
                                <FeatureLine label="Utilisez vos propres clés API" />
                                <FeatureLine label="Demandes de messages illimitées" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Services cloud">
                            <div className={styles.featureList}>
                                <FeatureLine label="Historique des conversations illimité" />
                                <FeatureLine label="Synchronisation cloud globale" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fonctionnalités avancées">
                            <div className={styles.featureList}>
                                <FeatureLine label="Points forts du Marché d'agents" />
                                <FeatureLine label="Compétences premium" />
                                <FeatureLine label="Recherche web" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Support client">
                            <div className={styles.featureList}>
                                <FeatureLine label="Support par e-mail prioritaire" />
                                <FeatureLine label="Achat de forfaits de crédits supp." />
                            </div>
                        </FeatureSection>

                        <div className={styles.viewMore}>
                            Voir plus de détails <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className={cx(styles.card, styles.featuredCard)}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #075e54, #128c7e)', borderColor: '#fff' }}>
                                <Zap size={18} fill="currentColor" color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Premium Pro</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour les professionnels et les équipes exigeantes</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>{billingCycle === 'yearly' ? '39' : '50'}</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois ({billingCycle === 'yearly' ? 'Paiement annuel' : 'Paiement mensuel'})</div>
                            </div>
                            {billingCycle === 'yearly' && (
                                <Flexbox horizontal align="center" gap={4}>
                                    <span style={{ fontSize: 12, opacity: 0.5 }}>$468 / Par an</span>
                                    <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 22%</Tag>
                                </Flexbox>
                            )}
                            <Button type="primary" block style={{ fontWeight: 700, height: 56, borderRadius: 16, background: '#000', color: '#fff', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0, borderColor: 'rgba(0,0,0,0.1)' }} />

                        <FeatureSection title="Calcul des crédits" showHelp>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>40,000,000 / Par mois</div>
                            <div className={styles.featureList}>
                                <FeatureLine label="GPT-4o mini" subLabel="Environ 56,000 messages" />
                                <FeatureLine label="DeepSeek R1" subLabel="Environ 15,000 messages" />
                                <FeatureLine label="Claude 3.5 Sonnet New" subLabel="Environ 2,400 messages" />
                                <FeatureLine label="GPT-3.5 Turbo" subLabel="Messages illimités" />
                                <div style={{ opacity: 0.5, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 28 }}>Tous les modèles du Pack Base inclus</div>
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fichiers & Connaissance" showHelp>
                            <div className={styles.featureList}>
                                <FeatureLine label="Stockage de fichiers" subLabel="10.0 GB" />
                                <FeatureLine label="Stockage de vecteurs" subLabel="50,000 entrées (≈ 500MB)" />
                                <FeatureLine label="OCR & Analyse de documents" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fournisseurs & Multi-Agents">
                            <div className={styles.featureList}>
                                <FeatureLine label="Jusqu'à 10 agents simultanés" />
                                <FeatureLine label="Connecteurs CRM Natifs" />
                                <FeatureLine label="Accès API Direct" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Services Expert">
                            <div className={styles.featureList}>
                                <FeatureLine label="Workflows d'automatisation complexes" />
                                <FeatureLine label="Aperçu des fichiers dans le chat" />
                                <FeatureLine label="Mode confidentiel entreprise" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Support Premium">
                            <div className={styles.featureList}>
                                <FeatureLine label="Support Chat & Email 24/7" />
                                <FeatureLine label="Onboarding personnalisé (Zoom)" />
                            </div>
                        </FeatureSection>

                        <div className={styles.viewMore} style={{ color: '#000' }}>
                            Tout ce qui est dans Base, et plus... <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Ultimate Plan */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #f7a82f, #bb7227)', borderColor: '#fff' }}>
                                <Atom size={18} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Utilisation intensive</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour les entreprises qui ne veulent aucune limite</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>{billingCycle === 'yearly' ? '99' : '120'}</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois ({billingCycle === 'yearly' ? 'Paiement annuel' : 'Paiement mensuel'})</div>
                            </div>
                            {billingCycle === 'yearly' && (
                                <Flexbox horizontal align="center" gap={4}>
                                    <span style={{ fontSize: 12, opacity: 0.5 }}>$1,188 / Par an</span>
                                    <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 18%</Tag>
                                </Flexbox>
                            )}
                            <Button type="primary" block style={{ fontWeight: 700, height: 48, borderRadius: 12, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Calcul des crédits" showHelp>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>100,000,000 / Par mois</div>
                            <div className={styles.featureList}>
                                <FeatureLine label="Accès prioritaire GPT-4o" subLabel="≈ 14,000 messages" />
                                <FeatureLine label="Claude 3.5 Opus" subLabel="Inclus" />
                                <FeatureLine label="Génération d'images (DALL-E 3)" subLabel="Inclus" />
                                <FeatureLine label="Modèles personnalisés (Fine-tuned)" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Fichiers & Connaissance" showHelp>
                            <div className={styles.featureList}>
                                <FeatureLine label="Stockage de fichiers" subLabel="50.0 GB" />
                                <FeatureLine label="Stockage de vecteurs" subLabel="Illimité" />
                                <FeatureLine label="Auto-indexing de sites web" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Entreprise & Sécurité">
                            <div className={styles.featureList}>
                                <FeatureLine label="Agents WhatsApp illimités" />
                                <FeatureLine label="Multi-utilisateurs & Rôles (RBAC)" />
                                <FeatureLine label="Conformité RGPD Enterprise" />
                                <FeatureLine label="SSO & Logs d'audit" />
                            </div>
                        </FeatureSection>

                        <Divider dashed style={{ margin: 0 }} />

                        <FeatureSection title="Support White-Glove">
                            <div className={styles.featureList}>
                                <FeatureLine label="Account Manager dédié" />
                                <FeatureLine label="Support technique via WhatsApp" />
                                <FeatureLine label="Garantie de disponibilité (SLA) 99.9%" />
                            </div>
                        </FeatureSection>

                        <div className={styles.viewMore}>
                            La solution ultime pour passer à l'échelle <ChevronDown size={14} />
                        </div>
                    </div>
                </section>

                <section className={styles.enterpriseBar}>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Connect Enterprise</h2>
                        <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>Déploiement privé, formation sur site et solutions sur mesure pour les grandes organisations.</p>
                    </div>
                    <Button type="primary" size="large" style={{ borderRadius: 12, fontWeight: 700, background: '#075e54' }}>Contactez-nous</Button>
                </section>

                <section className={styles.tableSection}>
                    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Consommation par modèle</h2>
                    <AntTable
                        dataSource={[
                            { key: '1', model: 'GPT-4o mini', input: '0.15M', output: '0.6M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '2', model: 'GPT-4o', input: '2.5M', output: '10M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
                            { key: '3', model: 'Claude 3.5 Sonnet', input: '3M', output: '15M', iconBg: '#d97757', icon: <Anthropic.Avatar size={14} /> },
                            { key: '4', model: 'DeepSeek R1', input: '2M', output: '8M', iconBg: '#52c41a', icon: <OpenAI.Avatar size={14} /> },
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
