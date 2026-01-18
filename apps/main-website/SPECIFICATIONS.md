# 🎨 Wozif - Site Vitrine Principal
## Spécifications Techniques et Design

---

## 🎯 Objectif
Créer un site vitrine moderne et professionnel pour présenter l'entreprise Wozif et ses produits (AfriFlow et Gnata).

---

## 📐 Structure du Site

### Pages Principales

#### 1. **Page d'Accueil** (`/`)
**Sections** :
- **Hero Section**
  - Titre : "Solutions digitales pour l'Afrique"
  - Sous-titre : "Créez votre site web en 1h et acceptez tous les paiements africains"
  - CTA : "Découvrir nos produits" + "Créer un compte"
  - Illustration : Animation moderne

- **Statistiques**
  - +150k utilisateurs
  - 2 produits actifs
  - +5 ans d'expérience
  - 18+ pays couverts

- **Nos Produits** (Cards)
  - **Gnata** : Site web en 1h
  - **AfriFlow** : Paiements africains

- **Comment ça marche**
  - Étape 1 : Créez votre compte
  - Étape 2 : Choisissez votre produit
  - Étape 3 : Lancez-vous

- **Témoignages**
  - 3-4 témoignages clients

- **CTA Final**
  - "Prêt à démarrer ?"
  - Bouton : "Créer mon compte gratuitement"

#### 2. **Page Produits** (`/products`)
**Contenu** :
- Liste des 2 produits avec détails
- Comparaison des offres
- Tarification
- FAQ par produit

#### 3. **AfriFlow** (`/products/afriflow`)
**Sections** :
- Hero avec démo interactive
- Fonctionnalités clés
- Providers supportés (logos)
- Pays couverts (carte)
- Tarification
- Documentation API
- CTA : "Commencer avec AfriFlow"

#### 4. **Gnata** (`/products/gnata`)
**Sections** :
- Hero avec exemples de sites
- Processus de création (timeline)
- Types de sites disponibles
- Portfolio de sites créés
- Tarification
- CTA : "Commander mon site"

#### 5. **À Propos** (`/about`)
**Contenu** :
- Histoire de Wozif
- Mission et vision
- Équipe (si applicable)
- Valeurs

#### 6. **Contact** (`/contact`)
**Formulaire** :
- Nom
- Email
- Sujet
- Message
- Bouton : "Envoyer"

**Informations** :
- Email : [email protected]
- Support : support.wozif.com
- Réseaux sociaux

---

## 🎨 Design System

### Palette de Couleurs

**Couleurs Principales** :
```css
--primary: #6366f1        /* Indigo moderne */
--primary-dark: #4f46e5
--primary-light: #818cf8

--secondary: #10b981      /* Emerald (succès) */
--accent: #f59e0b         /* Amber (attention) */

--background: #0f172a     /* Slate dark */
--surface: #1e293b
--card: #334155

--text-primary: #f1f5f9
--text-secondary: #94a3b8
--text-muted: #64748b
```

**Couleurs Produits** :
- **Gnata** : `#8b5cf6` (Purple)
- **AfriFlow** : `#06b6d4` (Cyan)

### Typographie

**Fonts** :
```css
--font-heading: 'Inter', sans-serif
--font-body: 'Inter', sans-serif
--font-mono: 'JetBrains Mono', monospace
```

**Tailles** :
- H1 : 4rem (64px) - Bold, Italic
- H2 : 3rem (48px) - Bold
- H3 : 2rem (32px) - Semibold
- Body : 1rem (16px)
- Small : 0.875rem (14px)

### Composants UI

**Boutons** :
- Primary : Gradient indigo, shadow, hover effect
- Secondary : Outline, transparent background
- Ghost : Transparent, hover background

**Cards** :
- Border : 1px solid rgba(255,255,255,0.1)
- Background : Glassmorphism
- Hover : Scale + glow effect
- Border radius : 24px

**Animations** :
- Fade in on scroll
- Hover effects
- Smooth transitions (300ms)
- Micro-interactions

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router)
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Forms** : React Hook Form + Zod

### Composants
- Shadcn/ui (base)
- Custom components pour branding

### Hébergement
- **Vercel** (recommandé)
- **Domaine** : wozif.com

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile large */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First
- Design optimisé mobile d'abord
- Navigation hamburger sur mobile
- Cards en colonne sur mobile
- Textes adaptés

---

## 🔗 Navigation

### Header
**Desktop** :
```
[Logo Wozif]  Produits  À propos  Contact  |  [Se connecter]  [Créer un compte]
```

**Mobile** :
```
[Logo]  [Menu hamburger]
```

### Footer
**Colonnes** :
1. **Produits**
   - AfriFlow
   - Gnata

2. **Entreprise**
   - À propos
   - Contact
   - Carrières (optionnel)

3. **Ressources**
   - Documentation
   - Status
   - Support

4. **Légal**
   - Conditions d'utilisation
   - Politique de confidentialité

**Bas de page** :
- © 2026 Wozif. Tous droits réservés.
- Réseaux sociaux

---

## 🚀 Fonctionnalités Avancées

### SEO
- Meta tags optimisés
- Open Graph pour réseaux sociaux
- Sitemap.xml
- Robots.txt
- Schema.org markup

### Performance
- Images optimisées (Next.js Image)
- Lazy loading
- Code splitting
- Lighthouse score > 90

### Analytics
- Google Analytics (optionnel)
- Plausible Analytics (recommandé, privacy-first)

---

## 📋 Prochaines Étapes

1. ✅ Spécifications définies
2. ⏳ Setup Next.js + Tailwind
3. ⏳ Créer le design system
4. ⏳ Implémenter la page d'accueil
5. ⏳ Implémenter les pages produits
6. ⏳ Implémenter les autres pages
7. ⏳ Tests et optimisations
8. ⏳ Déploiement

---

## 💡 Inspirations Design

- **Vercel** : vercel.com (clean, moderne)
- **Stripe** : stripe.com (professionnel)
- **Linear** : linear.app (animations fluides)
- **Axa Zara** : axazara.com (multi-produits)

---

**Prêt à commencer l'implémentation ?** 🚀
