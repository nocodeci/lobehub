'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function PrivacyPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Données & Confidentialité</h1>
                <p className={styles.sectionSubtitle}>Connect prend la confidentialité des données très au sérieux.</p>

                <ul className={styles.list}>
                    <li><strong>Chiffrement de bout en bout</strong> — Les clés API sont chiffrées côté serveur avec AES-256.</li>
                    <li><strong>Stockage sécurisé</strong> — Les données sont hébergées sur des serveurs conformes RGPD.</li>
                    <li><strong>Pas de partage</strong> — Vos conversations et données ne sont jamais partagées avec des tiers.</li>
                    <li><strong>Suppression</strong> — Vous pouvez supprimer votre compte et toutes vos données à tout moment.</li>
                    <li><strong>Export</strong> — Exportez toutes vos données au format JSON à tout moment.</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Paramètres du compte', href: '/documentation/security' }}
                next={{ label: 'SSO & Authentification', href: '/documentation/security/sso' }}
            />
        </>
    );
}
