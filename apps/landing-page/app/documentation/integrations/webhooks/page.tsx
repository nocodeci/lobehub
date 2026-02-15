'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function WebhooksPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Webhooks</h1>
                <p className={styles.sectionSubtitle}>Recevez des notifications en temps réel lorsqu'un événement se produit dans Connect.</p>

                <ul className={styles.list}>
                    <li><strong>Nouveau message</strong> — Chaque fois qu'un message est reçu ou envoyé</li>
                    <li><strong>Nouveau contact</strong> — Lorsqu'un nouveau contact est ajouté</li>
                    <li><strong>Transfert humain</strong> — Quand l'agent transfère à un opérateur</li>
                    <li><strong>Événement personnalisé</strong> — Défini dans le prompt de l'agent</li>
                </ul>

                <div className={styles.codeBlock}>
{`POST https://votre-serveur.com/webhook/connect

{
  "event": "message.received",
  "timestamp": "2026-02-15T21:00:00Z",
  "data": {
    "from": "+225XXXXXXXXXX",
    "message": "Bonjour, je souhaite commander...",
    "agent_id": "agent_abc123",
    "conversation_id": "conv_xyz789"
  }
}`}
                </div>
            </section>

            <DocNavFooter
                prev={{ label: 'Google Sheets', href: '/documentation/integrations' }}
                next={{ label: 'API REST', href: '/documentation/integrations/api' }}
            />
        </>
    );
}
