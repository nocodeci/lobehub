'use client';

import React from 'react';
import { FileText, BarChart3, Globe } from 'lucide-react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function KnowledgeBasePage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Base de connaissances</h1>
                <p className={styles.sectionSubtitle}>La base de connaissances permet à votre agent de répondre avec des informations spécifiques à votre entreprise.</p>

                <div className={styles.featureGrid}>
                    {[
                        { icon: <FileText size={18} />, title: 'Documents PDF', desc: "Catalogues, brochures, manuels d'utilisation" },
                        { icon: <FileText size={18} />, title: 'Fichiers Word', desc: 'Procédures internes, FAQ, guides' },
                        { icon: <BarChart3 size={18} />, title: 'Fichiers CSV/Excel', desc: 'Listes de produits, inventaire, prix' },
                        { icon: <Globe size={18} />, title: 'Pages web', desc: 'Crawlez votre site web pour extraire le contenu' },
                    ].map((f, i) => (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{f.icon}</div>
                            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{f.title}</div>
                            <div style={{ fontSize: 13, color: '#666' }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
                <p className={styles.prose}>
                    Le stockage disponible dépend de votre plan : <strong>500 MB</strong> (Gratuit), <strong>5 GB</strong> (Starter), <strong>20 GB</strong> (Pro), <strong>100 GB</strong> (Business), <strong>Illimité</strong> (Enterprise).
                </p>
            </section>

            <DocNavFooter
                prev={{ label: 'Prompt système', href: '/documentation/agents/system-prompt' }}
                next={{ label: 'Outils & Plugins', href: '/documentation/agents/tools' }}
            />
        </>
    );
}
