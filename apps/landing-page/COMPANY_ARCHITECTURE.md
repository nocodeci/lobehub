# 🏢 Architecture Multi-Produits - Entreprise

## Vision

Créer une entreprise technologique africaine qui développe et gère plusieurs applications web SaaS, sur le modèle d'Axa Zara.

## Structure de l'Entreprise

### Nom de l'entreprise (à définir)
Suggestions :
- **AfriTech Labs**
- **Wozif Technologies**
- **Harmonia Digital**
- **Savana Tech**

### Produits Prévus

1. **AfriFlow** (Actuel)
   - Orchestrateur de paiements africains
   - URL : afriflow.io / afriflow.com
   - Status : En développement

2. **[Produit 2]** (À définir)
   - Description : ...
   - URL : ...
   - Status : Planifié

3. **[Produit 3]** (À définir)
   - Description : ...
   - URL : ...
   - Status : Planifié

## Architecture Technique

### 1. Site Vitrine Principal
**URL** : `votreentreprise.com`

**Structure** :
```
/                    → Page d'accueil (présentation de l'entreprise)
/products            → Liste de tous les produits
/products/afriflow   → Page détaillée AfriFlow
/products/[autre]    → Pages des autres produits
/about               → À propos de l'entreprise
/careers             → Carrières / Recrutement
/newsroom            → Actualités
/contact             → Contact
/partners            → Partenaires
```

### 2. Système de Compte Unifié (SSO)
**URL** : `account.votreentreprise.com`

**Fonctionnalités** :
- Inscription / Connexion unique pour tous les produits
- Gestion de profil centralisée
- OAuth2 / OpenID Connect
- Tableau de bord multi-produits
- Facturation unifiée (optionnel)

### 3. Applications Produits
Chaque produit a son propre sous-domaine :
- `afriflow.votreentreprise.com` ou `afriflow.io`
- `[produit2].votreentreprise.com`
- etc.

### 4. Infrastructure Commune

#### Services Partagés
- **Authentication Service** : Keycloak / Auth0 / Custom
- **Email Service** : Transactionnel (comme Mailzeet d'Axa Zara)
- **Analytics** : Suivi unifié
- **Support** : `support.votreentreprise.com`
- **Status Page** : `status.votreentreprise.com`
- **Documentation** : `docs.votreentreprise.com`

## Stack Technique Recommandée

### Frontend
- **Site Vitrine** : Next.js 15 (App Router)
- **Produits** : Next.js / React (selon les besoins)
- **Design System** : Composants partagés entre produits
- **Styling** : Tailwind CSS

### Backend
- **API Gateway** : Kong / Nginx
- **Auth** : Keycloak (open-source) ou Auth0
- **Databases** : PostgreSQL (par produit)
- **Cache** : Redis
- **Queue** : BullMQ / RabbitMQ

### Infrastructure
- **Hosting** : Vercel (frontend) + Railway/Render (backend)
- **CDN** : Cloudflare
- **Monitoring** : Sentry + Uptime Robot
- **CI/CD** : GitHub Actions

## Modèle de Monorepo

```
wozif-technologies/
├── apps/
│   ├── main-website/          # Site vitrine principal
│   ├── account-portal/        # Portail de compte unifié
│   ├── afriflow/              # Application AfriFlow (actuelle)
│   ├── [produit2]/            # Futur produit
│   └── [produit3]/            # Futur produit
├── packages/
│   ├── ui/                    # Design system partagé
│   ├── auth/                  # Logique d'authentification
│   ├── database/              # Schémas Prisma partagés
│   ├── email/                 # Templates emails
│   └── utils/                 # Utilitaires communs
├── services/
│   ├── api-gateway/           # Gateway central
│   ├── auth-service/          # Service d'authentification
│   └── email-service/         # Service d'emails
└── docs/
    ├── architecture/
    ├── brand/                 # Charte graphique
    └── products/
```

## Branding

### Identité Visuelle
- Logo principal de l'entreprise
- Palette de couleurs corporate
- Typographie
- Guidelines de marque

### Sous-marques Produits
Chaque produit a :
- Son propre logo
- Sa palette de couleurs
- Son identité tout en restant cohérent avec la marque mère

## Roadmap de Développement

### Phase 1 : Fondations (Actuel)
- ✅ Développement d'AfriFlow
- ⏳ Finalisation des fonctionnalités core
- ⏳ Tests et déploiement

### Phase 2 : Infrastructure Entreprise (3-6 mois)
- [ ] Création du site vitrine principal
- [ ] Mise en place du système SSO
- [ ] Design system unifié
- [ ] Infrastructure de monitoring

### Phase 3 : Expansion (6-12 mois)
- [ ] Lancement d'AfriFlow en production
- [ ] Développement du produit 2
- [ ] Marketing et acquisition

### Phase 4 : Scaling (12+ mois)
- [ ] Produits 3, 4, 5...
- [ ] Équipe élargie
- [ ] Levée de fonds (optionnel)

## Exemples Inspirants

### Axa Zara
- **Chariow** : Vente de produits digitaux
- **Tribbut** : Monétisation de communautés
- **Zeyow** : Cartes virtuelles
- **Moneroo** : Paiements (similaire à AfriFlow)
- **Mailzeet** : Emails transactionnels

### Autres
- **37signals** : Basecamp, HEY, etc.
- **Automattic** : WordPress.com, Tumblr, etc.
- **Notion Labs** : Notion (mono-produit mais extensible)

## Prochaines Actions Immédiates

1. **Choisir le nom de l'entreprise**
2. **Définir l'identité visuelle**
3. **Créer le site vitrine principal**
4. **Mettre en place le système SSO**
5. **Migrer AfriFlow dans la nouvelle structure**

## Questions à Répondre

1. Quel nom pour l'entreprise ?
2. Quels autres produits envisages-tu ?
3. Veux-tu un monorepo ou des repos séparés ?
4. Quel est ton budget infrastructure ?
5. Combien de personnes dans l'équipe ?
