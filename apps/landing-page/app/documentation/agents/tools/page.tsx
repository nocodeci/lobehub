'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ToolsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Outils & Plugins</h1>
                <p className={styles.sectionSubtitle}>Les outils étendent les capacités de vos agents au-delà de la simple conversation.</p>

                <ul className={styles.list}>
                    <li><strong>Recherche web</strong> — L'agent peut chercher des informations sur Internet en temps réel.</li>
                    <li><strong>Génération d'images</strong> — Créez des images avec DALL·E directement dans la conversation.</li>
                    <li><strong>Exécution de code</strong> — Exécutez du code Python pour des calculs ou du traitement de données.</li>
                    <li><strong>Appels API</strong> — Connectez l'agent à vos services via des appels HTTP.</li>
                    <li><strong>Google Sheets</strong> — Lecture/écriture dans vos feuilles de calcul Google.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Base de connaissances', href: '/documentation/agents/knowledge-base' }}
                next={{ label: "Équipe d'agents", href: '/documentation/agents/team' }}
            />
        </>
    );
}
