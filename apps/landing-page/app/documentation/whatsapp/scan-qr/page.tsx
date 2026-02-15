'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function ScanQRPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Scanner le QR Code</h1>
                <p className={styles.sectionSubtitle}>Connectez votre WhatsApp à Connect en 3 étapes simples.</p>

                {[
                    { n: '1', title: 'Accéder aux paramètres WhatsApp', desc: 'Dans Connect, allez dans Paramètres → WhatsApp → Connecter un compte.' },
                    { n: '2', title: 'Scanner le QR code', desc: "Un QR code s'affiche. Ouvrez WhatsApp sur votre téléphone → Menu (⋮) → Appareils connectés → Lier un appareil → Scannez le QR code." },
                    { n: '3', title: 'Confirmation', desc: 'Une fois connecté, vous verrez le statut "Connecté" en vert. Votre agent peut maintenant recevoir et envoyer des messages WhatsApp.' },
                ].map((step) => (
                    <div key={step.n} className={styles.stepCard}>
                        <div className={styles.stepNumber}>{step.n}</div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{step.title}</div>
                            <div style={{ fontSize: 14, color: '#666' }}>{step.desc}</div>
                        </div>
                    </div>
                ))}
            </section>

            <DocNavFooter
                prev={{ label: 'Connecter WhatsApp', href: '/documentation/whatsapp' }}
                next={{ label: 'Messages automatiques', href: '/documentation/whatsapp/auto-messages' }}
            />
        </>
    );
}
