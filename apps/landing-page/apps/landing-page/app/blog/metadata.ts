import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Blog IA & Automatisation WhatsApp | Actualités Connect",
    description: "Articles, guides et tutoriels sur l'automatisation WhatsApp, les agents IA, les chatbots et l'optimisation de la relation client pour les entreprises africaines.",
    keywords: [
        "blog automatisation whatsapp",
        "guide chatbot whatsapp",
        "tutoriel whatsapp business",
        "actualités ia whatsapp",
        "conseils whatsapp entreprise",
        "marketing whatsapp afrique"
    ],
    openGraph: {
        title: "Blog Connect - IA & Automatisation WhatsApp",
        description: "Découvrez nos articles sur l'IA, les chatbots et l'automatisation WhatsApp pour transformer votre business.",
        url: "https://connect.wozif.com/blog",
        type: "website",
        images: [{ url: "/og-blog.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog Connect - IA & Automatisation",
        description: "Guides et actualités sur l'automatisation WhatsApp pour les entreprises.",
    },
    alternates: {
        canonical: "https://connect.wozif.com/blog",
    },
};
