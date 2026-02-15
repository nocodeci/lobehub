'use client';

import React from 'react';
import { Alert } from 'antd';
import { Info } from 'lucide-react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function CreditsSystemPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Système de crédits</h1>
                <p className={styles.sectionSubtitle}>Les crédits sont la monnaie d'usage dans Connect.</p>

                <p className={styles.prose}>
                    Chaque interaction avec un modèle IA consomme des crédits proportionnellement au nombre de tokens traités. Les crédits se renouvellent chaque mois à la date anniversaire de votre abonnement.
                </p>

                <h3 className={styles.h4}>Comment sont calculés les crédits ?</h3>
                <p className={styles.prose}>La consommation de crédits dépend de deux facteurs :</p>
                <ul className={styles.list}>
                    <li><strong>Le modèle choisi</strong> — GPT-4o mini est ~16x moins cher que GPT-4o</li>
                    <li><strong>La longueur des messages</strong> — Plus le message est long, plus il consomme de tokens</li>
                </ul>

                <Alert
                    type="info"
                    showIcon
                    icon={<Info size={16} />}
                    message="Exemple de calcul"
                    description="Avec GPT-4o mini : un message typique de 100 tokens (entrée) + 200 tokens (sortie) consomme environ 135 crédits. Avec 5,000,000 de crédits (plan Starter), vous pouvez envoyer environ 37 000 messages par mois."
                    style={{ borderRadius: 12, margin: '16px 0 24px' }}
                />

                <h3 className={styles.h4}>Crédits supplémentaires</h3>
                <p className={styles.prose}>Si vous dépassez votre quota mensuel, vous pouvez acheter des crédits supplémentaires :</p>
                <ul className={styles.list}>
                    <li><strong>Starter</strong> : 15€ pour 10 millions de crédits</li>
                    <li><strong>Pro</strong> : 12€ pour 10 millions de crédits</li>
                    <li><strong>Business</strong> : 10€ pour 10 millions de crédits</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Plans disponibles', href: '/documentation/subscription' }}
                next={{ label: 'Changer de plan', href: '/documentation/subscription/change-plan' }}
            />
        </>
    );
}
