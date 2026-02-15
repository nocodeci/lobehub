"use client";

import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";

const sections = [
    {
        title: "1. Introduction",
        content: `Wozif (ci-après « nous », « notre » ou « Wozif ») s'engage à protéger la vie privée de ses utilisateurs. La présente Politique de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles lorsque vous utilisez nos services.

En utilisant nos services, vous consentez à la collecte et à l'utilisation de vos données conformément à la présente politique.`,
    },
    {
        title: "2. Données collectées",
        content: `Nous collectons les catégories de données suivantes :

**Données d'identification :**
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Nom de l'entreprise

**Données d'utilisation :**
- Historique des conversations (Connect)
- Données de navigation sur la Plateforme
- Adresse IP et type de navigateur
- Pages visitées et durée des sessions

**Données de transaction (AfriFlow) :**
- Montants des transactions
- Méthode de paiement utilisée
- Historique des paiements
- Informations de facturation`,
    },
    {
        title: "3. Finalités du traitement",
        content: `Vos données sont collectées et traitées pour les finalités suivantes :

- Fournir et améliorer nos services (Connect, Gnata, AfriFlow)
- Gérer votre compte utilisateur
- Traiter vos paiements et transactions
- Vous envoyer des communications relatives à nos services
- Assurer la sécurité et prévenir la fraude
- Respecter nos obligations légales et réglementaires
- Analyser l'utilisation de nos services pour les améliorer
- Répondre à vos demandes de support`,
    },
    {
        title: "4. Base légale du traitement",
        content: `Le traitement de vos données repose sur les bases légales suivantes :

- **Exécution du contrat** : le traitement est nécessaire à la fourniture de nos services
- **Consentement** : pour l'envoi de communications marketing
- **Intérêt légitime** : pour l'amélioration de nos services et la prévention de la fraude
- **Obligation légale** : pour le respect des réglementations applicables`,
    },
    {
        title: "5. Partage des données",
        content: `Nous ne vendons jamais vos données personnelles à des tiers.

Vos données peuvent être partagées avec :

- **Prestataires de services** : hébergement, paiement, envoi d'emails (dans le cadre strict de la fourniture de nos services)
- **Opérateurs de paiement** : Orange Money, MTN MoMo, Wave et autres opérateurs Mobile Money (pour le traitement des transactions via AfriFlow)
- **Autorités compétentes** : en cas d'obligation légale ou de réquisition judiciaire

Tous nos prestataires sont soumis à des obligations de confidentialité strictes.`,
    },
    {
        title: "6. Sécurité des données",
        content: `Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :

- Chiffrement des données en transit (TLS 1.3) et au repos
- Authentification forte pour l'accès aux systèmes
- Surveillance continue des accès et des anomalies
- Sauvegardes régulières et plan de reprise d'activité
- Formation de notre équipe aux bonnes pratiques de sécurité
- Tests de sécurité réguliers`,
    },
    {
        title: "7. Conservation des données",
        content: `Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :

- **Données de compte** : pendant la durée de votre inscription, puis 3 ans après la suppression du compte
- **Données de transaction** : 10 ans conformément aux obligations comptables
- **Données de navigation** : 13 mois maximum
- **Données de support** : 3 ans après la clôture du ticket

À l'expiration de ces délais, vos données sont supprimées ou anonymisées.`,
    },
    {
        title: "8. Vos droits",
        content: `Conformément aux réglementations applicables, vous disposez des droits suivants :

- **Droit d'accès** : obtenir une copie de vos données personnelles
- **Droit de rectification** : corriger des données inexactes ou incomplètes
- **Droit de suppression** : demander la suppression de vos données
- **Droit d'opposition** : vous opposer au traitement de vos données
- **Droit à la portabilité** : recevoir vos données dans un format structuré
- **Droit de retrait du consentement** : retirer votre consentement à tout moment

Pour exercer vos droits, contactez-nous à : **privacy@wozif.com**

Nous répondrons à votre demande dans un délai de 30 jours.`,
    },
    {
        title: "9. Cookies",
        content: `Notre Plateforme utilise des cookies pour :

- **Cookies essentiels** : nécessaires au fonctionnement de la Plateforme (authentification, sécurité)
- **Cookies analytiques** : pour comprendre comment vous utilisez nos services
- **Cookies de préférence** : pour mémoriser vos paramètres

Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.`,
    },
    {
        title: "10. Transferts internationaux",
        content: `Vos données sont principalement hébergées en Afrique et en Europe. En cas de transfert vers d'autres pays, nous nous assurons que des garanties appropriées sont mises en place pour protéger vos données.`,
    },
    {
        title: "11. Modifications",
        content: `Nous pouvons modifier la présente Politique de Confidentialité à tout moment. Toute modification substantielle vous sera notifiée par email ou via la Plateforme.

La date de dernière mise à jour est indiquée en bas de cette page.`,
    },
    {
        title: "12. Contact",
        content: `Pour toute question relative à la protection de vos données personnelles :

- **Email** : privacy@wozif.com
- **Email général** : contact@wozif.com
- **Adresse** : Abidjan, Côte d'Ivoire

Dernière mise à jour : Février 2026`,
    },
];

function renderContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        if (line.trim() === "") return <br key={i} />;
        if (line.startsWith("- ")) {
            const content = line.replace("- ", "");
            return (
                <li key={i} className="text-gray-600 ml-6 list-disc" style={{ lineHeight: 1.8 }}>
                    <span dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>') }} />
                </li>
            );
        }
        return (
            <p key={i} className="text-gray-600" style={{ lineHeight: 1.8 }}>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>') }} />
            </p>
        );
    });
}

export default function ConfidentialitePage() {
    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            <section className="w-full pt-32 pb-16 px-4" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        Légal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        Politique de Confidentialité
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Découvrez comment nous protégeons vos données personnelles et respectons votre vie privée.
                    </p>
                </div>
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-20">
                <div className="bg-white rounded-2xl p-8 md:p-12 space-y-10" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ letterSpacing: "-0.01em" }}>
                                {section.title}
                            </h2>
                            <div className="space-y-1">
                                {renderContent(section.content)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <FooterFramer.Responsive />
        </div>
    );
}
