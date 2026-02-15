'use client';

import React from 'react';
import { Link2 } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function IntegrationsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Link2 size={28} style={{ color: '#075e54' }} />
                    Google Sheets
                </h1>
                <p className={styles.sectionSubtitle}>Connectez Connect à vos outils existants pour créer des workflows automatisés puissants.</p>

                <p className={styles.prose}>
                    L'intégration Google Sheets permet à vos agents de lire et écrire des données dans vos feuilles de calcul. Cas d'usage :
                </p>
                <ul className={styles.list}>
                    <li>Enregistrer automatiquement les leads collectés par WhatsApp</li>
                    <li>Consulter un catalogue produit stocké dans Sheets</li>
                    <li>Mettre à jour le statut d'une commande</li>
                    <li>Exporter les statistiques de conversation</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Historique de conversations', href: '/documentation/crm/history' }}
                next={{ label: 'Webhooks', href: '/documentation/integrations/webhooks' }}
            />
        </>
    );
}
