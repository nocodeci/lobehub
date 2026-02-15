'use client';

import React from 'react';
import { Alert, Tag } from 'antd';
import { Lightbulb } from 'lucide-react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function CreditConsumptionPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Consommation de crédits</h1>
                <p className={styles.sectionSubtitle}>Chaque modèle consomme un nombre différent de crédits en fonction du nombre de tokens traités.</p>

                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Modèle</th>
                            <th style={{ textAlign: 'right' }}>Entrée / 1M tokens</th>
                            <th style={{ textAlign: 'right' }}>Sortie / 1M tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['GPT-4o mini', '0.15M', '0.6M'],
                            ['GPT-4o', '2.5M', '10M'],
                            ['GPT-4.1', '2M', '8M'],
                            ['GPT-4.1 mini', '0.4M', '1.6M'],
                            ['o3 mini', '1.1M', '4.4M'],
                            ['Claude 3.5 Sonnet', '3M', '15M'],
                            ['Claude 3.5 Haiku', '0.8M', '4M'],
                            ['Claude 3 Opus', '15M', '75M'],
                            ['DeepSeek R1', '0.55M', '2.19M'],
                            ['DeepSeek V3', '0.27M', '1.1M'],
                            ['Gemini 2.0 Flash', '0.1M', '0.4M'],
                            ['Gemini 1.5 Pro', '1.25M', '5M'],
                            ['Mistral Large', '2M', '6M'],
                            ['Mistral Small', '0.2M', '0.6M'],
                            ['Llama 3.3 70B', '0.6M', '0.6M'],
                        ].map(([model, input, output], i) => (
                            <tr key={i}>
                                <td><strong>{model}</strong></td>
                                <td style={{ textAlign: 'right' }}>{input} <Tag style={{ margin: 0, marginLeft: 4 }}>Crédits</Tag></td>
                                <td style={{ textAlign: 'right' }}>{output} <Tag style={{ margin: 0, marginLeft: 4 }}>Crédits</Tag></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Alert
                    type="info"
                    showIcon
                    icon={<Lightbulb size={16} />}
                    message="Comment estimer sa consommation ?"
                    description="Un message WhatsApp typique contient environ 50-100 tokens (entrée) et génère environ 100-300 tokens (sortie). Avec GPT-4o mini, 1 million de crédits permet d'envoyer environ 1 600 messages."
                    style={{ borderRadius: 12, margin: '16px 0 24px' }}
                />
            </section>

            <DocNavFooter
                prev={{ label: 'Modèles disponibles', href: '/documentation/models' }}
                next={{ label: 'BYOK', href: '/documentation/models/byok' }}
            />
        </>
    );
}
