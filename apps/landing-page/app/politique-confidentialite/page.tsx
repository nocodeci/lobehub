import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Politique de Confidentialité | Connect by Wozif",
    description: "Politique de confidentialité et de protection des données personnelles de Connect by Wozif. Découvrez comment nous collectons, utilisons et protégeons vos informations.",
    robots: { index: true, follow: true },
};

export default function PolitiqueConfidentialitePage() {
    return (
        <main style={{ minHeight: '100vh', background: '#fff', padding: '120px 24px 80px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24 }}>Politique de Confidentialité</h1>
                <p style={{ color: '#666', marginBottom: 40 }}>Dernière mise à jour : Février 2026</p>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>1. Introduction</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Wozif Technologies ("nous", "notre", "nos") s'engage à protéger la vie privée des utilisateurs de Connect ("vous", "votre", "vos"). Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme d'automatisation WhatsApp.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>2. Données collectées</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>Nous collectons les types de données suivants :</p>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24, marginTop: 12 }}>
                        <li><strong>Données d'identification</strong> : nom, prénom, adresse email, numéro de téléphone</li>
                        <li><strong>Données de connexion</strong> : adresse IP, type de navigateur, pages visitées</li>
                        <li><strong>Données WhatsApp</strong> : messages, contacts, historique de conversations (avec votre consentement)</li>
                        <li><strong>Données de paiement</strong> : informations de facturation (traitées par nos partenaires de paiement)</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>3. Utilisation des données</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>Vos données sont utilisées pour :</p>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24, marginTop: 12 }}>
                        <li>Fournir et améliorer nos services d'automatisation WhatsApp</li>
                        <li>Personnaliser votre expérience utilisateur</li>
                        <li>Traiter vos paiements et gérer votre abonnement</li>
                        <li>Vous envoyer des communications importantes (mises à jour, sécurité)</li>
                        <li>Analyser l'utilisation de notre plateforme pour l'améliorer</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>4. Partage des données</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
                    </p>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24, marginTop: 12 }}>
                        <li>Nos prestataires de services (hébergement, paiement, analytics)</li>
                        <li>Les autorités légales si requis par la loi</li>
                        <li>Des tiers en cas de fusion, acquisition ou vente d'actifs</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>5. Sécurité des données</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données : chiffrement SSL/TLS, stockage sécurisé, accès restreint, audits réguliers. Cependant, aucune transmission sur Internet n'est totalement sécurisée.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>6. Vos droits (RGPD)</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>Vous disposez des droits suivants :</p>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24, marginTop: 12 }}>
                        <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                        <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
                        <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                        <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format standard</li>
                        <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                    </ul>
                    <p style={{ lineHeight: 1.8, color: '#444', marginTop: 16 }}>
                        Pour exercer ces droits, contactez-nous à : privacy@wozif.com
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>7. Cookies</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nous utilisons des cookies essentiels pour le fonctionnement du site, des cookies analytiques (Google Analytics) pour comprendre l'utilisation, et des cookies marketing pour personnaliser les publicités. Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>8. Conservation des données</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nous conservons vos données personnelles pendant la durée de votre utilisation du service et jusqu'à 3 ans après la fin de votre abonnement, sauf obligation légale de conservation plus longue.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>9. Contact</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Pour toute question concernant cette politique de confidentialité :<br /><br />
                        <strong>Wozif Technologies</strong><br />
                        Email : privacy@wozif.com<br />
                        Délégué à la Protection des Données : dpo@wozif.com
                    </p>
                </section>
            </div>
        </main>
    );
}
