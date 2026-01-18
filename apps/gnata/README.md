# 🎨 Gnata - Votre Site Web en 1 Heure
## Spécifications Techniques

---

## 🎯 Concept
Gnata est un service de déploiement de sites web ultra-rapide. Contrairement aux plateformes de type "no-code" complexes, Gnata mise sur une interaction simple : vous demandez, nous livrons. L'intégration avec AfriFlow est native, permettant aux marchands africains d'être en ligne et de vendre en un temps record.

---

## 📐 Fonctionnalités Clients

### 1. **Catalogue de Templates**
Une sélection de designs premium classés par secteur :
- E-commerce (Vente de vêtements, électronique, cosmétiques)
- Restaurants / Livraison de nourriture
- Services (Coiffure, Consultation, Agence)
- Landing pages (Événements, Portfolio)

### 2. **Formulaire de Demande Express**
Un tunnel de commande intuitif :
- Nom de la marque
- Logo et couleurs
- Description des produits/services
- Choix du type de site
- Intégration AfriFlow (Oui/Non)

### 3. **Dashboard de Suivi**
- Statut de la commande (En cours, Correction, Livré)
- Chat direct avec le créateur (pour les précisions)
- Bouton de validation finale

### 4. **Gestion du Site (Post-Livraison)**
- Modification simplifiée des textes et images
- Activation/Désactivation des paiements AfriFlow
- Statistiques de visites basiques

---

## 📐 Administration (Pour le Créateur)

### 1. **Système de Ticketing**
- Alertes pour les nouvelles demandes (temps restant : 60min)
- Assignation des tâches

### 2. **Générateur de Site automatisé**
- CLI pour initialiser un nouveau projet basé sur un template
- Injection automatique des données client (Variables d'environnement)
- Déploiement automatique sur Vercel/Netlify

---

## 🛠️ Stack Technique

### Frontend Client
- **Framework** : Next.js 15 (App Router)
- **Styling** : Tailwind CSS + Framer Motion
- **CMS** : Strapi ou Payload CMS (pour permettre les modifications clients facilement)

### Intégration
- **API AfriFlow** : Pour la configuration auto des paiements.
- **Vercel API** : Pour la création programmatique de domaines et déploiements.

---

## 🎨 Identité Visuelle
- **Couleur Primaire** : Mauve Royal (`#8b5cf6`) - Symbolise la créativité et la vitesse.
- **Typographie** : 'Outfit' ou 'Plus Jakarta Sans' (Minimaliste et moderne).

---

## 📋 Roadmap Gnata

### Phase 1 : MVP
- [ ] Interface de commande de site.
- [ ] Dashboard client pour suivre la livraison.
- [ ] 3 templates de base (E-commerce, Service, Landing).
- [ ] Liaison manuelle avec AfriFlow.

### Phase 2 : Automatisation
- [ ] Déploiement automatique via API Vercel.
- [ ] Système de modification de contenu assisté par IA.
- [ ] Intégration automatique d'AfriFlow via API.

---

**Gnata : La vitesse au service de la croissance.** 🚀
