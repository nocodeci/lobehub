import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Mentions Légales | Connect by Wozif",
    description: "Mentions légales et informations juridiques de Connect by Wozif, plateforme d'automatisation WhatsApp avec intelligence artificielle.",
    robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#fff', padding: '120px 24px 80px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 40 }}>Mentions Légales</h1>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Éditeur du site</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        <strong>Wozif Technologies</strong><br />
                        Siège social : Abidjan, Côte d'Ivoire<br />
                        Email : contact@wozif.com<br />
                        Téléphone : +225 XX XX XX XX XX<br />
                        Directeur de la publication : [Nom du responsable]
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Hébergement</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Le site Connect est hébergé par :<br />
                        <strong>Vercel Inc.</strong><br />
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789, USA<br />
                        https://vercel.com
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Propriété intellectuelle</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) est la propriété exclusive de Wozif Technologies ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                    </p>
                    <p style={{ lineHeight: 1.8, color: '#444', marginTop: 16 }}>
                        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Wozif Technologies.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Données personnelles</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ces droits, veuillez nous contacter à l'adresse : privacy@wozif.com
                    </p>
                </section>

                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Cookies</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation des cookies conformément à notre politique de confidentialité.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Contact</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Pour toute question concernant ces mentions légales, vous pouvez nous contacter :<br />
                        Email : legal@wozif.com
                    </p>
                </section>
            </div>
        </main>
    );
}
