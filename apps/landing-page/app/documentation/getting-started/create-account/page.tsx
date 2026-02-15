'use client';

import React from 'react';
import { Alert } from 'antd';
import { Lightbulb } from 'lucide-react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function CreateAccountPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Créer un compte</h1>
                <p className={styles.sectionSubtitle}>Pour commencer avec Connect, suivez ces étapes simples :</p>

                {[
                    { n: '1', title: 'Accéder à la plateforme', desc: 'Rendez-vous sur app.connect.wozif.com et cliquez sur "Commencer gratuitement".' },
                    { n: '2', title: 'Créer votre compte', desc: 'Inscrivez-vous avec votre email ou connectez-vous via Google / GitHub. La vérification email est instantanée.' },
                    { n: '3', title: 'Choisir un plan', desc: 'Le plan Gratuit vous donne accès à 1 agent et 250 crédits/mois. Vous pourrez upgrader à tout moment.' },
                    { n: '4', title: 'Configurer votre espace', desc: 'Personnalisez votre profil, configurez votre langue préférée et explorez le tableau de bord.' },
                ].map((step) => (
                    <div key={step.n} className={styles.stepCard}>
                        <div className={styles.stepNumber}>{step.n}</div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{step.title}</div>
                            <div style={{ fontSize: 14, color: '#666' }}>{step.desc}</div>
                        </div>
                    </div>
                ))}

                <Alert
                    type="info"
                    showIcon
                    icon={<Lightbulb size={16} />}
                    message="Astuce"
                    description="Le plan Gratuit est idéal pour tester la plateforme. Il inclut l'accès au modèle GPT-4o mini et permet de créer 1 agent WhatsApp. Aucune carte bancaire n'est requise."
                    style={{ borderRadius: 12, margin: '24px 0' }}
                />
            </section>

            <DocNavFooter
                prev={{ label: "Qu'est-ce que Connect ?", href: '/documentation' }}
                next={{ label: "Aperçu de l'interface", href: '/documentation/getting-started/interface' }}
            />
        </>
    );
}
