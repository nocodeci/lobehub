'use client';

import {
    Flexbox,
    Button,
} from '@lobehub/ui';
import { Typography, Card, Tag, Divider, Avatar } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    ArrowLeft,
    Share2,
    Bookmark,
    ThumbsUp,
    MessageCircle,
    ChevronRight,
    Twitter,
    Linkedin,
    Facebook,
    Link2,
    User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Paragraph, Text } = Typography;

const useStyles = createStyles(({ css }) => ({
    main: css`
        background: #fff;
        min-height: 100vh;
        color: #000;
    `,
    heroImage: css`
        width: 100%;
        height: 500px;
        object-fit: cover;
        @media (max-width: 768px) {
            height: 300px;
        }
    `,
    container: css`
        width: 100%;
        max-width: 800px;
        padding: 0 24px;
        margin: 0 auto;
    `,
    wideContainer: css`
        width: 100%;
        max-width: 1200px;
        padding: 0 24px;
        margin: 0 auto;
    `,
    backLink: css`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-weight: 600;
        text-decoration: none;
        margin-bottom: 32px;
        transition: color 0.2s;
        &:hover {
            color: #075e54;
        }
    `,
    articleHeader: css`
        margin-top: -120px;
        background: #fff;
        border-radius: 32px 32px 0 0;
        padding: 48px 48px 32px;
        position: relative;
        z-index: 10;
        @media (max-width: 768px) {
            margin-top: -60px;
            padding: 32px 24px 24px;
            border-radius: 24px 24px 0 0;
        }
    `,
    categoryTag: css`
        background: rgba(7, 94, 84, 0.1);
        border: none;
        color: #075e54;
        font-weight: 700;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 13px;
    `,
    articleContent: css`
        padding: 0 48px 60px;
        font-size: 18px;
        line-height: 1.9;
        color: #333;
        
        h2 {
            font-size: 28px;
            font-weight: 800;
            margin: 48px 0 24px;
            color: #000;
        }
        
        h3 {
            font-size: 22px;
            font-weight: 700;
            margin: 36px 0 16px;
            color: #000;
        }
        
        p {
            margin-bottom: 24px;
        }
        
        ul, ol {
            margin: 24px 0;
            padding-left: 24px;
        }
        
        li {
            margin-bottom: 12px;
        }
        
        blockquote {
            border-left: 4px solid #075e54;
            padding-left: 24px;
            margin: 32px 0;
            font-style: italic;
            color: #555;
            background: #f8f9fa;
            padding: 24px;
            border-radius: 0 16px 16px 0;
        }
        
        code {
            background: #f1f3f5;
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Monaco', monospace;
            font-size: 15px;
        }
        
        img {
            width: 100%;
            border-radius: 16px;
            margin: 32px 0;
        }
        
        @media (max-width: 768px) {
            padding: 0 24px 40px;
            font-size: 16px;
        }
    `,
    authorCard: css`
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background: #f8f9fa;
        border-radius: 16px;
        margin: 48px 0;
    `,
    shareBar: css`
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin: 32px 0;
    `,
    shareBtn: css`
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f3f5;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        &:hover {
            background: #075e54;
            color: #fff;
        }
    `,
    relatedGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin: 40px 0 80px;
    `,
    relatedCard: css`
        border-radius: 20px;
        border: 1px solid rgba(0,0,0,0.06);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        &:hover {
            transform: translateY(-4px);
            border-color: #075e54;
            box-shadow: 0 16px 32px rgba(7, 94, 84, 0.1);
        }
    `,
    relatedImage: css`
        width: 100%;
        height: 180px;
        object-fit: cover;
    `,
    tableOfContents: css`
        position: sticky;
        top: 100px;
        background: #f8f9fa;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
    `,
    tocItem: css`
        display: block;
        padding: 8px 0;
        color: #666;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s;
        &:hover {
            color: #075e54;
        }
    `,
}));

// Données des articles
const articles: Record<string, {
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author: { name: string; role: string; avatar: string };
    content: string;
    toc: { id: string; title: string }[];
}> = {
    'ia-experience-client-whatsapp': {
        slug: 'ia-experience-client-whatsapp',
        title: "L'IA au service de l'Expérience Client sur WhatsApp",
        description: "Comment les agents intelligents transforment radicalement la manière dont les entreprises interagissent avec leurs clients.",
        category: "Intelligence Artificielle",
        date: "8 Fév 2026",
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "Introduction" },
            { id: "revolution-ia", title: "La révolution de l'IA conversationnelle" },
            { id: "avantages", title: "Les avantages clés" },
            { id: "implementation", title: "Comment implémenter un agent IA" },
            { id: "cas-usage", title: "Cas d'usage concrets" },
            { id: "conclusion", title: "Conclusion" },
        ],
        content: `
## Introduction {#introduction}

L'expérience client est devenue le champ de bataille principal pour les entreprises modernes. Dans un monde où les consommateurs attendent des réponses instantanées, **WhatsApp s'est imposé comme le canal de communication privilégié** avec plus de 2 milliards d'utilisateurs actifs.

Mais comment répondre à des milliers de messages simultanément sans sacrifier la qualité ? La réponse : **l'Intelligence Artificielle**.

## La révolution de l'IA conversationnelle {#revolution-ia}

Les agents IA ne sont plus de simples chatbots à réponses prédéfinies. Grâce aux avancées en traitement du langage naturel (NLP) et aux modèles de langage comme GPT-4, Claude et Gemini, ces agents peuvent :

- **Comprendre le contexte** d'une conversation
- **Adapter leur ton** selon l'interlocuteur
- **Résoudre des problèmes complexes** de manière autonome
- **Apprendre de chaque interaction** pour s'améliorer

> "Un agent IA bien configuré peut gérer 90% des demandes clients sans intervention humaine, tout en maintenant un taux de satisfaction supérieur à 95%."

## Les avantages clés {#avantages}

### 1. Disponibilité 24/7

Vos clients ne dorment pas tous aux mêmes heures. Un agent IA répond instantanément, que ce soit à 3h du matin ou pendant les fêtes.

### 2. Réduction des coûts

- **Jusqu'à -70%** sur les coûts de service client
- Pas de turnover ni de formation continue
- Scalabilité instantanée selon la demande

### 3. Cohérence des réponses

Chaque client reçoit une réponse de qualité constante, sans les variations liées à la fatigue ou à l'humeur d'un agent humain.

### 4. Collecte de données précieuses

L'IA analyse chaque conversation pour identifier :
- Les questions fréquentes
- Les points de friction
- Les opportunités de vente

## Comment implémenter un agent IA {#implementation}

### Étape 1 : Définir les objectifs

Avant tout, identifiez clairement ce que vous attendez de votre agent :
- Support client de premier niveau ?
- Qualification de leads ?
- Prise de rendez-vous ?
- Vente directe ?

### Étape 2 : Entraîner votre agent

Avec Connect, vous pouvez entraîner votre agent en quelques étapes simples :

1. **Importez votre base de connaissances** (FAQ, documents, historique)
2. **Définissez la personnalité** de l'agent (ton, style, limites)
3. **Testez et affinez** les réponses
4. **Déployez progressivement** avec supervision humaine

### Étape 3 : Optimiser en continu

L'IA s'améliore avec le temps. Analysez régulièrement :
- Les conversations escaladées à des humains
- Les taux de résolution au premier contact
- La satisfaction client (CSAT, NPS)

## Cas d'usage concrets {#cas-usage}

### E-commerce : Boutique Mode CI

Une boutique de mode ivoirienne a implémenté un agent Connect pour gérer les commandes WhatsApp. Résultats après 3 mois :
- **+150%** de commandes traitées
- **-60%** de temps de réponse moyen
- **+25%** de taux de conversion

### Services : Cabinet comptable

Un cabinet de Dakar utilise l'IA pour :
- Répondre aux questions sur les délais fiscaux
- Prendre des rendez-vous
- Collecter les documents nécessaires

Gain de temps estimé : **15 heures par semaine**.

### Restaurant : Livraison Abidjan

Un service de livraison gère 500+ commandes quotidiennes via WhatsApp. L'agent IA :
- Prend les commandes
- Suggère des plats complémentaires (+18% de panier moyen)
- Envoie les confirmations et suivis

## Conclusion {#conclusion}

L'IA n'est plus un luxe réservé aux grandes entreprises. Avec des solutions comme Connect, **toute entreprise peut transformer son expérience client** sur WhatsApp.

Les bénéfices sont clairs :
- Réponses instantanées 24/7
- Réduction significative des coûts
- Amélioration de la satisfaction client
- Données précieuses pour la croissance

**Prêt à franchir le pas ?** Créez votre premier agent IA gratuitement sur Connect.
        `
    },
    'automatisation-agents-autonomes': {
        slug: 'automatisation-agents-autonomes',
        title: "Automatisation 2.0 : L'ère des agents autonomes",
        description: "Découvrez comment l'orchestration multi-agents révolutionne les processus métiers complexes sans intervention humaine.",
        category: "Innovation",
        date: "5 Fév 2026",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "L'évolution de l'automatisation" },
            { id: "multi-agents", title: "L'orchestration multi-agents" },
            { id: "applications", title: "Applications pratiques" },
            { id: "futur", title: "Le futur de l'automatisation" },
        ],
        content: `
## L'évolution de l'automatisation {#introduction}

L'automatisation a parcouru un long chemin. Des simples macros Excel aux workflows complexes, nous entrons maintenant dans **l'ère des agents autonomes** capables de prendre des décisions et d'exécuter des tâches sans supervision constante.

Cette nouvelle génération d'automatisation ne se contente plus de suivre des règles prédéfinies. Elle **comprend, analyse et adapte** son comportement en fonction du contexte.

## L'orchestration multi-agents {#multi-agents}

Imaginez une équipe d'agents IA, chacun spécialisé dans un domaine :

- **Agent Commercial** : Qualifie les leads et répond aux questions produit
- **Agent Support** : Résout les problèmes techniques
- **Agent Administratif** : Gère les rendez-vous et la documentation
- **Agent Analyste** : Compile les données et génère des rapports

Ces agents peuvent **collaborer entre eux**, se transférer des tâches et escalader intelligemment vers des humains quand nécessaire.

### Comment ça fonctionne ?

1. Un message arrive sur WhatsApp
2. L'agent routeur analyse l'intention
3. Le message est dirigé vers l'agent spécialisé approprié
4. Si nécessaire, plusieurs agents collaborent
5. La réponse finale est envoyée au client

## Applications pratiques {#applications}

### Gestion complète d'une commande

Un seul message client peut déclencher :
- Vérification du stock (Agent Logistique)
- Calcul du prix avec promotions (Agent Commercial)
- Planification de la livraison (Agent Planning)
- Envoi de la confirmation (Agent Communication)

### Support technique multiniveau

- **Niveau 1** : FAQ et problèmes courants (Agent IA)
- **Niveau 2** : Diagnostic approfondi (Agent Technique IA)
- **Niveau 3** : Escalade humaine avec contexte complet

## Le futur de l'automatisation {#futur}

D'ici 2027, nous prévoyons que :

- **80%** des interactions client seront gérées par des agents IA
- Les agents pourront exécuter des tâches dans plusieurs systèmes simultanément
- L'apprentissage continu permettra une amélioration automatique des performances

**Connect vous prépare à ce futur dès aujourd'hui.**
        `
    },
    'guide-whatsapp-collect': {
        slug: 'guide-whatsapp-collect',
        title: "Guide complet : WhatsApp Collect pour votre business",
        description: "Tout ce qu'il faut savoir pour mettre en place une collecte de données performante directement via WhatsApp.",
        category: "Tutoriel",
        date: "2 Fév 2026",
        readTime: "12 min",
        image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "Qu'est-ce que WhatsApp Collect ?" },
            { id: "configuration", title: "Configuration pas à pas" },
            { id: "formulaires", title: "Créer des formulaires efficaces" },
            { id: "integration", title: "Intégration avec vos outils" },
            { id: "bonnes-pratiques", title: "Bonnes pratiques" },
        ],
        content: `
## Qu'est-ce que WhatsApp Collect ? {#introduction}

WhatsApp Collect est une fonctionnalité puissante qui vous permet de **collecter des données structurées** directement dans vos conversations WhatsApp. Fini les formulaires web que personne ne remplit !

Avec WhatsApp Collect, vous pouvez :
- Créer des enquêtes de satisfaction
- Collecter des informations client
- Générer des leads qualifiés
- Prendre des commandes détaillées

Le taux de complétion est **3x supérieur** aux formulaires traditionnels.

## Configuration pas à pas {#configuration}

### Étape 1 : Créer votre premier formulaire

Dans votre dashboard Connect :
1. Allez dans "Collecte de données"
2. Cliquez sur "Nouveau formulaire"
3. Choisissez un template ou partez de zéro

### Étape 2 : Définir les champs

Types de champs disponibles :
- **Texte libre** : Nom, email, commentaires
- **Choix unique** : Oui/Non, catégorie
- **Choix multiple** : Plusieurs options
- **Date/Heure** : Rendez-vous, anniversaire
- **Numéro** : Quantité, montant
- **Localisation** : Adresse de livraison
- **Fichier** : Photos, documents

### Étape 3 : Configurer le déclencheur

Le formulaire peut être déclenché par :
- Un mot-clé spécifique
- Une action de l'agent IA
- Un bouton dans un message
- Un lien partagé

## Créer des formulaires efficaces {#formulaires}

### Règle d'or : Moins c'est plus

Limitez-vous à **5-7 questions maximum**. Chaque question supplémentaire réduit le taux de complétion de 10%.

### Utilisez la logique conditionnelle

Affichez certaines questions uniquement si nécessaire :
- "Avez-vous déjà un compte ?" → Si oui, demandez le numéro client
- "Mode de livraison ?" → Si domicile, demandez l'adresse

### Personnalisez les messages

Au lieu de "Question 1/5", utilisez :
"Super ! Maintenant, dites-nous comment vous avez entendu parler de nous 😊"

## Intégration avec vos outils {#integration}

Connect s'intègre nativement avec :

- **Google Sheets** : Export automatique des réponses
- **Airtable** : Base de données en temps réel
- **HubSpot** : Création automatique de contacts
- **Notion** : Documentation centralisée
- **Zapier** : Connexion à 5000+ applications

### Exemple d'intégration

Collecte de lead → Google Sheets → Notification Slack → Création contact HubSpot → Email de bienvenue

Tout cela **automatiquement**, sans intervention humaine.

## Bonnes pratiques {#bonnes-pratiques}

1. **Testez sur mobile** : 95% de vos utilisateurs seront sur smartphone
2. **Confirmez les soumissions** : Envoyez toujours un récapitulatif
3. **Respectez la RGPD** : Demandez le consentement explicite
4. **Analysez les abandons** : Identifiez les questions problématiques
5. **Itérez régulièrement** : Optimisez en fonction des données

**Prêt à booster votre collecte de données ?** Commencez gratuitement avec Connect.
        `
    },
    'erreurs-automatisation-whatsapp': {
        slug: 'erreurs-automatisation-whatsapp',
        title: "5 erreurs à éviter avec l'automatisation WhatsApp",
        description: "Les pièges courants qui peuvent nuire à votre relation client et comment les éviter.",
        category: "Conseils",
        date: "28 Jan 2026",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "Introduction" },
            { id: "erreur-1", title: "Erreur 1 : Trop automatiser" },
            { id: "erreur-2", title: "Erreur 2 : Ignorer le contexte" },
            { id: "erreur-3", title: "Erreur 3 : Négliger le suivi" },
            { id: "erreur-4", title: "Erreur 4 : Oublier la personnalisation" },
            { id: "erreur-5", title: "Erreur 5 : Ne pas tester" },
        ],
        content: `
## Introduction {#introduction}

L'automatisation WhatsApp peut transformer votre relation client... ou la détruire. Voici les **5 erreurs les plus courantes** que nous voyons chez les entreprises, et surtout, comment les éviter.

## Erreur 1 : Trop automatiser {#erreur-1}

### Le problème

Certaines entreprises veulent tout automatiser, même les conversations qui nécessitent une touche humaine. Résultat : des clients frustrés qui se sentent parler à un mur.

### La solution

- Automatisez les tâches répétitives (FAQ, confirmation de commande)
- Gardez l'humain pour les réclamations et les négociations
- Configurez une escalade intelligente vers vos équipes

> "L'automatisation doit libérer du temps pour l'humain, pas le remplacer complètement."

## Erreur 2 : Ignorer le contexte conversationnel {#erreur-2}

### Le problème

Un client pose une question, puis une autre liée. Si votre bot traite chaque message isolément, la conversation devient absurde.

### La solution

- Utilisez un agent IA qui maintient le **contexte de la conversation**
- Configurez une mémoire de session (Connect le fait automatiquement)
- Permettez à l'IA de référencer les messages précédents

## Erreur 3 : Négliger le suivi post-conversation {#erreur-3}

### Le problème

La conversation se termine, et c'est fini. Aucun suivi, aucune analyse, aucune amélioration.

### La solution

- Envoyez un **questionnaire de satisfaction** après chaque interaction
- Analysez les conversations pour identifier les patterns
- Créez des rapports hebdomadaires sur les performances

## Erreur 4 : Oublier la personnalisation {#erreur-4}

### Le problème

"Bonjour cher client valued customer #12847". Ce genre de message impersonnel tue l'engagement.

### La solution

- Utilisez le **prénom du client** dès le premier message
- Adaptez le ton selon l'historique (nouveau client vs fidèle)
- Référencez les interactions passées quand c'est pertinent

## Erreur 5 : Ne pas tester avant de déployer {#erreur-5}

### Le problème

Vous configurez votre agent IA et vous le lancez en production. Les bugs apparaissent en temps réel, devant vos clients.

### La solution

1. Testez chaque scénario manuellement
2. Faites un déploiement progressif (10% → 50% → 100%)
3. Surveillez les métriques les premiers jours
4. Préparez un plan de rollback

## Conclusion

Ces erreurs sont évitables avec une bonne préparation. Chez Connect, nous vous accompagnons pour configurer une automatisation qui **enchante** vos clients plutôt que de les frustrer.

**Besoin d'aide ?** Contactez notre équipe pour un audit gratuit de votre automatisation.
        `
    },
    'roi-automatisation-whatsapp': {
        slug: 'roi-automatisation-whatsapp',
        title: "ROI de l'automatisation WhatsApp : étude de cas",
        description: "Analyse détaillée du retour sur investissement de 10 entreprises ayant adopté Connect.",
        category: "Études de cas",
        date: "25 Jan 2026",
        readTime: "10 min",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "Introduction" },
            { id: "methodologie", title: "Méthodologie" },
            { id: "resultats", title: "Résultats globaux" },
            { id: "cas-1", title: "Cas 1 : E-commerce" },
            { id: "cas-2", title: "Cas 2 : Services" },
            { id: "conclusion", title: "Conclusion" },
        ],
        content: `
## Introduction {#introduction}

L'automatisation WhatsApp représente-t-elle un bon investissement ? Pour répondre à cette question, nous avons analysé **10 entreprises** utilisant Connect depuis plus de 6 mois.

Les résultats parlent d'eux-mêmes.

## Méthodologie {#methodologie}

### Entreprises analysées

- **5 e-commerces** (mode, électronique, alimentaire)
- **3 entreprises de services** (comptabilité, immobilier, formation)
- **2 restaurants/livraison**

### Métriques mesurées

- Temps de réponse moyen
- Taux de résolution au premier contact
- Coût par interaction
- Satisfaction client (CSAT)
- Chiffre d'affaires généré via WhatsApp

## Résultats globaux {#resultats}

| Métrique | Avant Connect | Après Connect | Évolution |
|----------|---------------|---------------|-----------|
| Temps de réponse | 4h 23min | 2 min | **-98%** |
| Résolution 1er contact | 45% | 78% | **+73%** |
| Coût par interaction | 2,50€ | 0,35€ | **-86%** |
| CSAT | 3.2/5 | 4.6/5 | **+44%** |

### ROI moyen

Sur l'ensemble des entreprises, le **ROI moyen est de 847%** sur 6 mois. En d'autres termes, pour chaque euro investi dans Connect, les entreprises ont récupéré 8,47€.

## Cas 1 : E-commerce Mode Abidjan {#cas-1}

### Contexte

- Boutique de vêtements en ligne
- ~200 messages WhatsApp par jour
- 2 personnes dédiées au service client

### Résultats après 6 mois

- **Commandes via WhatsApp** : +180%
- **Temps moyen de traitement** : de 15 min à 45 sec
- **Équipe réduite** : de 2 à 0,5 personne (supervision uniquement)
- **Économies annuelles** : 18 000€

### Témoignage

> "Avant Connect, on ratait des ventes parce qu'on ne pouvait pas répondre assez vite. Maintenant, les clients commandent à 2h du matin et reçoivent une confirmation instantanée."

## Cas 2 : Cabinet Comptable Dakar {#cas-2}

### Contexte

- Cabinet avec 150 clients actifs
- Questions récurrentes sur les délais fiscaux
- Difficulté à gérer les pics de demandes

### Résultats après 6 mois

- **Questions automatisées** : 85% des demandes
- **Temps libéré** : 15h/semaine pour l'équipe
- **Nouveaux clients** : +25% (grâce à la réactivité)
- **Satisfaction client** : de 3.8 à 4.9/5

### ROI calculé

Investissement Connect : 240€/an
Économies (temps équipe) : 9 600€/an
**ROI : 3 900%**

## Conclusion {#conclusion}

L'automatisation WhatsApp n'est plus un luxe, c'est une nécessité compétitive. Les entreprises qui tardent à adopter ces outils risquent de perdre des clients au profit de concurrents plus réactifs.

### Prochaines étapes

1. **Essayez gratuitement** Connect pendant 14 jours
2. **Analysez vos volumes** actuels de messages WhatsApp
3. **Calculez votre ROI potentiel** avec notre simulateur

**Prêt à multiplier votre ROI ?** Commencez dès aujourd'hui.
        `
    },
    'whatsapp-business-api-vs-cloud-api': {
        slug: 'whatsapp-business-api-vs-cloud-api',
        title: "WhatsApp Business API vs Cloud API : le guide",
        description: "Comprendre les différences et choisir la meilleure option pour votre entreprise.",
        category: "Technique",
        date: "20 Jan 2026",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        author: {
            name: "Équipe Connect",
            role: "Expert en automatisation",
            avatar: "/connect-logo.png"
        },
        toc: [
            { id: "introduction", title: "Introduction" },
            { id: "business-api", title: "WhatsApp Business API (On-Premise)" },
            { id: "cloud-api", title: "WhatsApp Cloud API" },
            { id: "comparaison", title: "Tableau comparatif" },
            { id: "recommandation", title: "Notre recommandation" },
        ],
        content: `
## Introduction {#introduction}

Vous voulez automatiser WhatsApp pour votre entreprise, mais vous êtes perdu entre "Business API" et "Cloud API" ? Ce guide va tout clarifier.

Spoiler : **Connect supporte les deux**, mais voici comment choisir.

## WhatsApp Business API (On-Premise) {#business-api}

### Qu'est-ce que c'est ?

C'est la première API officielle de WhatsApp, lancée en 2018. Elle nécessite d'héberger le client WhatsApp sur vos propres serveurs.

### Avantages

- **Contrôle total** sur vos données
- **Performance optimale** pour les gros volumes
- **Personnalisation avancée** de l'infrastructure

### Inconvénients

- **Complexité technique** : nécessite des DevOps
- **Coûts d'hébergement** : serveurs dédiés
- **Maintenance** : mises à jour manuelles

### Pour qui ?

- Grandes entreprises (>100 000 messages/mois)
- Secteurs réglementés (banque, santé)
- Équipes techniques solides

## WhatsApp Cloud API {#cloud-api}

### Qu'est-ce que c'est ?

Lancée en 2022, c'est une API hébergée par Meta. Pas de serveur à gérer, tout passe par le cloud de Meta.

### Avantages

- **Simplicité** : configuration en quelques clics
- **Pas d'infrastructure** à gérer
- **Mises à jour automatiques**
- **Gratuit** jusqu'à 1000 conversations/mois

### Inconvénients

- **Données chez Meta** (peut poser problème pour certains secteurs)
- **Moins de contrôle** sur la latence
- **Dépendance** vis-à-vis de Meta

### Pour qui ?

- PME et startups
- Entreprises sans équipe technique dédiée
- Projets qui démarrent

## Tableau comparatif {#comparaison}

| Critère | Business API | Cloud API |
|---------|--------------|-----------|
| Hébergement | Vos serveurs | Meta |
| Coût initial | Élevé | Gratuit |
| Complexité | Haute | Faible |
| Contrôle des données | Total | Limité |
| Latence | Optimale | Variable |
| Limite messages | Illimité | 1000 gratuits |
| Temps de setup | Jours/semaines | Minutes |

## Notre recommandation {#recommandation}

### Pour 90% des entreprises : Cloud API

Si vous êtes une PME en Afrique francophone, le **Cloud API est le choix évident** :

1. **Gratuit pour commencer** : testez sans risque
2. **Simple à configurer** : focus sur votre métier
3. **Évolutif** : passez à l'On-Premise plus tard si besoin

### Comment Connect vous aide

Avec Connect, vous n'avez pas à choisir maintenant. Nous gérons :

- La configuration technique
- L'intégration avec votre système
- La migration si vous changez d'avis

**Prêt à vous lancer ?** Créez votre compte Connect et commencez avec le Cloud API. Vous pourrez toujours évoluer plus tard.
        `
    }
};

const BlogDetailPage = () => {
    const { styles, cx } = useStyles();
    const params = useParams();
    const [mounted, setMounted] = useState(false);

    const slug = params?.slug as string;
    const article = articles[slug];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!article) {
        return (
            <main className={styles.main} style={{ paddingTop: 150, textAlign: 'center' }}>
                <Title level={2}>Article non trouvé</Title>
                <Link href="/blog">
                    <Button type="primary" style={{ background: '#075e54' }}>
                        Retour au blog
                    </Button>
                </Link>
            </main>
        );
    }

    const relatedArticles = Object.values(articles).filter(a => a.slug !== slug).slice(0, 3);

    return (
        <main className={styles.main}>
            {/* Hero Image */}
            <motion.img
                src={article.image}
                alt={article.title}
                className={styles.heroImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Article Container */}
            <div className={styles.container}>
                <div className={styles.articleHeader}>
                    {/* Back Link */}
                    <Link href="/blog" className={styles.backLink}>
                        <ArrowLeft size={18} /> Retour au blog
                    </Link>

                    {/* Category & Meta */}
                    <Flexbox gap={16} style={{ marginBottom: 24 }}>
                        <Tag className={styles.categoryTag}>{article.category}</Tag>
                        <Flexbox horizontal gap={16} style={{ color: '#999', fontSize: 14 }}>
                            <Flexbox horizontal align="center" gap={6}>
                                <Calendar size={14} /> {article.date}
                            </Flexbox>
                            <Flexbox horizontal align="center" gap={6}>
                                <Clock size={14} /> {article.readTime} de lecture
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>

                    {/* Title */}
                    <Title level={1} style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.2, marginBottom: 24 }}>
                        {article.title}
                    </Title>

                    {/* Description */}
                    <Paragraph style={{ fontSize: 20, color: '#555', lineHeight: 1.6 }}>
                        {article.description}
                    </Paragraph>

                    {/* Author */}
                    <Flexbox horizontal align="center" gap={16} style={{ marginTop: 32 }}>
                        <Avatar size={48} src={article.author.avatar} icon={<User />} />
                        <div>
                            <Text strong style={{ display: 'block' }}>{article.author.name}</Text>
                            <Text style={{ color: '#999', fontSize: 13 }}>{article.author.role}</Text>
                        </div>
                    </Flexbox>

                    {/* Share Bar */}
                    <div className={styles.shareBar}>
                        <Text style={{ color: '#999', marginRight: 16 }}>Partager :</Text>
                        <button className={styles.shareBtn} onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}>
                            <Twitter size={18} />
                        </button>
                        <button className={styles.shareBtn} onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`, '_blank')}>
                            <Linkedin size={18} />
                        </button>
                        <button className={styles.shareBtn} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                            <Facebook size={18} />
                        </button>
                        <button className={styles.shareBtn} onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Lien copié !');
                        }}>
                            <Link2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Article Content */}
                <div className={styles.articleContent}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content.replace(/\{#\w+\}/g, '')}
                    </ReactMarkdown>
                </div>

                {/* Author Card */}
                <div style={{ padding: '0 48px' }}>
                    <div className={styles.authorCard}>
                        <Avatar size={64} src={article.author.avatar} icon={<User />} />
                        <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: 18, display: 'block' }}>{article.author.name}</Text>
                            <Text style={{ color: '#666' }}>{article.author.role}</Text>
                            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#888', fontSize: 14 }}>
                                L'équipe Connect aide les entreprises africaines à transformer leur relation client avec l'intelligence artificielle.
                            </Paragraph>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 48px', marginBottom: 60 }}>
                    <Card style={{ background: '#075e54', borderRadius: 24, border: 'none', padding: 24, textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#fff', marginBottom: 16 }}>
                            Prêt à transformer votre WhatsApp ?
                        </Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>
                            Créez votre premier agent IA gratuitement. Aucune carte bancaire requise.
                        </Paragraph>
                        <Button
                            size="large"
                            onClick={() => window.location.href = 'https://app.connect.wozif.com'}
                            style={{ fontWeight: 700, borderRadius: 12, height: 52, paddingInline: 40 }}
                        >
                            Commencer gratuitement
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Related Articles */}
            <div className={styles.wideContainer}>
                <Title level={2} style={{ fontWeight: 800, marginBottom: 32 }}>
                    Articles similaires
                </Title>
                <div className={styles.relatedGrid}>
                    {relatedArticles.map((related) => (
                        <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                            <Card className={styles.relatedCard} bodyStyle={{ padding: 20 }}>
                                <img src={related.image} alt={related.title} className={styles.relatedImage} />
                                <Tag style={{ marginTop: 16, background: 'rgba(7, 94, 84, 0.1)', border: 'none', color: '#075e54' }}>
                                    {related.category}
                                </Tag>
                                <Title level={4} style={{ margin: '12px 0 8px', fontWeight: 700, fontSize: 18 }}>
                                    {related.title}
                                </Title>
                                <Flexbox horizontal gap={12} style={{ color: '#999', fontSize: 13 }}>
                                    <span>{related.date}</span>
                                    <span>•</span>
                                    <span>{related.readTime}</span>
                                </Flexbox>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default BlogDetailPage;
