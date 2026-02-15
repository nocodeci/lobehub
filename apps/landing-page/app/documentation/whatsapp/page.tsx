'use client';

import React from 'react';
import { Alert } from 'antd';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function WhatsAppPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <MessageSquare size={28} style={{ color: '#075e54' }} />
                    Connecter WhatsApp
                </h1>
                <p className={styles.sectionSubtitle}>Connect se connecte directement à WhatsApp via un bridge sécurisé. Aucun compte WhatsApp Business API n'est nécessaire.</p>

                <p className={styles.prose}>
                    La connexion WhatsApp se fait en quelques secondes grâce à notre bridge sécurisé. Votre numéro WhatsApp personnel ou professionnel peut être utilisé.
                </p>

                <Alert
                    type="warning"
                    showIcon
                    icon={<AlertTriangle size={16} />}
                    message="Important"
                    description="Assurez-vous que votre téléphone reste connecté à Internet pour maintenir la connexion WhatsApp active. Connect utilise WhatsApp Web en arrière-plan."
                    style={{ borderRadius: 12, margin: '16px 0 24px' }}
                />
            </section>

            <DocNavFooter
                prev={{ label: "Équipe d'agents", href: '/documentation/agents/team' }}
                next={{ label: 'Scanner le QR Code', href: '/documentation/whatsapp/scan-qr' }}
            />
        </>
    );
}
