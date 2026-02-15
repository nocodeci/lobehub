'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function BillingPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Facturation</h1>
                <p className={styles.sectionSubtitle}>Les paiements sont gérés par Stripe, leader mondial du paiement en ligne.</p>

                <p className={styles.prose}>
                    Nous acceptons les cartes Visa, Mastercard, et les virements bancaires pour les plans Enterprise. Toutes les factures sont disponibles dans votre espace Abonnement.
                </p>

                <ul className={styles.list}>
                    <li>Factures téléchargeables au format PDF</li>
                    <li>Historique complet des paiements</li>
                    <li>Modification de la carte bancaire à tout moment</li>
                    <li>Reçus envoyés automatiquement par email</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Changer de plan', href: '/documentation/subscription/change-plan' }}
                next={{ label: 'Paramètres du compte', href: '/documentation/security' }}
            />
        </>
    );
}
