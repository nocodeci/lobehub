# 🔐 Wozif - Portail de Compte Unifié (SSO)
## Spécifications Techniques

---

## 🎯 Objectif
Créer un système de compte centralisé permettant aux utilisateurs d'accéder à tous les produits Wozif (AfriFlow, Gnata) avec un seul compte.

---

## 🏗️ Architecture SSO

### Flux d'Authentification

```
Utilisateur → account.wozif.com/login
    ↓
Authentification réussie
    ↓
Token JWT généré
    ↓
Redirection vers le produit demandé
    ↓
afriflow.wozif.com (avec token)
    ou
gnata.wozif.com (avec token)
```

### Technologies

**Option 1 : NextAuth.js** (Recommandé pour démarrer)
- Intégré à Next.js
- Support OAuth, Email, Credentials
- Session management
- Facile à déployer

**Option 2 : Keycloak** (Pour scaling futur)
- Open-source
- Enterprise-grade
- Multi-tenancy
- Plus complexe

**Choix initial** : NextAuth.js

---

## 📐 Structure du Portail

### Pages Publiques

#### 1. **Connexion** (`/auth/login`)
**Formulaire** :
- Email
- Mot de passe
- "Se souvenir de moi"
- Lien : "Mot de passe oublié ?"
- Bouton : "Se connecter"
- Lien : "Pas encore de compte ? S'inscrire"

**Options** :
- Connexion avec Google (optionnel)
- Connexion avec GitHub (optionnel)

#### 2. **Inscription** (`/auth/register`)
**Formulaire** :
- Nom complet
- Email
- Mot de passe
- Confirmation mot de passe
- Case : "J'accepte les conditions d'utilisation"
- Bouton : "Créer mon compte"
- Lien : "Déjà un compte ? Se connecter"

**Validation** :
- Email valide
- Mot de passe min 8 caractères
- Mot de passe avec majuscule, minuscule, chiffre

#### 3. **Mot de passe oublié** (`/auth/forgot-password`)
**Formulaire** :
- Email
- Bouton : "Envoyer le lien de réinitialisation"

#### 4. **Réinitialisation** (`/auth/reset-password?token=xxx`)
**Formulaire** :
- Nouveau mot de passe
- Confirmation
- Bouton : "Réinitialiser"

---

### Pages Privées (Authentifié)

#### 1. **Dashboard Principal** (`/dashboard`)
**Vue d'ensemble** :
- Bienvenue [Nom]
- Cartes des produits :
  - **AfriFlow**
    - Status : Actif / Inactif
    - Transactions ce mois : X
    - Revenus : X FCFA
    - Bouton : "Ouvrir AfriFlow"
  
  - **Gnata**
    - Status : Actif / Inactif
    - Sites actifs : X
    - Demandes en cours : X
    - Bouton : "Ouvrir Gnata"

- **Activité récente**
  - Dernières transactions AfriFlow
  - Dernières demandes Gnata

#### 2. **Profil** (`/profile`)
**Sections** :
- **Informations personnelles**
  - Nom
  - Email
  - Téléphone
  - Pays
  - Bouton : "Modifier"

- **Sécurité**
  - Changer mot de passe
  - Authentification 2FA (optionnel)
  - Sessions actives

- **Préférences**
  - Langue
  - Fuseau horaire
  - Notifications

#### 3. **Facturation** (`/billing`)
**Sections** :
- **Abonnements actifs**
  - AfriFlow : Plan actuel
  - Gnata : Plan actuel

- **Historique de paiements**
  - Date
  - Produit
  - Montant
  - Status
  - Facture (PDF)

- **Moyens de paiement**
  - Cartes enregistrées
  - Ajouter une carte

#### 4. **Paramètres** (`/settings`)
**Sections** :
- Notifications
- API Keys (si applicable)
- Webhooks
- Intégrations

---

## 🎨 Design System

### Palette de Couleurs
```css
--primary: #6366f1
--background: #0f172a
--surface: #1e293b
--card: #334155
--border: rgba(255,255,255,0.1)
```

### Layout
```
┌─────────────────────────────────────┐
│  [Logo]  Dashboard  Profil  [User] │  ← Header
├─────────────────────────────────────┤
│                                     │
│          Main Content               │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Sidebar** (optionnel pour desktop) :
```
┌────────┬────────────────────────────┐
│        │                            │
│ Menu   │     Main Content           │
│        │                            │
│        │                            │
└────────┴────────────────────────────┘
```

---

## 🔐 Sécurité

### Authentification
- Hashing : bcrypt (12 rounds)
- JWT : HS256 ou RS256
- Refresh tokens
- CSRF protection

### Sessions
- Durée : 7 jours (avec "Se souvenir")
- Durée : 24h (sans)
- Révocation possible

### Rate Limiting
- Login : 5 tentatives / 15 min
- Register : 3 comptes / heure / IP
- Password reset : 3 demandes / heure

---

## 📊 Base de Données

### Schema Prisma

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  password      String
  phone         String?
  country       String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  subscriptions Subscription[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  product   String   // 'afriflow' | 'gnata'
  plan      String   // 'free' | 'pro' | 'enterprise'
  status    String   // 'active' | 'cancelled' | 'expired'
  startDate DateTime @default(now())
  endDate   DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔗 Intégration avec les Produits

### AfriFlow
```typescript
// Vérifier l'authentification
const session = await getServerSession();
if (!session) {
  redirect('/auth/login?callbackUrl=/afriflow');
}

// Récupérer les données utilisateur
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { subscriptions: true }
});
```

### Gnata
```typescript
// Même logique
const session = await getServerSession();
if (!session) {
  redirect('/auth/login?callbackUrl=/gnata');
}
```

---

## 📧 Emails Transactionnels

### Templates Nécessaires
1. **Bienvenue** : Après inscription
2. **Vérification email** : Lien de confirmation
3. **Mot de passe oublié** : Lien de réinitialisation
4. **Changement de mot de passe** : Confirmation
5. **Nouvelle connexion** : Alerte sécurité
6. **Facture** : Après paiement

### Service Email
- **Resend** (recommandé, moderne)
- **SendGrid** (classique)
- **Mailgun** (alternatif)

---

## 🚀 Déploiement

### Infrastructure
- **Frontend** : Vercel
- **Database** : Supabase / Railway / Neon
- **Email** : Resend
- **Domaine** : account.wozif.com

### Variables d'Environnement
```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=https://account.wozif.com
NEXTAUTH_SECRET=

# Email
RESEND_API_KEY=

# OAuth (optionnel)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 📋 Roadmap

### Phase 1 : MVP (Semaine 1-2)
- [ ] Setup Next.js + NextAuth
- [ ] Pages auth (login, register, forgot)
- [ ] Dashboard basique
- [ ] Profil utilisateur
- [ ] Base de données Prisma

### Phase 2 : Intégration (Semaine 3)
- [ ] Connexion AfriFlow
- [ ] Connexion Gnata
- [ ] SSO fonctionnel

### Phase 3 : Facturation (Semaine 4)
- [ ] Page billing
- [ ] Historique paiements
- [ ] Gestion abonnements

### Phase 4 : Polish (Semaine 5)
- [ ] Emails transactionnels
- [ ] Tests
- [ ] Déploiement production

---

**Prêt à implémenter le portail de compte ?** 🔐
