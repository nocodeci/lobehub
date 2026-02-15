'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ConfigureAgentPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Configurer un agent</h1>
                <p className={styles.sectionSubtitle}>La configuration d'un agent se fait dans le panneau de droite lorsque vous sélectionnez un agent.</p>

                <table className={styles.planTable}>
                    <thead>
                        <tr><th>Paramètre</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        {[
                            ['Nom & Avatar', "Le nom et l'image de profil de votre agent."],
                            ['Modèle IA', 'Le modèle de langage utilisé (GPT-4o, Claude, DeepSeek, etc.).'],
                            ['Prompt système', "Les instructions qui définissent le comportement de l'agent."],
                            ['Température', 'Contrôle la créativité des réponses (0 = précis, 1 = créatif).'],
                            ['Tokens max', 'La longueur maximale des réponses générées.'],
                            ['Base de connaissances', 'Les documents uploadés pour enrichir les réponses.'],
                            ['Outils', "Les plugins et fonctionnalités que l'agent peut utiliser."],
                            ['Mémoire', 'Active la mémoire à long terme pour se souvenir des conversations passées.'],
                        ].map(([param, desc], i) => (
                            <tr key={i}><td><strong>{param}</strong></td><td>{desc}</td></tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <DocNavFooter
                prev={{ label: 'Comprendre les agents', href: '/documentation/agents' }}
                next={{ label: 'Prompt système', href: '/documentation/agents/system-prompt' }}
            />
        </>
    );
}
