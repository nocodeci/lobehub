"use client";

import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";

const sections = [
    {
        title: "1. Objet",
        content: `Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation des services proposés par Wozif (ci-après « la Plateforme »), ainsi que de définir les droits et obligations des parties dans ce cadre.

En accédant et en utilisant la Plateforme, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.`,
    },
    {
        title: "2. Définitions",
        content: `**« Wozif »** désigne la société éditrice de la Plateforme, basée à Abidjan, Côte d'Ivoire.

**« Utilisateur »** désigne toute personne physique ou morale accédant à la Plateforme et utilisant les services proposés.

**« Services »** désigne l'ensemble des fonctionnalités proposées par Wozif, incluant notamment :
- **Connect** : solution d'automatisation WhatsApp avec intelligence artificielle
- **Gnata** : service de création de sites web
- **AfriFlow** : orchestrateur de paiements africain`,
    },
    {
        title: "3. Accès aux services",
        content: `L'accès à certains services nécessite la création d'un compte utilisateur. L'Utilisateur s'engage à fournir des informations exactes et à jour lors de son inscription.

L'Utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée depuis son compte.

Wozif se réserve le droit de suspendre ou de supprimer un compte en cas de violation des présentes CGU.`,
    },
    {
        title: "4. Utilisation des services",
        content: `L'Utilisateur s'engage à utiliser les services de manière conforme aux lois et réglementations en vigueur. Il est notamment interdit de :

- Utiliser les services à des fins illicites ou frauduleuses
- Transmettre des contenus illégaux, diffamatoires ou portant atteinte aux droits de tiers
- Tenter de compromettre la sécurité ou l'intégrité de la Plateforme
- Utiliser les services pour envoyer des messages non sollicités (spam)
- Revendre ou redistribuer les services sans autorisation préalable`,
    },
    {
        title: "5. Tarification et paiement",
        content: `Les tarifs des services sont indiqués sur la Plateforme et peuvent être modifiés à tout moment. Toute modification tarifaire sera communiquée aux Utilisateurs avec un préavis raisonnable.

**Connect** : tarification selon le plan choisi (gratuit, starter, pro, business, enterprise).

**Gnata** : à partir de 50 000 FCFA pour un site vitrine.

**AfriFlow** : commission de 2% par transaction réussie, sans frais mensuels ni minimum de transactions.

Les paiements sont effectués via les moyens de paiement acceptés sur la Plateforme (Mobile Money, carte bancaire).`,
    },
    {
        title: "6. Propriété intellectuelle",
        content: `L'ensemble des éléments de la Plateforme (textes, images, logos, logiciels, bases de données) sont protégés par le droit de la propriété intellectuelle et restent la propriété exclusive de Wozif.

Toute reproduction, représentation ou exploitation non autorisée de ces éléments est strictement interdite.

L'Utilisateur conserve la propriété de ses données et contenus transmis via la Plateforme.`,
    },
    {
        title: "7. Responsabilité",
        content: `Wozif s'engage à fournir ses services avec diligence et professionnalisme. Toutefois, Wozif ne saurait être tenu responsable :

- Des interruptions temporaires de service pour maintenance ou mise à jour
- Des dommages résultant d'une utilisation non conforme des services
- Des pertes de données résultant d'un cas de force majeure
- Des contenus publiés par les Utilisateurs via la Plateforme

La responsabilité de Wozif est limitée au montant des sommes effectivement versées par l'Utilisateur au cours des 12 derniers mois.`,
    },
    {
        title: "8. Protection des données",
        content: `Wozif s'engage à protéger les données personnelles de ses Utilisateurs conformément à sa Politique de Confidentialité et aux réglementations applicables en matière de protection des données.

Pour plus d'informations, veuillez consulter notre Politique de Confidentialité.`,
    },
    {
        title: "9. Résiliation",
        content: `L'Utilisateur peut résilier son compte à tout moment en contactant le support Wozif.

Wozif se réserve le droit de résilier ou suspendre l'accès d'un Utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité.

En cas de résiliation, l'Utilisateur conserve l'accès à ses données pendant une période de 30 jours, après quoi elles seront supprimées.`,
    },
    {
        title: "10. Modification des CGU",
        content: `Wozif se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la Plateforme.

L'Utilisateur sera informé de toute modification substantielle par email ou notification sur la Plateforme.`,
    },
    {
        title: "11. Droit applicable et juridiction",
        content: `Les présentes CGU sont régies par le droit ivoirien.

En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents d'Abidjan, Côte d'Ivoire.`,
    },
    {
        title: "12. Contact",
        content: `Pour toute question relative aux présentes CGU, vous pouvez nous contacter :

- **Email** : contact@wozif.com
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

export default function ConditionsPage() {
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
                        Conditions Générales d&apos;Utilisation
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Veuillez lire attentivement les conditions suivantes avant d&apos;utiliser nos services.
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
