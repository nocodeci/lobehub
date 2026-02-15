# 🔌 Intégrations MCP - Wozif Connect

Ce document détaille la configuration et l'utilisation des serveurs MCP (Model Context Protocol) intégrés à Wozif Connect pour étendre les capacités des agents IA.

## Serveurs Installés

Les serveurs sont situés dans `/mcp-servers/`.

1. **Google Calendar** (`/mcp-servers/calendar`)
   - Permet la gestion des rendez-vous, la vérification des disponibilités et la création d'événements.
   - **Status** : Installé
   - **Transport** : HTTP / Stdio

2. **Gmail** (`/mcp-servers/gmail`)
   - Permet la lecture, l'envoi et la recherche d'emails.
   - **Status** : Installé
   - **Transport** : Stdio

3. **Calendly** (`/mcp-servers/calendly`)
   - Permet de lister les événements, les types de rendez-vous et de gérer les réservations Calendly.
   - **Status** : Installé
   - **Transport** : Stdio

4. **Brave Search** (`/mcp-servers/brave-search`)
   - Permet à l'IA d'effectuer des recherches sur le web en temps réel.
   - **Status** : Installé
   - **Transport** : Stdio

5. **Currency Conversion** (`/mcp-servers/currency`)
   - Permet de convertir les devises (ex: EUR vers XOF) en direct.
   - **Status** : Installé
   - **Transport** : Stdio

6. **Notion** (`/mcp-servers/notion`)
   - Permet de lire et d'écrire dans des bases de données Notion.
   - **Status** : Installé
   - **Transport** : Stdio

7. **Slack** (`/mcp-servers/slack`)
   - Permet d'envoyer des messages et de lire des canaux Slack.
   - **Status** : Installé
   - **Transport** : Stdio

8. **Google Sheets** (`/mcp-servers/sheets`)
   - Permet de lire et de modifier des feuilles de calcul Google Sheets.
   - **Status** : Installé
   - **Transport** : Stdio

9. **Google Maps** (`/mcp-servers/maps`)
   - Permet de chercher des lieux et d'obtenir des adresses/itinéraires.
   - **Status** : Installé
   - **Transport** : Stdio

## Configuration des Crédentials

Chaque serveur nécessite ses propres clés API :

### Google (Calendar & Gmail)
1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/).
2. Activer les APIs Google Calendar et Gmail.
3. Créer des identifiants OAuth 2.0.
4. Placer le fichier `credentials.json` dans le dossier respectif ou configurer les variables d'environnement.

### Calendly
1. Générer un Personal Access Token sur le [portail développeur Calendly](https://developer.calendly.com/).
2. Configurer la variable `CALENDLY_API_KEY`.

## Utilisation dans le Flow Builder

Dans le bloc **Agent IA**, vous pouvez maintenant activer ces outils en ajoutant les providers MCP correspondants.

### Exemples de Prompts pour l'Agent :
- "Vérifie mes disponibilités sur mon calendrier Google pour demain matin."
- "Envoie un email de confirmation à {email} via Gmail."
- "Propose mes liens Calendly pour une prise de rendez-vous."

## MCP Bridge (Backend)

La classe `MCPClient` dans `backend/app/chatbot_rag.py` gère la communication avec ces serveurs. Une passerelle (Gateway) est en cours de développement pour centraliser les appels.
