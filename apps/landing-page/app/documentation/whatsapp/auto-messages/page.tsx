'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function AutoMessagesPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Messages automatiques</h1>
                <p className={styles.sectionSubtitle}>Une fois connecté, votre agent répond automatiquement à tous les messages entrants selon sa configuration.</p>

                <ul className={styles.list}>
                    <li><strong>Réponse automatique</strong> — L'agent répond à chaque message entrant.</li>
                    <li><strong>Heures d'activité</strong> — Définissez les horaires pendant lesquels l'agent est actif.</li>
                    <li><strong>Message d'absence</strong> — Configurez un message pour les heures hors service.</li>
                    <li><strong>Transfert humain</strong> — L'agent peut transférer la conversation à un opérateur humain si nécessaire.</li>
                    <li><strong>Blacklist/Whitelist</strong> — Filtrez les numéros auxquels l'agent doit répondre.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Scanner le QR Code', href: '/documentation/whatsapp/scan-qr' }}
                next={{ label: 'Groupes & Diffusion', href: '/documentation/whatsapp/groups' }}
            />
        </>
    );
}
