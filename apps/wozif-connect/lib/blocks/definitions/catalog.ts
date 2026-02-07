import { ShoppingCart } from "lucide-react";
import { BlockConfig } from "../types";

export const CatalogBlock: BlockConfig = {
    type: "show_catalog",
    name: "Envoyer Catalogue",
    description: "Affiche vos produits et services disponibles sur WhatsApp",
    category: "ecommerce",
    bgColor: "#6366f1",
    icon: ShoppingCart,
    subBlocks: [
        {
            id: "title",
            title: "Titre du catalogue",
            type: "short-input",
            defaultValue: "Notre Catalogue",
        },
        {
            id: "filter_category",
            title: "Filtrer par catégorie (Optionnel)",
            type: "short-input",
        },
    ],
    inputs: {},
    outputs: {
        selected_product: { type: "json", description: "Le produit choisi par l'utilisateur" },
    },
};
