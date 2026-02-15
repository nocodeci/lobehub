'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ZapierPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Zapier & Make</h1>
                <p className={styles.sectionSubtitle}>Automatisations no-code avec plus de 5 000 applications.</p>

                <p className={styles.prose}>
                    Connect s'intègre avec Zapier et Make (anciennement Integromat) pour des automatisations no-code. Utilisez nos triggers et actions pré-configurés pour connecter Connect à plus de 5 000 applications sans écrire une seule ligne de code.
                </p>

                <h3 className={styles.h3}>Triggers disponibles</h3>
                <ul className={styles.list}>
                    <li><strong>Nouveau message reçu</strong> — Se déclenche quand un message WhatsApp arrive</li>
                    <li><strong>Nouveau contact</strong> — Se déclenche quand un nouveau contact est créé</li>
                    <li><strong>Transfert humain</strong> — Se déclenche quand l'agent transfère à un humain</li>
                </ul>

                <h3 className={styles.h3}>Actions disponibles</h3>
                <ul className={styles.list}>
                    <li><strong>Envoyer un message</strong> — Envoie un message WhatsApp à un contact</li>
                    <li><strong>Créer un contact</strong> — Ajoute un contact dans le CRM Connect</li>
                    <li><strong>Ajouter un tag</strong> — Ajoute un tag à un contact existant</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'API REST', href: '/documentation/integrations/api' }}
                next={{ label: 'Plans disponibles', href: '/documentation/subscription' }}
            />
        </>
    );
}
