import { Metadata } from 'next';

// Articles data for metadata generation
const articlesMetadata: Record<string, {
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
}> = {
    'ia-experience-client-whatsapp': {
        title: "L'IA au service de l'Expérience Client sur WhatsApp",
        description: "Découvrez comment les agents intelligents transforment radicalement la manière dont les entreprises interagissent avec leurs clients sur WhatsApp. Guide complet avec exemples concrets.",
        image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop",
        category: "Intelligence Artificielle",
        date: "2026-02-08"
    },
    'automatisation-agents-autonomes': {
        title: "Automatisation 2.0 : L'ère des agents autonomes",
        description: "Comment l'orchestration multi-agents révolutionne les processus métiers complexes sans intervention humaine. Explorez le futur de l'automatisation WhatsApp.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        category: "Innovation",
        date: "2026-02-05"
    },
    'guide-whatsapp-collect': {
        title: "Guide complet : WhatsApp Collect pour votre business",
        description: "Tout ce qu'il faut savoir pour mettre en place une collecte de données performante directement via WhatsApp. Configuration, formulaires et intégrations.",
        image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=2070&auto=format&fit=crop",
        category: "Tutoriel",
        date: "2026-02-02"
    },
    'erreurs-automatisation-whatsapp': {
        title: "5 erreurs à éviter avec l'automatisation WhatsApp",
        description: "Les pièges courants qui peuvent nuire à votre relation client et comment les éviter. Conseils pratiques pour une automatisation réussie.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        category: "Conseils",
        date: "2026-01-28"
    },
    'roi-automatisation-whatsapp': {
        title: "ROI de l'automatisation WhatsApp : étude de cas",
        description: "Analyse détaillée du retour sur investissement de 10 entreprises ayant adopté Connect. Données chiffrées et témoignages.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
        category: "Études de cas",
        date: "2026-01-25"
    },
    'whatsapp-business-api-vs-cloud-api': {
        title: "WhatsApp Business API vs Cloud API : le guide",
        description: "Comprendre les différences entre WhatsApp Business API et Cloud API. Comparatif complet pour choisir la meilleure option pour votre entreprise.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        category: "Technique",
        date: "2026-01-20"
    }
};

type Props = {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = articlesMetadata[slug];

    if (!article) {
        return {
            title: 'Article non trouvé | Blog Connect',
            description: 'Cet article n\'existe pas ou a été déplacé.',
        };
    }

    const baseUrl = 'https://connect.wozif.com';
    const articleUrl = `${baseUrl}/blog/${slug}`;

    return {
        title: `${article.title} | Blog Connect`,
        description: article.description,
        keywords: [
            article.category.toLowerCase(),
            'whatsapp automation',
            'agent ia',
            'chatbot whatsapp',
            'automatisation',
            'connect wozif'
        ],
        authors: [{ name: 'Équipe Connect' }],
        openGraph: {
            title: article.title,
            description: article.description,
            url: articleUrl,
            type: 'article',
            publishedTime: article.date,
            authors: ['Équipe Connect'],
            section: article.category,
            images: [
                {
                    url: article.image,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.description,
            images: [article.image],
        },
        alternates: {
            canonical: articleUrl,
        },
    };
}

export function generateStaticParams() {
    return Object.keys(articlesMetadata).map((slug) => ({
        slug,
    }));
}

export default function BlogArticleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
