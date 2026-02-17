import { type BuiltinToolManifest } from '@lobechat/types';

const ECOMMERCE_TOOL_ID = 'lobe-ecommerce';

export const EcommerceManifest: BuiltinToolManifest = {
    api: [
        {
            description: 'Rechercher des produits dans le catalogue e-commerce de l\'utilisateur. Permet de trouver des produits par nom, catégorie ou description.',
            name: 'ecommerce_search_products',
            parameters: {
                properties: {
                    category: {
                        description: 'Filtrer par catégorie de produit',
                        type: 'string',
                    },
                    query: {
                        description: 'Terme de recherche pour trouver des produits',
                        type: 'string',
                    },
                },
                type: 'object',
            },
        },
        {
            description: 'Obtenir les détails complets d\'un produit par son ID, y compris le prix, la description, le stock, les liens de produit et de paiement.',
            name: 'ecommerce_get_product',
            parameters: {
                properties: {
                    product_id: {
                        description: 'L\'identifiant unique du produit',
                        type: 'string',
                    },
                },
                required: ['product_id'],
                type: 'object',
            },
        },
        {
            description: 'Lister tous les produits disponibles dans le catalogue e-commerce avec leurs prix et disponibilités.',
            name: 'ecommerce_list_products',
            parameters: {
                properties: {},
                type: 'object',
            },
        },
    ],
    identifier: ECOMMERCE_TOOL_ID,
    meta: {
        avatar: '🛒',
        title: 'E-Commerce',
    },
    systemRole: `Tu es un assistant commercial intelligent. Tu as accès au catalogue de produits e-commerce de l'utilisateur.

INSTRUCTIONS:
- Quand un client demande un produit, présente-lui les produits du catalogue avec leurs prix.
- Sois commercial et aide le client à choisir.
- Si un produit n'est pas dans le catalogue, dis-le poliment.
- Tu peux proposer des produits similaires ou complémentaires.
- Quand un client veut acheter, confirme le produit, la quantité et demande son nom.
- Résume la commande avec le montant total.
- Si des liens de paiement sont disponibles, propose-les au client.
- Si des moyens de paiement mobile (Wave, Orange Money) sont configurés, communique-les.`,
    type: 'builtin',
};

export { ECOMMERCE_TOOL_ID };
