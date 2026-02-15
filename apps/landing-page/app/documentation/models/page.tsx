'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function ModelsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Brain size={28} style={{ color: '#075e54' }} />
                    Modèles disponibles
                </h1>
                <p className={styles.sectionSubtitle}>Connect donne accès à plus de 50 modèles d'IA des meilleurs providers au monde.</p>

                <table className={styles.planTable}>
                    <thead>
                        <tr><th>Provider</th><th>Modèles phares</th><th>Usage recommandé</th></tr>
                    </thead>
                    <tbody>
                        {[
                            ['OpenAI', 'GPT-4o, GPT-4o mini, GPT-4.1, o3 mini', 'Usage général, polyvalent et performant'],
                            ['Anthropic', 'Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus', 'Rédaction, analyse, conversations nuancées'],
                            ['Google', 'Gemini 2.0 Flash, Gemini 1.5 Pro', 'Multimodal (images + texte), rapidité'],
                            ['DeepSeek', 'DeepSeek R1, DeepSeek V3', 'Raisonnement, code, analyse technique'],
                            ['Meta', 'Llama 3.3 70B, Llama 3.1 8B', 'Open source, coût réduit'],
                            ['Mistral', 'Mistral Large, Mistral Small', 'Français natif, performance européenne'],
                            ['Groq', 'Llama 3 70B (via Groq)', 'Inférence ultra-rapide'],
                        ].map(([provider, models, usage], i) => (
                            <tr key={i}>
                                <td><strong>{provider}</strong></td>
                                <td>{models}</td>
                                <td style={{ color: '#666' }}>{usage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <DocNavFooter
                prev={{ label: 'Groupes & Diffusion', href: '/documentation/whatsapp/groups' }}
                next={{ label: 'Consommation de crédits', href: '/documentation/models/credits' }}
            />
        </>
    );
}
