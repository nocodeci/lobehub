'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function SecurityPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>
                    <Shield size={28} style={{ color: '#075e54' }} />
                    Paramètres du compte
                </h1>
                <p className={styles.sectionSubtitle}>La sécurité de vos données et de vos conversations est notre priorité absolue.</p>

                <p className={styles.prose}>Dans Paramètres → Compte, vous pouvez modifier :</p>
                <ul className={styles.list}>
                    <li>Votre nom d'affichage et avatar</li>
                    <li>Votre adresse email</li>
                    <li>Votre mot de passe</li>
                    <li>La langue de l'interface</li>
                    <li>Les préférences de notification</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Facturation', href: '/documentation/subscription/billing' }}
                next={{ label: 'Données & Confidentialité', href: '/documentation/security/privacy' }}
            />
        </>
    );
}
