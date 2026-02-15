'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function GroupsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Groupes & Diffusion</h1>
                <p className={styles.sectionSubtitle}>Connect prend en charge les groupes WhatsApp et les messages de diffusion.</p>

                <ul className={styles.list}>
                    <li>Ajouter un agent à un groupe WhatsApp pour modérer ou répondre aux questions</li>
                    <li>Envoyer des messages de diffusion à une liste de contacts</li>
                    <li>Créer des campagnes de notification personnalisées</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Messages automatiques', href: '/documentation/whatsapp/auto-messages' }}
                next={{ label: 'Modèles disponibles', href: '/documentation/models' }}
            />
        </>
    );
}
