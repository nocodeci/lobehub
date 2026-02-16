'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function APIKeysPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Clés API</h1>
                <p className={styles.sectionSubtitle}>
                    Les clés API sont le moyen d&apos;authentifier vos applications auprès de Connect AI.
                    Chaque clé est liée à votre compte et permet de tracer l&apos;utilisation.
                </p>

                <h3 className={styles.h3}>Créer une clé API</h3>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>1</div>
                    <div>
                        <strong>Ouvrez Connect AI</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Connectez-vous à <a href="https://app.connect.wozif.com" target="_blank" rel="noopener noreferrer" style={{ color: '#075e54', fontWeight: 600 }}>app.connect.wozif.com</a>
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>2</div>
                    <div>
                        <strong>Allez dans Paramètres → Développeur</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Dans le menu latéral, cliquez sur <strong>Paramètres</strong> (icône engrenage),
                            puis dans la section <strong>Système</strong>, cliquez sur <strong>Développeur</strong>.
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>3</div>
                    <div>
                        <strong>Cliquez sur &quot;Nouvelle clé&quot;</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            Donnez un nom descriptif à votre clé (ex: &quot;Mon App Production&quot;, &quot;Test Local&quot;, &quot;Site Web&quot;).
                        </p>
                    </div>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>4</div>
                    <div>
                        <strong>Copiez la clé immédiatement</strong>
                        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
                            La clé complète n&apos;est affichée qu&apos;une seule fois lors de la création.
                            Copiez-la et stockez-la dans un endroit sécurisé (variable d&apos;environnement, gestionnaire de secrets).
                        </p>
                    </div>
                </div>

                <h3 className={styles.h3}>Gérer vos clés</h3>
                <p className={styles.prose}>
                    Depuis la page Développeur, vous pouvez :
                </p>
                <ul className={styles.list}>
                    <li><strong>Activer / Désactiver</strong> une clé sans la supprimer (utile pour le débogage)</li>
                    <li><strong>Voir la dernière utilisation</strong> pour identifier les clés inutilisées</li>
                    <li><strong>Supprimer</strong> une clé définitivement (les requêtes utilisant cette clé seront rejetées)</li>
                </ul>

                <h3 className={styles.h3}>Bonnes pratiques de sécurité</h3>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Ne jamais exposer côté client</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            N&apos;incluez jamais votre clé API dans du code JavaScript côté navigateur,
                            dans une app mobile en clair, ou dans un dépôt Git public.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🌐</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Utilisez un backend proxy</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Créez un endpoint sur votre serveur qui appelle l&apos;API Connect AI.
                            Votre frontend appelle votre serveur, qui appelle Connect AI avec la clé.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔄</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Rotation régulière</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Créez une nouvelle clé, mettez à jour votre application, puis supprimez l&apos;ancienne.
                            Faites-le régulièrement ou si vous suspectez une fuite.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📋</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Une clé par environnement</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Utilisez des clés différentes pour le développement, le staging et la production.
                            Cela facilite le suivi et la révocation.
                        </p>
                    </div>
                </div>

                <h3 className={styles.h3}>Variables d&apos;environnement</h3>
                <p className={styles.prose}>
                    Stockez toujours votre clé API dans une variable d&apos;environnement :
                </p>
                <div className={styles.codeBlock}>
{`# .env (ne jamais committer ce fichier)
CONNECT_API_KEY=lb-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                </div>
                <p className={styles.prose}>
                    Puis utilisez-la dans votre code :
                </p>
                <div className={styles.codeBlock}>
{`# Python
import os
api_key = os.environ.get("CONNECT_API_KEY")

# Node.js
const apiKey = process.env.CONNECT_API_KEY;

# PHP
$apiKey = getenv("CONNECT_API_KEY");`}
                </div>

                <h3 className={styles.h3}>Format de la clé</h3>
                <p className={styles.prose}>
                    Les clés API Connect AI commencent par le préfixe <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>lb-</code> suivi
                    d&apos;une chaîne aléatoire. Exemple :
                </p>
                <div className={styles.codeBlock}>
{`lb-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`}
                </div>

                <h3 className={styles.h3}>Que se passe-t-il si ma clé est compromise ?</h3>
                <p className={styles.prose}>
                    Si vous pensez que votre clé a été exposée :
                </p>
                <ul className={styles.list}>
                    <li><strong>Désactivez-la immédiatement</strong> depuis la page Développeur</li>
                    <li><strong>Créez une nouvelle clé</strong> et mettez à jour votre application</li>
                    <li><strong>Supprimez l&apos;ancienne clé</strong> une fois la migration terminée</li>
                    <li><strong>Vérifiez votre consommation de crédits</strong> pour détecter une utilisation anormale</li>
                </ul>
            </section>

            <DocNavFooter
                prev={{ label: 'Introduction à l\'API', href: '/documentation/api' }}
                next={{ label: 'Authentification', href: '/documentation/api/authentication' }}
            />
        </>
    );
}
