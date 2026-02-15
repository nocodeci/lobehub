'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function HistoryPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Historique de conversations</h1>
                <p className={styles.sectionSubtitle}>L'historique complet de chaque conversation est stocké dans Connect.</p>

                <p className={styles.prose}>
                    Vous pouvez rechercher des messages par mot-clé, filtrer par date, et exporter les conversations au format CSV ou JSON. L'historique est conservé tant que votre compte est actif.
                </p>
                <ul className={styles.list}>
                    <li>Recherche par mot-clé dans toutes les conversations</li>
                    <li>Filtrage par date, contact ou agent</li>
                    <li>Export au format CSV ou JSON</li>
                    <li>Visualisation des métriques (temps de réponse, satisfaction)</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Tags & Segments', href: '/documentation/crm/tags' }}
                next={{ label: 'Google Sheets', href: '/documentation/integrations' }}
            />
        </>
    );
}
