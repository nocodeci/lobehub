'use client';

import React from 'react';
import { Tag } from 'antd';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function BYOKPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>BYOK (Bring Your Own Key)</h1>
                <p className={styles.sectionSubtitle}>Utilisez vos propres clés API pour les providers IA et bénéficiez de réductions sur votre abonnement.</p>

                <p className={styles.prose}>
                    Le mode <strong>BYOK</strong> vous permet d'utiliser vos propres clés API. Au lieu de consommer des crédits Connect, vous payez directement le provider (OpenAI, Anthropic, etc.) pour les tokens utilisés.
                </p>

                <h3 className={styles.h4}>Avantages du BYOK</h3>
                <ul className={styles.list}>
                    <li><strong>Réduction de -50%</strong> sur le prix de l'abonnement Connect</li>
                    <li><strong>Crédits illimités</strong> — Vous n'êtes plus limité par les crédits du plan</li>
                    <li><strong>Contrôle total</strong> — Vous gérez vos propres quotas et dépenses API</li>
                    <li><strong>Accès à tous les modèles</strong> — Y compris les modèles les plus récents dès leur sortie</li>
                </ul>

                <h3 className={styles.h4}>Disponibilité</h3>
                <p className={styles.prose}>
                    Le BYOK est disponible à partir du plan <strong>Pro</strong>. Les plans Free et Starter ne permettent pas l'utilisation de clés API personnelles.
                </p>
                <table className={styles.planTable}>
                    <thead>
                        <tr><th>Plan</th><th>BYOK</th><th>Prix standard</th><th>Prix BYOK</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Gratuit</td><td><Tag color="default">Non disponible</Tag></td><td>0€</td><td>—</td></tr>
                        <tr><td>Starter</td><td><Tag color="default">Non disponible</Tag></td><td>29€/mois</td><td>—</td></tr>
                        <tr><td><strong>Pro</strong></td><td><Tag color="success">Disponible</Tag></td><td>79€/mois</td><td>39€/mois (-51%)</td></tr>
                        <tr><td><strong>Business</strong></td><td><Tag color="success">Disponible</Tag></td><td>199€/mois</td><td>99€/mois (-50%)</td></tr>
                        <tr><td><strong>Enterprise</strong></td><td><Tag color="success">Inclus</Tag></td><td>Sur devis</td><td>Inclus</td></tr>
                    </tbody>
                </table>
            </section>

            <DocNavFooter
                prev={{ label: 'Consommation de crédits', href: '/documentation/models/credits' }}
                next={{ label: 'Configurer un provider', href: '/documentation/models/provider' }}
            />
        </>
    );
}
