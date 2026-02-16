'use client';

import React from 'react';
import { useDocStyles } from '../_components/doc-styles';
import { DocNavFooter } from '../_components/DocNavFooter';

export default function APIIntroPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>API Connect AI</h1>
                <p className={styles.sectionSubtitle}>
                    Intégrez l&apos;intelligence artificielle de Connect AI directement dans vos applications,
                    sites web et workflows grâce à notre API REST.
                </p>

                <h3 className={styles.h3}>Qu&apos;est-ce que l&apos;API Connect AI ?</h3>
                <p className={styles.prose}>
                    L&apos;API Connect AI vous permet d&apos;accéder programmatiquement à toutes les fonctionnalités
                    de la plateforme : envoyer des messages à l&apos;IA, gérer vos agents, consulter vos crédits,
                    et bien plus encore. Elle est compatible avec le standard OpenAI, ce qui facilite l&apos;intégration
                    avec les outils existants.
                </p>

                <h3 className={styles.h3}>Cas d&apos;utilisation</h3>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🤖</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Chatbot sur votre site</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Intégrez un assistant IA sur votre site web qui répond aux visiteurs en temps réel.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📱</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Application mobile</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Ajoutez des fonctionnalités IA dans votre app mobile (iOS, Android, Flutter, React Native).
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Automatisation</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Automatisez le traitement de données, la génération de contenu ou l&apos;analyse de texte.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔗</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Intégration CRM</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Connectez l&apos;IA à votre CRM pour enrichir les interactions client automatiquement.
                        </p>
                    </div>
                </div>

                <h3 className={styles.h3}>Comment ça marche ?</h3>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>1</div>
                    <div>
                        <strong>Créez une clé API</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Allez dans <strong>Paramètres → Développeur</strong> dans Connect AI et créez une nouvelle clé API.
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>2</div>
                    <div>
                        <strong>Authentifiez vos requêtes</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Incluez votre clé dans le header <code>Authorization: Bearer VOTRE_CLE_API</code>.
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>3</div>
                    <div>
                        <strong>Appelez les endpoints</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Envoyez des requêtes HTTP à nos endpoints pour interagir avec l&apos;IA, gérer vos agents, etc.
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>4</div>
                    <div>
                        <strong>Les crédits sont déduits automatiquement</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Chaque appel IA consomme des crédits selon le modèle utilisé. Consultez votre solde à tout moment.
                        </p>
                    </div>
                </div>

                <h3 className={styles.h3}>URL de base</h3>
                <div className={styles.codeBlock}>
{`https://app.connect.wozif.com`}
                </div>
                <p className={styles.prose}>
                    Toutes les requêtes API doivent être envoyées à cette URL de base, suivie du chemin de l&apos;endpoint.
                </p>

                <h3 className={styles.h3}>Limites</h3>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Plan</th>
                            <th>Crédits / mois</th>
                            <th>Requêtes API</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Gratuit</td><td>100 crédits ($1.00)</td><td>Illimitées*</td></tr>
                        <tr><td>Starter</td><td>1 500 crédits ($15.00)</td><td>Illimitées</td></tr>
                        <tr><td>Pro</td><td>5 000 crédits ($50.00)</td><td>Illimitées</td></tr>
                        <tr><td>Business</td><td>20 000 crédits ($200.00)</td><td>Illimitées</td></tr>
                        <tr><td>Enterprise</td><td>Illimité</td><td>Illimitées</td></tr>
                    </tbody>
                </table>
                <p className={styles.prose} style={{ fontSize: 13, color: '#999' }}>
                    * Les requêtes API sont illimitées, mais chaque appel IA consomme des crédits selon le modèle utilisé.
                    Quand vos crédits sont épuisés, les appels IA sont bloqués jusqu&apos;au renouvellement ou à un top-up.
                </p>
            </section>

            <DocNavFooter
                prev={{ label: 'Zapier & Make', href: '/documentation/integrations/zapier' }}
                next={{ label: 'Clés API', href: '/documentation/api/keys' }}
            />
        </>
    );
}
