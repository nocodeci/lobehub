'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function AgentsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Bot size={28} style={{ color: '#075e54' }} />
                    Comprendre les agents
                </h1>
                <p className={styles.sectionSubtitle}>Les agents sont le cœur de Connect. Ce sont des assistants IA que vous personnalisez pour automatiser vos interactions WhatsApp.</p>

                <p className={styles.prose}>
                    Chaque agent dans Connect est un assistant IA indépendant avec sa propre personnalité, ses propres connaissances et ses propres capacités. Un agent peut :
                </p>
                <ul className={styles.list}>
                    <li>Répondre automatiquement aux messages WhatsApp 24/7</li>
                    <li>Comprendre le contexte de la conversation et maintenir une mémoire</li>
                    <li>Accéder à une base de connaissances personnalisée (vos documents, FAQ, catalogues)</li>
                    <li>Utiliser des outils (recherche web, calculs, appels API)</li>
                    <li>Collaborer avec d'autres agents dans une équipe</li>
                    <li>Transférer la conversation à un humain si nécessaire</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Créer votre premier agent', href: '/documentation/getting-started/first-agent' }}
                next={{ label: 'Configurer un agent', href: '/documentation/agents/configure' }}
            />
        </>
    );
}
