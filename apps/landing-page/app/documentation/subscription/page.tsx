'use client';

import React from 'react';
import { Tag } from 'antd';
import { CreditCard } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function SubscriptionPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <CreditCard size={28} style={{ color: '#075e54' }} />
                    Plans disponibles
                </h1>
                <p className={styles.sectionSubtitle}>Découvrez les différents plans Connect et le fonctionnement du système de crédits.</p>

                <table className={styles.planTable}>
                    <thead>
                        <tr><th>Plan</th><th>Agents</th><th>Crédits/mois</th><th>Stockage</th><th>Prix/mois</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>Gratuit</strong></td><td>1</td><td>250</td><td>500 MB</td><td>0€</td></tr>
                        <tr><td><strong>Starter</strong></td><td>3</td><td>5,000,000</td><td>5 GB</td><td>29€</td></tr>
                        <tr><td><strong>Pro</strong> <Tag color="blue">Populaire</Tag></td><td>10</td><td>40,000,000</td><td>20 GB</td><td>79€</td></tr>
                        <tr><td><strong>Business</strong></td><td>50</td><td>150,000,000</td><td>100 GB</td><td>199€</td></tr>
                        <tr><td><strong>Enterprise</strong></td><td>Illimité</td><td>Personnalisé</td><td>Illimité</td><td>Sur devis</td></tr>
                    </tbody>
                </table>
                <p className={styles.prose}>
                    <strong>Facturation annuelle :</strong> bénéficiez de <strong>-17%</strong> de réduction en optant pour un paiement annuel. Le plan Pro passe à 66€/mois et le plan Business à 166€/mois.
                </p>
            </section>

            <DocNavFooter
                prev={{ label: 'Zapier & Make', href: '/documentation/integrations/zapier' }}
                next={{ label: 'Système de crédits', href: '/documentation/subscription/credits' }}
            />
        </>
    );
}
