'use client';

import {
    Header,
    Footer,
    Flexbox,
    ActionIcon,
    Button,
    Center,
    Icon,
    Video
} from '@lobehub/ui';
import { Typography, Segmented, Tag, Table as AntTable, Divider } from 'antd';
import { createStyles } from 'antd-style';
import {
    CheckCircle2,
    Github,
    Zap,
    Sparkle,
    Atom,
    Gift,
    ChevronDown,
    CircleHelp,
    Book,
    Terminal,
    Layers,
    Search,
    MessageSquare,
    Linkedin,
    Facebook,
    Twitter,
    Check,
    Globe,
    ChevronRight
} from 'lucide-react';
import {
    OpenAI,
    Anthropic,
    Google,
    DeepSeek,
    Groq,
    Mistral,
    Meta,
    Ollama
} from '@lobehub/icons';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
    item-align: center;
  `,
    nav: css`
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: calc(100% - 32px);
    max-width: 1000px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    &.scrolled {
      top: 8px;
      max-width: 850px;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.1));
      
      .ant-layout-header {
        height: 64px !important;
        background: rgba(236, 229, 221, 0.8) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        border-radius: 20px !important;
        border: 1px solid rgba(7, 94, 84, 0.1) !important;
      }
    }
  `,
    heroWrapper: css`
    padding: 114px 0 96px;
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
    heroGlow2: css`
    position: absolute;
    top: 100px;
    right: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(37, 211, 102, 0.05) 0%, transparent 70%);
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
    gap: 12px;
    width: 100%;
    margin-bottom: 48px;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,
    card: css`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    &:hover {
      border-color: rgba(0,0,0,0.1);
      background: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }
  `,
    featuredCard: css`
    background: #fff;
    border: 2px solid #000;
    &:hover {
      background: #fff;
      border-color: #000;
    }
  `,
    planIcon: css`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #c57948, #803718);
    color: #ffc385;
    border: 2px solid #ffc385;
  `,
    priceValue: css`
    font-size: 24px;
    font-weight: 800;
    display: flex;
    align-items: baseline;
    gap: 2px;
    &::before { content: '$'; font-size: 0.8em; }
  `,
    featureGroup: css`
     display: flex;
     flex-direction: column;
     gap: 12px;
     font-size: 15px;
  `,
    featureItem: css`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;
  `,
    enterpriseBar: css`
    width: 100%;
    padding: 32px;
    background: #fdfdfd;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 80px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  `,
    tableSection: css`
    width: 100%;
    padding-bottom: 80px;
  `,
}));

