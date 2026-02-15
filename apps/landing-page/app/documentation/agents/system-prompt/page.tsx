'use client';

import React from 'react';
import { Alert } from 'antd';
import { CheckCircle2 } from 'lucide-react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function SystemPromptPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Prompt système</h1>
                <p className={styles.sectionSubtitle}>Le prompt système est l'élément le plus important de la configuration de votre agent.</p>

                <p className={styles.prose}>
                    C'est un texte qui définit qui est l'agent, comment il doit se comporter, et quelles règles il doit suivre. Voici un exemple de prompt efficace :
                </p>
                <div className={styles.codeBlock}>
{`Tu es l'assistant commercial de "BoutiqueMode", un magasin de vêtements en ligne basé à Abidjan.

RÈGLES :
- Tu réponds toujours en français
- Tu es courtois, professionnel et enthousiaste
- Tu connais le catalogue de produits (voir base de connaissances)
- Tu proposes des recommandations personnalisées
- Si un client demande un produit en rupture, propose une alternative
- Pour les commandes, demande : nom, adresse, téléphone
- Pour les questions complexes, propose de transférer à un humain

TONALITÉ : Amical mais professionnel. Utilise des emojis avec modération.
LANGUE : Français uniquement.`}
                </div>

                <Alert
                    type="success"
                    showIcon
                    icon={<CheckCircle2 size={16} />}
                    message="Bonnes pratiques pour les prompts"
                    description={
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            <li>Soyez spécifique sur le rôle et la personnalité de l'agent</li>
                            <li>Définissez des règles claires avec des exemples</li>
                            <li>Précisez la langue et le ton à utiliser</li>
                            <li>Listez les cas limites et comment les gérer</li>
                            <li>Testez et itérez — un bon prompt évolue avec le temps</li>
                        </ul>
                    }
                    style={{ borderRadius: 12, margin: '16px 0 24px' }}
                />
            </section>

            <DocNavFooter
                prev={{ label: 'Configurer un agent', href: '/documentation/agents/configure' }}
                next={{ label: 'Base de connaissances', href: '/documentation/agents/knowledge-base' }}
            />
        </>
    );
}
