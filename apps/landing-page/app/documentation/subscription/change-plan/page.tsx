'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ChangePlanPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Changer de plan</h1>
                <p className={styles.sectionSubtitle}>Vous pouvez changer de plan à tout moment depuis la page Abonnement.</p>

                <ul className={styles.list}>
                    <li><strong>Upgrade</strong> — Le prorata est calculé automatiquement. Vous payez la différence pour le reste du mois.</li>
                    <li><strong>Downgrade</strong> — Le changement prend effet à la fin de la période de facturation en cours.</li>
                    <li><strong>Annulation</strong> — Votre plan reste actif jusqu'à la fin de la période payée, puis passe au plan Gratuit.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Système de crédits', href: '/documentation/subscription/credits' }}
                next={{ label: 'Facturation', href: '/documentation/subscription/billing' }}
            />
        </>
    );
}
