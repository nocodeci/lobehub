'use client';

import {
    Flexbox,
    Button,
} from '@lobehub/ui';
import { Typography, Card, Input } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import {
    Search,
    Zap,
    Terminal,
    Box,
    Compass,
    ArrowRight
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

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
    max-width: 1100px;
    padding: 0 24px;
    margin: 0 auto;
  `,
    hero: css`
    padding: 120px 0 60px;
    text-align: center;
    background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);
    width: 100%;
  `,
    searchWrapper: css`
    max-width: 600px;
    margin: 40px auto 0;
    .ant-input-affix-wrapper {
        padding: 12px 20px;
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.08);
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        &:hover, &:focus {
            border-color: #075e54;
        }
    }
  `,
    grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin: 60px 0;
  `,
    docCard: css`
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: translateY(-4px);
        border-color: #075e54;
        box-shadow: 0 12px 30px rgba(7, 94, 84, 0.08);
    }
  `,
    iconBox: css`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(7, 94, 84, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #075e54;
    margin-bottom: 20px;
  `
}));

const DocumentationPage = () => {
    const { styles } = useStyles();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const categories = [
        {
            title: "Prise en main",
            desc: "Apprenez les bases de Connect et configurez votre premier agent en quelques minutes.",
            icon: <Compass size={24} />,
            links: ["Installation", "Configuration initiale", "Premier agent"]
        },
        {
            title: "Agents & Workflows",
            desc: "Détails techniques sur la création d'agents, les workflows et l'orchestration.",
            icon: <Box size={24} />,
            links: ["Types d'agents", "Logique de workflow", "Conditions & Filtres"]
        },
        {
            title: "Intégrations",
            desc: "Connectez WhatsApp à vos outils préférés : Google Sheets, CRM, Slack, etc.",
            icon: <Zap size={24} />,
            links: ["WhatsApp API", "Webhooks", "Google Sheets Sync"]
        },
        {
            title: "Développement API",
            desc: "Utilisez notre API pour construire des solutions d'automatisation sur mesure.",
            icon: <Terminal size={24} />,
            links: ["Authentification", "Endpoints", "SDK"]
        }
    ];

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Title level={1} style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
                        Centre d'aide & Documentation
                    </Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 700, margin: '0 auto' }}>
                        Tout ce dont vous avez besoin pour maîtriser Connect et automatiser vos communications WhatsApp comme un pro.
                    </Paragraph>

                    <div className={styles.searchWrapper}>
                        <Input
                            prefix={<Search size={18} style={{ color: '#999', marginRight: 8 }} />}
                            placeholder="Rechercher une fonctionnalité, un guide..."
                            allowClear
                        />
                    </div>
                </div>
            </section>

            <section className={styles.container}>
                <div className={styles.grid}>
                    {categories.map((cat, i) => (
                        <Card key={i} className={styles.docCard}>
                            <div className={styles.iconBox}>
                                {cat.icon}
                            </div>
                            <Title level={3} style={{ fontWeight: 800, marginBottom: 12 }}>{cat.title}</Title>
                            <Paragraph style={{ color: '#666', marginBottom: 20 }}>{cat.desc}</Paragraph>
                            <Flexbox gap={8}>
                                {cat.links.map((link, j) => (
                                    <a key={j} href="#" style={{
                                        color: '#075e54',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        textDecoration: 'none',
                                        fontSize: 14
                                    }}>
                                        {link} <ArrowRight size={12} />
                                    </a>
                                ))}
                            </Flexbox>
                        </Card>
                    ))}
                </div>

                <Card style={{
                    borderRadius: 24,
                    background: '#075e54',
                    color: '#fff',
                    padding: 40,
                    textAlign: 'center',
                    marginBottom: 80,
                    border: 'none'
                }}>
                    <Title level={2} style={{ color: '#fff', fontWeight: 900, marginBottom: 16 }}>
                        Besoin d'aide supplémentaire ?
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
                        Notre équipe de support est disponible pour vous accompagner dans vos automatisations complexes.
                    </Paragraph>
                    <Button size="large" style={{ fontWeight: 700, borderRadius: 12, height: 48, paddingInline: 40 }}>
                        Contacter le support
                    </Button>
                </Card>
            </section>
        </main>
    );
};

export default DocumentationPage;
