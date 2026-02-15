'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function CRMPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Users size={28} style={{ color: '#075e54' }} />
                    Gestion des contacts
                </h1>
                <p className={styles.sectionSubtitle}>Connect inclut un CRM léger qui vous permet de gérer vos contacts WhatsApp, suivre les conversations et segmenter votre audience.</p>

                <p className={styles.prose}>
                    Chaque personne qui contacte votre agent WhatsApp est automatiquement ajoutée à votre liste de contacts. Vous pouvez consulter :
                </p>
                <ul className={styles.list}>
                    <li>Le numéro de téléphone et le nom WhatsApp</li>
                    <li>L'historique complet des conversations</li>
                    <li>La date du premier et dernier message</li>
                    <li>Les tags et segments associés</li>
                    <li>Les notes ajoutées manuellement</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Configurer un provider', href: '/documentation/models/provider' }}
                next={{ label: 'Tags & Segments', href: '/documentation/crm/tags' }}
            />
        </>
    );
}
