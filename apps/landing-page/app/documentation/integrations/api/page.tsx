'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function APIPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>API REST</h1>
                <p className={styles.sectionSubtitle}>L'API REST de Connect vous permet d'interagir programmatiquement avec la plateforme.</p>

                <ul className={styles.list}>
                    <li>Envoyer des messages WhatsApp via API</li>
                    <li>Créer et configurer des agents</li>
                    <li>Gérer les contacts et les tags</li>
                    <li>Consulter les statistiques et l'historique</li>
                </ul>

                <div className={styles.codeBlock}>
{`# Envoyer un message WhatsApp via API
curl -X POST https://api.connect.wozif.com/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+225XXXXXXXXXX",
    "message": "Bonjour ! Votre commande #1234 est prête.",
    "agent_id": "agent_abc123"
  }'`}
                </div>
            </section>

            <DocNavFooter
                prev={{ label: 'Webhooks', href: '/documentation/integrations/webhooks' }}
                next={{ label: 'Zapier & Make', href: '/documentation/integrations/zapier' }}
            />
        </>
    );
}
