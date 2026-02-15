import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation | Connect by Wozif",
    description: "Conditions générales d'utilisation de Connect by Wozif. Lisez nos termes de service pour l'utilisation de notre plateforme d'automatisation WhatsApp.",
    robots: { index: true, follow: true },
};

export default function CGUPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#fff', padding: '120px 24px 80px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24 }}>Conditions Générales d'Utilisation</h1>
                <p style={{ color: '#666', marginBottom: 40 }}>Dernière mise à jour : Février 2026</p>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>1. Objet</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Connect, éditée par Wozif Technologies. En utilisant Connect, vous acceptez ces CGU dans leur intégralité.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>2. Description du service</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Connect est une plateforme SaaS d'automatisation WhatsApp utilisant l'intelligence artificielle. Elle permet aux utilisateurs de créer des agents IA, des chatbots, des réponses automatiques et des intégrations CRM pour WhatsApp Business.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>3. Inscription et compte</h2>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24 }}>
                        <li>Vous devez avoir au moins 18 ans pour utiliser Connect</li>
                        <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                        <li>Les informations fournies doivent être exactes et à jour</li>
                        <li>Un compte est personnel et non transférable</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>4. Utilisation acceptable</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>Il est interdit d'utiliser Connect pour :</p>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24, marginTop: 12 }}>
                        <li>Envoyer du spam ou des messages non sollicités</li>
                        <li>Violer les politiques de WhatsApp ou Meta</li>
                        <li>Collecter des données personnelles sans consentement</li>
                        <li>Diffuser des contenus illégaux, haineux ou trompeurs</li>
                        <li>Tenter de contourner les mesures de sécurité</li>
                        <li>Revendre ou redistribuer le service sans autorisation</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>5. Tarification et paiement</h2>
                    <ul style={{ lineHeight: 2, color: '#444', paddingLeft: 24 }}>
                        <li>Les tarifs sont affichés en USD et peuvent varier selon le forfait</li>
                        <li>Les abonnements sont facturés mensuellement ou annuellement</li>
                        <li>Les paiements sont non remboursables sauf mention contraire</li>
                        <li>Nous nous réservons le droit de modifier les tarifs avec un préavis de 30 jours</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>6. Propriété intellectuelle</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Connect, son code source, son design et son contenu sont la propriété exclusive de Wozif Technologies. Vous bénéficiez d'une licence d'utilisation limitée, non exclusive et révocable pour la durée de votre abonnement.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>7. Limitation de responsabilité</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Connect est fourni "tel quel". Nous ne garantissons pas un fonctionnement ininterrompu ou exempt d'erreurs. Notre responsabilité est limitée au montant des sommes versées au cours des 12 derniers mois.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>8. Résiliation</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Vous pouvez résilier votre compte à tout moment depuis les paramètres. Nous pouvons suspendre ou résilier votre compte en cas de violation des CGU, sans préavis ni remboursement.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>9. Modifications des CGU</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nous pouvons modifier ces CGU à tout moment. Les modifications importantes vous seront notifiées par email. La poursuite de l'utilisation après modification vaut acceptation des nouvelles CGU.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>10. Droit applicable</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Ces CGU sont régies par le droit ivoirien. Tout litige sera soumis aux tribunaux compétents d'Abidjan, Côte d'Ivoire.
                    </p>
                    <p style={{ lineHeight: 1.8, color: '#444', marginTop: 24 }}>
                        Pour toute question : legal@wozif.com
                    </p>
                </section>
            </div>
        </main>
    );
}
