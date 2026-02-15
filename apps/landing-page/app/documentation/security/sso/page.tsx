'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function SSOPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>SSO & Authentification</h1>
                <p className={styles.sectionSubtitle}>Les plans Business et Enterprise prennent en charge l'authentification unique (SSO).</p>

                <ul className={styles.list}>
                    <li><strong>Google OAuth</strong> — Connexion avec compte Google</li>
                    <li><strong>GitHub</strong> — Connexion avec compte GitHub</li>
                    <li><strong>SAML/SSO</strong> — Pour les entreprises (plan Business et Enterprise)</li>
                    <li><strong>Logs d'audit</strong> — Suivi de toutes les actions des utilisateurs (plan Business+)</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Données & Confidentialité', href: '/documentation/security/privacy' }}
                next={{ label: 'Questions fréquentes', href: '/documentation/faq' }}
            />
        </>
    );
}
