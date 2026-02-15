'use client';

import React from 'react';
import { Alert } from 'antd';
import {
    Compass,
    Bot,
    MessageSquare,
    Brain,
    Database,
    Link2,
    Layers,
    Lightbulb,
} from 'lucide-react';
import { useDocStyles } from './_components/doc-styles';
import { DocNavFooter } from './_components/DocNavFooter';

const DocumentationPage = () => {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Compass size={28} style={{ color: '#075e54' }} />
                    Prise en main
                </h1>
                <p className={styles.sectionSubtitle}>
                    Bienvenue dans la documentation officielle de Connect. Ce guide vous accompagnera de la création de votre compte à la mise en place de votre premier agent IA sur WhatsApp.
                </p>

                <h3 className={styles.h3}>Qu'est-ce que Connect ?</h3>
                <p className={styles.prose}>
                    <strong>Connect</strong> est une plateforme d'automatisation WhatsApp propulsée par l'intelligence artificielle. Elle permet aux entreprises de toutes tailles de créer des agents conversationnels intelligents qui répondent automatiquement aux messages WhatsApp, qualifient les prospects, gèrent le support client et orchestrent des workflows complexes.
                </p>
                <div className={styles.featureGrid}>
                    {[
                        { icon: <Bot size={20} />, title: 'Agents IA autonomes', desc: "Des chatbots alimentés par GPT-4o, Claude, DeepSeek et d'autres modèles de pointe." },
                        { icon: <MessageSquare size={20} />, title: 'WhatsApp natif', desc: "Connexion directe à WhatsApp sans API Business coûteuse. Scannez un QR code et c'est parti." },
                        { icon: <Brain size={20} />, title: 'Multi-modèles IA', desc: 'Choisissez parmi +50 modèles IA (OpenAI, Anthropic, Google, Mistral, Meta, DeepSeek, etc.).' },
                        { icon: <Layers size={20} />, title: 'Orchestration avancée', desc: "Créez des équipes d'agents qui collaborent pour résoudre des problèmes complexes." },
                        { icon: <Database size={20} />, title: 'Base de connaissances', desc: "Uploadez vos documents (PDF, Word, CSV) pour que l'agent réponde avec vos données." },
                        { icon: <Link2 size={20} />, title: 'Intégrations', desc: 'Google Sheets, Webhooks, API REST, Zapier — connectez Connect à tout votre écosystème.' },
                    ].map((f, i) => (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{f.icon}</div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{f.desc}</div>
                        </div>
                    ))}
                </div>

                <Alert
                    type="info"
                    showIcon
                    icon={<Lightbulb size={16} />}
                    message="Astuce"
                    description="Le plan Gratuit est idéal pour tester la plateforme. Il inclut l'accès au modèle GPT-4o mini et permet de créer 1 agent WhatsApp. Aucune carte bancaire n'est requise."
                    style={{ borderRadius: 12, margin: '24px 0' }}
                />
            </section>

            <DocNavFooter
                next={{ label: 'Créer un compte', href: '/documentation/getting-started/create-account' }}
            />
        </>
    );
};

export default DocumentationPage;
