'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ConfigureProviderPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Configurer un provider</h1>
                <p className={styles.sectionSubtitle}>Pour utiliser le mode BYOK, vous devez configurer vos clés API dans Connect.</p>

                {[
                    { n: '1', title: 'Accéder aux paramètres providers', desc: 'Allez dans Paramètres → Fournisseurs de modèles → Sélectionnez le provider souhaité.' },
                    { n: '2', title: 'Entrer votre clé API', desc: 'Copiez votre clé API depuis le dashboard du provider (ex: platform.openai.com) et collez-la dans Connect.' },
                    { n: '3', title: 'Activer le provider', desc: "Activez l'interrupteur pour rendre le provider disponible dans la sélection de modèles de vos agents." },
                    { n: '4', title: 'Vérifier la connexion', desc: 'Connect vérifie automatiquement que la clé est valide. Un indicateur vert confirme la connexion.' },
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
                prev={{ label: 'BYOK', href: '/documentation/models/byok' }}
                next={{ label: 'Gestion des contacts', href: '/documentation/crm' }}
            />
        </>
    );
}
