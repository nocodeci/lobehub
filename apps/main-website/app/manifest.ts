import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Wozif — Solutions numériques intelligentes pour l'Afrique",
        short_name: "Wozif",
        description: "Automatisation WhatsApp avec IA, création de sites web, et paiements Mobile Money pour les entreprises africaines.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1a1a1a",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
