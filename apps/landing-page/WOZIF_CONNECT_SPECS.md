# 💬 Wozif Connect - L'Automatisation WhatsApp Intelligente
## Spécifications Techniques & Stratégie

---

## 🎯 Vision
Devenir le **"Wazzap.ai" africain**.
Une plateforme SaaS tout-en-un pour permettre aux entreprises d'automatiser leur marketing, leur support client et leurs ventes sur WhatsApp, sans risquer le blocage et sans compétences techniques.

---

## ⚔️ Analyse Concurrentielle (Wazzap.ai)
**Ce qu'ils font :**
- CRM WhatsApp basique.
- Auto-répondeur.
- API Gateway.

**Ce que Wozif Connect va faire (Better & Cheaper) :**
- **IA Native** : Chatbots auto-apprenants (RAG) sur les données de l'entreprise.
- **Paiements In-Chat** : Intégration directe avec **AfriFlow** (Payer directement dans WhatsApp).
- **Anti-Ban Architecture** : Algorithmes de "warm-up" pour éviter le bannissement des numéros lors des broadcasts.
- **Interface Mobile-First** : Gestion complète depuis un smartphone (crucial pour l'Afrique).

---

## 📐 Fonctionnalités MVP (Phase 1)

### 1. 📲 Connexion Universelle
- **Mode QR** : Scannez le QR code et le bot prend le relais (basé sur Baileys/Whisky).
- **Mode Cloud API** : Connexion officielle Meta (pour les grandes marques).

### 2. 📢 Campaign Manager (Broadcast)
- Envoi de messages en masse (Texte, Image, Vidéo, Audio).
- Gestion des variables (`Bonjour {name}`).
- **Smart Delay** : Délai aléatoire entre les messages pour simuler un humain.

### 3. 🤖 Visual Flow Builder
- Interface Drag & Drop (Nœuds et Liens).
- Triggers : Mot-clé, Nouveau contact, Absence.
- Actions : Envoyer message, Attendre, Condition (Si heure > 18h), Appel HTTP.

### 4. 🧠 AI Chatbot
- Prompt système personnalisable ("Tu es un assistant vendeur...").
- Base de connaissance (Uploader un PDF/Docx et le bot répond basé dessus).

---

## 🛠️ Stack Technique

### Frontend (Dashboard)
- **Framework** : Next.js 15 (App Router).
- **UI** : Shadcn/UI + Tailwind CSS (Thème sombre Wozif).
- **Flow Builder** : React Flow (ou @xyflow/react).

### Backend (Moteur WhatsApp)
- **Server** : Node.js (Express/Fastify) ou Go.
- **WhatsApp Lib** : `Baileys` (le plus robuste pour MD) ou `WPPConnect`.
- **Database** : PostgreSQL (via Prisma) pour les utilisateurs et MongoDB pour les logs de chat.
- **Queue** : Redis (BullMQ) pour les campagnes d'envoi massives.

---

## 💰 Modèle Économique (Abonnement SaaS)

- **Starter (Gratuit)** : 1 numéro, Auto-réponse simple, 100 messages bulk/mois.
- **Pro (10.000 FCFA/mois)** : 3 numéros, Chatbot IA, 5000 messages bulk, Intégration AfriFlow.
- **Business (50.000 FCFA/mois)** : Illimité, API Access, White Label.

---

## 📅 Roadmap de Lancement

### Semaine 1 : Core Engine
- Initialiser le projet `apps/wozif-connect`.
- Mettre en place l'authentification Wozif (SSO).
- Créer le service de connexion QR Code (Session management).

### Semaine 2 : Messaging
- Dashboard de chat en temps réel.
- Module d'envoi de campagnes (Broadcast).

### Semaine 3 : Automation
- Intégration du Flow Builder visuel.
- Système de Trigger/Action basique.

### Semaine 4 : Polish & IA
- Intégration OpenAI/Groq pour les réponses.
- Tests de charge et Anti-Ban.

---

**Wozif Connect : Transformez WhatsApp en machine à vendre.** 💸