const PricingReproduction = () => {
    const { styles, cx } = useStyles();
    const [billingCycle, setBillingCycle] = useState('yearly');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logo = (
        <a href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Flexbox horizontal align="center" gap={scrolled ? 8 : 12}>
                <img
                    src="/connect-logo.png"
                    alt="Connect Logo"
                    style={{
                        width: scrolled ? 32 : 40,
                        height: scrolled ? 32 : 40,
                        objectFit: 'contain',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                />
                <span style={{
                    fontSize: scrolled ? 20 : 24,
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: '#000',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    Connect
                </span>
            </Flexbox>
        </a>
    );

    const navLinks = (
        <Flexbox horizontal gap={scrolled ? 32 : 48}>
            <a href="/#features" style={{ color: 'rgba(0,0,0,0.7)', fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.7)'}>Concept</a>
            <a href="/#showcase" style={{ color: 'rgba(0,0,0,0.7)', fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.7)'}>Moteur</a>
            <a href="/pricing" style={{ color: '#000', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>Tarification</a>
            <a href="/#showcase" style={{ color: 'rgba(0,0,0,0.7)', fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.7)'}>Sécurité</a>
        </Flexbox>
    );

    const actions = (
        <Flexbox horizontal gap={scrolled ? 12 : 16} align="center">
            <ActionIcon icon={Github} size={scrolled ? "middle" : "large"} style={{ color: '#000' }} />
            <Button
                type="primary"
                size={scrolled ? "middle" : "large"}
                onClick={() => window.location.href = 'https://connect.wozif.com'}
                style={{
                    borderRadius: scrolled ? 12 : 16,
                    fontWeight: 800,
                    paddingInline: scrolled ? 20 : 32,
                    background: '#075e54',
                    border: 'none',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(7, 94, 84, 0.3)'
                }}
            >
                Démarrer
            </Button>
        </Flexbox>
    );

    const modelColumns = [
        {
            title: 'Modals',
            dataIndex: 'model',
            key: 'model',
            render: (text: string, record: any) => (
                <Flexbox horizontal align="center" gap={12}>
                    <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: record.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        {record.icon}
                    </div>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </Flexbox>
            )
        },
        {
            title: <Flexbox horizontal align="center" gap={4} justify="flex-end">Input <Tag style={{ margin: 0 }}>1M Tokens</Tag></Flexbox>,
            dataIndex: 'input',
            key: 'input',
            align: 'right' as const,
            render: (text: string) => <Flexbox horizontal align="center" gap={8} justify="flex-end"><span style={{ fontWeight: 600 }}>{text.split(' ')[0]}</span> <Tag style={{ margin: 0 }}>Credits</Tag></Flexbox>
        },
        {
            title: <Flexbox horizontal align="center" gap={4} justify="flex-end">Output <Tag style={{ margin: 0 }}>1M Tokens</Tag></Flexbox>,
            dataIndex: 'output',
            key: 'output',
            align: 'right' as const,
            render: (text: string) => <Flexbox horizontal align="center" gap={8} justify="flex-end"><span style={{ fontWeight: 600 }}>{text.split(' ')[0]}</span> <Tag style={{ margin: 0 }}>Credits</Tag></Flexbox>
        },
    ];

    const modelData = [
        { key: '1', model: 'GPT-4.1 (1M)', input: '2M', output: '8M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
        { key: '2', model: 'GPT-4.1 mini (1M)', input: '0.4M', output: '1.6M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
        { key: '3', model: 'GPT-4o mini (128K)', input: '0.15M', output: '0.6M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
        { key: '4', model: 'GPT-4o (128K)', input: '2.5M', output: '10M', iconBg: '#ab68ff', icon: <OpenAI.Avatar size={14} /> },
        { key: '5', model: 'Claude 3.7 Sonnet (200K)', input: '3M', output: '15M', iconBg: '#d97757', icon: <Anthropic.Avatar size={14} /> },
    ];

    return (
        <main className={styles.main}>
            <div className={cx(styles.nav, scrolled && 'scrolled')}>
                <Header
                    logo={logo}
                    nav={navLinks}
                    actions={actions}
                    style={{
                        height: scrolled ? 56 : 72,
                        background: 'rgba(236, 229, 221, 0.8)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        border: '1px solid rgba(7, 94, 84, 0.1)',
                        borderRadius: 20,
                        padding: '0 32px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                />
            </div>

            <div className={styles.container}>
                <section className={styles.heroWrapper}>
                    <div className={styles.heroGlow1} />
                    <div className={styles.heroGlow2} />

                    <h1 className={styles.heroTitle}>Plans et tarifs</h1>
                    <p className={styles.heroSubtitle}>
                        Commencez un essai gratuit de GPT / Claude / Gemini 500,000 Credits. <br />
                        Aucune carte de crédit requise.
                    </p>

                    <Button
                        size="large"
                        block={false}
                        icon={<Gift size={20} />}
                        onClick={() => window.location.href = 'https://connect.wozif.com'}
                        style={{
                            fontWeight: 500,
                            minWidth: 240,
                            height: 48,
                            borderRadius: 12,
                            marginBottom: 48,
                            zIndex: 1
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
                                { label: <Flexbox horizontal align="center" gap={6} style={{ padding: '0 12px' }}>Paiement unique <img src="https://api.iconify.design/ri:m-coin-line.svg" style={{ width: 16 }} /></Flexbox>, value: 'one-time' },
                            ]}
                            value={billingCycle}
                            onChange={setBillingCycle as any}
                            style={{ background: 'transparent' }}
                        />
                    </div>
                </section>

                <section className={styles.pricingGrid}>
                    {/* Version de base */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #c57948, #803718)', borderColor: '#ffc385', color: '#ffc385' }}>
                                <Sparkle size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Version de base</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour une utilisation plus légère et occasionnelle</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>9.9</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois (Paiement annuel)</div>
                            </div>
                            <Flexbox horizontal gap={4} align="center">
                                <span style={{ fontSize: 12, opacity: 0.5 }}>$118.8 / Par an</span>
                                <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 23%</Tag>
                            </Flexbox>
                            <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>5,000,000 / Par mois</div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 7,000 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 1,900 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 300 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <div style={{ opacity: 0.8 }}>Voir plus de modèles...</div>
                            </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de fichiers</div>
                                    <div style={{ fontSize: 14 }}>1.0 GB</div>
                                </Flexbox>
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de vecteurs</div>
                                    <div style={{ fontSize: 14 }}>5,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 50MB)</span></div>
                                </Flexbox>
                            </div>
                        </div>
                    </div>

                    {/* Premium */}
                    <div className={cx(styles.card, styles.featuredCard)}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #a5b4c2, #606e7b)', borderColor: '#fcfdff', color: '#fcfdff' }}>
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Premium</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour les professionnels exigeants</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>19.9</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois (Paiement annuel)</div>
                            </div>
                            <Flexbox horizontal gap={4} align="center">
                                <span style={{ fontSize: 12, opacity: 0.5 }}>$238.8 / Par an</span>
                                <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 20%</Tag>
                            </Flexbox>
                            <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>15,000,000 / Par mois</div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 21,100 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 5,800 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 900 messages</div>
                                </Flexbox>
                            </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de fichiers</div>
                                    <div style={{ fontSize: 14 }}>2.0 GB</div>
                                </Flexbox>
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de vecteurs</div>
                                    <div style={{ fontSize: 14 }}>10,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 100MB)</span></div>
                                </Flexbox>
                            </div>
                        </div>
                    </div>

                    {/* Ultimate */}
                    <div className={styles.card}>
                        <Flexbox gap={16}>
                            <div className={styles.planIcon} style={{ background: 'linear-gradient(45deg, #f7a82f, #bb7227)', borderColor: '#fcfa6e', color: '#fcfa6e' }}>
                                <Atom size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Ultimate</h2>
                                <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Pour une utilisation intensive</p>
                            </div>
                            <div>
                                <div className={styles.priceValue}>39.9</div>
                                <div style={{ fontSize: 13, opacity: 0.5 }}>/ Par mois (Paiement annuel)</div>
                            </div>
                            <Flexbox horizontal gap={4} align="center">
                                <span style={{ fontSize: 12, opacity: 0.5 }}>$478.8 / Par an</span>
                                <Tag color="success" style={{ margin: 0, fontSize: 11, background: 'rgba(82, 196, 26, 0.1)', border: 'none', color: '#52c41a' }}>Remise de 20%</Tag>
                            </Flexbox>
                            <Button type="primary" block style={{ fontWeight: 500, height: 40, borderRadius: 8, background: '#075e54', border: 'none' }}>Commencer</Button>
                        </Flexbox>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Calcul des crédits <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>35,000,000 / Par mois</div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>GPT-4o mini <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 49,100 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>DeepSeek R1 <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 13,400 messages</div>
                                </Flexbox>
                            </div>

                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Claude 3.5 Sonnet New <CircleHelp size={12} style={{ opacity: 0.5 }} /></div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Environ 2,100 messages</div>
                                </Flexbox>
                            </div>
                        </div>

                        <Divider dashed style={{ margin: 0 }} />

                        <div className={styles.featureGroup}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                Fichiers & Connaissance <CircleHelp size={14} style={{ opacity: 0.5 }} />
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de fichiers</div>
                                    <div style={{ fontSize: 14 }}>4.0 GB</div>
                                </Flexbox>
                            </div>
                            <div className={styles.featureItem}>
                                <Check size={16} color="#52c41a" />
                                <Flexbox>
                                    <div style={{ fontWeight: 600 }}>Stockage de vecteurs</div>
                                    <div style={{ fontSize: 14 }}>20,000 entrées <span style={{ opacity: 0.5, fontSize: 12 }}>(≈ 200MB)</span></div>
                                </Flexbox>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.enterpriseBar}>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Enterprise Edition</h2>
                        <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>Pour les équipes qui ont besoin d’un déploiement privé ou de solutions personnalisées</p>
                    </div>

                    <Flexbox horizontal gap={32} style={{ flex: 1, padding: '0 32px' }}>
                        <Flexbox gap={8}>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Licence commerciale</span></div>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Personnalisation de la marque</span></div>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Gestion des utilisateurs</span></div>
                        </Flexbox>
                        <Flexbox gap={8}>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Fournisseur auto-hébergé</span></div>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Modèles privés</span></div>
                            <div className={styles.featureItem}><Check size={14} color="#52c41a" /><span style={{ fontSize: 13, fontWeight: 600 }}>Intégration & Support</span></div>
                        </Flexbox>
                    </Flexbox>

                    <Button type="primary" size="large" style={{ borderRadius: 12, fontWeight: 600, background: '#075e54', border: 'none' }}>Contact</Button>
                </section>

                <section className={styles.tableSection}>
                    <Flexbox horizontal gap={48} align="start">
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Tarification des modèles de texte</h2>
                            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
                                LobeHub Cloud utilise des crédits pour mesurer l’utilisation des modèles (associée aux tokens).
                                Le tableau indique les tarifs par 1 M de tokens et la manière dont les crédits sont calculés.
                            </p>
                            <Button icon={<Book size={16} />} size="large" style={{ borderRadius: 12, fontWeight: 600, background: '#f5f5f5', border: 'none', marginTop: 16 }}>
                                Consulter la documentation
                            </Button>
                        </div>

                        <div style={{ flex: 2, width: '100%' }}>
                            <AntTable
                                columns={modelColumns}
                                dataSource={modelData}
                                pagination={false}
                                size="middle"
                                style={{
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    background: '#fff'
                                }}
                            />
                        </div>
                    </Flexbox>
                </section>
            </div>

            <Footer
                columns={[
                    {
                        title: 'Offres et tarifs',
                        items: [
                            { title: 'Quoi de neuf', url: '#' },
                            { title: 'Téléchargements', url: '#' },
                            { title: 'Marché des assistants', url: '#' },
                            { title: 'Édition Communautaire', url: '#' },
                        ],
                    },
                    {
                        title: 'Ressources',
                        items: [
                            { title: 'Documentation', url: '#' },
                            { title: 'API Reference', url: '#' },
                            { title: 'Blog', url: '#' },
                            { title: 'AI Icons', url: '#' },
                        ],
                    },
                    {
                        title: 'Produits',
                        items: [
                            { title: 'Lobe Chat', url: '#' },
                            { title: 'Lobe UI', url: '#' },
                            { title: 'Lobe Icons', url: '#' },
                            { title: 'Lobe TTS', url: '#' },
                        ],
                    },
                    {
                        title: 'À propos',
                        items: [
                            { title: 'Conditions', url: '#' },
                            { title: 'Confidentialité', url: '#' },
                            { title: 'Contact', url: '#' },
                        ],
                    },
                ]}
                style={{ width: '100%', maxWidth: 1200, padding: '80px 24px' }}
            />
        </main>
    );
};

export default PricingReproduction;
