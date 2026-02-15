'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function InterfacePage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Aperçu de l'interface</h1>
                <p className={styles.sectionSubtitle}>L'interface Connect est organisée en plusieurs sections principales :</p>

                <ul className={styles.list}>
                    <li><strong>Barre latérale gauche</strong> — Navigation entre vos conversations, agents, paramètres et abonnement.</li>
                    <li><strong>Zone de conversation</strong> — Chat en temps réel avec vos agents IA. Testez et affinez vos prompts.</li>
                    <li><strong>Panneau de configuration agent</strong> — Accédez aux paramètres de l'agent sélectionné (modèle IA, prompt système, outils, base de connaissances).</li>
                    <li><strong>Paramètres</strong> — Gérez votre compte, vos providers IA, vos clés API et vos préférences.</li>
                    <li><strong>Abonnement</strong> — Consultez votre plan actuel, vos crédits restants et gérez votre facturation.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Créer un compte', href: '/documentation/getting-started/create-account' }}
                next={{ label: 'Créer votre premier agent', href: '/documentation/getting-started/first-agent' }}
            />
        </>
    );
}
