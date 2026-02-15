'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function FirstAgentPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Créer votre premier agent</h1>
                <p className={styles.sectionSubtitle}>Un agent est un chatbot IA que vous configurez pour répondre aux messages WhatsApp. Voici comment en créer un :</p>

                {[
                    { n: '1', title: 'Cliquer sur "Nouvel agent"', desc: 'Dans la barre latérale, cliquez sur le bouton "+" pour créer un nouvel agent.' },
                    { n: '2', title: 'Choisir un modèle IA', desc: 'Sélectionnez le modèle IA qui alimentera votre agent (ex: GPT-4o mini pour un usage économique, Claude 3.5 Sonnet pour des réponses plus nuancées).' },
                    { n: '3', title: 'Écrire le prompt système', desc: 'Le prompt système définit la personnalité et le comportement de votre agent. Ex: "Tu es un assistant commercial pour la boutique X."' },
                    { n: '4', title: 'Ajouter une base de connaissances (optionnel)', desc: "Uploadez vos catalogues produits, FAQ, ou documents pour que l'agent réponde avec des informations spécifiques à votre entreprise." },
                    { n: '5', title: "Tester l'agent", desc: 'Utilisez le chat intégré pour tester les réponses de votre agent avant de le connecter à WhatsApp.' },
                    { n: '6', title: 'Connecter à WhatsApp', desc: 'Rendez-vous dans les paramètres WhatsApp, scannez le QR code avec votre téléphone, et votre agent est en ligne !' },
                ].map((step) => (
                    <div key={step.n} className={styles.stepCard}>
                        <div className={styles.stepNumber}>{step.n}</div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{step.title}</div>
                            <div style={{ fontSize: 14, color: '#666' }}>{step.desc}</div>
                        </div>
                    </div>
                ))}
            </section>

            <DocNavFooter
                prev={{ label: "Aperçu de l'interface", href: '/documentation/getting-started/interface' }}
                next={{ label: 'Comprendre les agents', href: '/documentation/agents' }}
            />
        </>
    );
}
