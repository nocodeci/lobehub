'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function AgentTeamPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Équipe d'agents</h1>
                <p className={styles.sectionSubtitle}>Créez des groupes d'agents qui collaborent pour résoudre des problèmes complexes.</p>

                <p className={styles.prose}>
                    La fonctionnalité <strong>Équipe d'agents</strong> permet de créer des groupes d'agents qui collaborent. Par exemple :
                </p>
                <ul className={styles.list}>
                    <li><strong>Agent d'accueil</strong> — Qualifie la demande du client et la route vers le bon agent spécialisé.</li>
                    <li><strong>Agent commercial</strong> — Gère les demandes de devis, les recommandations produit.</li>
                    <li><strong>Agent support</strong> — Traite les problèmes techniques et les réclamations.</li>
                    <li><strong>Agent RH</strong> — Répond aux questions des candidats sur les offres d'emploi.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Outils & Plugins', href: '/documentation/agents/tools' }}
                next={{ label: 'Connecter WhatsApp', href: '/documentation/whatsapp' }}
            />
        </>
    );
}
