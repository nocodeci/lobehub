# Guide de Branding pour Connect AI (Fork de LobeChat)

Ce guide vous explique comment modifier rapidement les éléments de votre projet pour qu'il ne reste plus aucune trace de "Lobe AI".

## 1. Centralisation de la Marque (Le "Master Switch")

Toutes les constantes globales se trouvent ici :
`packages/business/const/src/branding.ts`

Modifiez ces variables pour changer le nom, le logo, l'organisation et les liens sociaux :
- `BRANDING_NAME` : Le nom de votre application (**Connect**).
- `BRANDING_LOGO_URL` : L'URL de votre logo (actuellement `/branding/wozif-elephant.png`).
- `ORG_NAME` : Le nom de votre entreprise (**Wozif**).

## 2. Textes et Traductions (i18n)

LobeChat utilise un système de traduction complexe. Si vous voyez encore "Lobe AI" quelque part, c'est probablement dans :
- `locales/` : Contient les fichiers JSON pour chaque langue.
- `src/locales/default/` : Contient les sources TypeScript pour la langue par défaut (Anglais).

**Astuce** : J'ai déjà lancé un script pour remplacer "Lobe AI" par "Connect AI" dans tous ces dossiers.

## 3. Pourquoi je vois encore "Lobe AI" dans ma barre latérale ?

Si vous avez déjà ouvert l'application auparavant, le nom de l'agent par défaut ("Inbox") est **enregistré dans votre base de données locale (IndexedDB) ou serveur**.
Même si on change le code, la base de données garde l'ancien nom pour votre profil existant.

**Solutions :**
1.  **Renommage manuel** : Cliquez sur l'agent et changez son nom en "Connect AI" directement dans l'interface.
2.  **Clear Cache** : Allez dans les outils de développement de votre navigateur -> Application -> Storage -> Clear site data. Cela réinitialisera tout et créera un nouvel agent avec le bon nom.

## 4. Logo et Icônes

Les fichiers visuels sont ici :
- `/public/branding/` : Vos logos personnalisés.
- `/public/avatars/lobe-ai.png` : J'ai remplacé ce fichier par votre éléphant pour forcer l'affichage de votre marque partout où cet avatar est utilisé par défaut.

## 5. Couleurs et Thème

Pour modifier les couleurs principales (le violet de Lobe par exemple) :
- Modifiez `src/styles/antdOverride.ts` pour changer les jetons de thème Ant Design.
- Les couleurs de base sont souvent dérivées de `cssVar.colorPrimary`.

---
*Ce guide a été généré pour vous aider à personnaliser votre projet Connect AI efficacement.*
