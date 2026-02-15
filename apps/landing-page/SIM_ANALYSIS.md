# Analyse de Sim.ai - Éléments réutilisables pour Wozif-Connect

## Vue d'ensemble

[Sim.ai](https://github.com/simstudioai/sim) est une plateforme open-source pour construire et déployer des workflows d'agents IA. Elle utilise :
- **Next.js** (App Router) avec **Bun**
- **PostgreSQL** avec **pgvector** (Drizzle ORM)
- **ReactFlow** pour l'éditeur visuel
- **Zustand** pour la gestion d'état
- **Socket.io** pour le temps réel
- **Trigger.dev** pour les jobs en arrière-plan

## Architecture clé

### 1. Système de Blocs (`apps/sim/blocks/`)

**Structure des blocs :**
```typescript
interface BlockConfig {
  type: string
  name: string
  description: string
  category: 'blocks' | 'tools' | 'triggers'
  bgColor: string
  icon: BlockIcon
  subBlocks: SubBlockConfig[]  // Configuration UI
  inputs: Record<string, ParamConfig>
  outputs: Record<string, OutputFieldDefinition>
  tools: { access: string[] }
}
```

**Points intéressants :**
- Système de `subBlocks` très flexible pour la configuration UI
- Support de conditions pour afficher/masquer des champs
- Types de subBlocks variés : `short-input`, `long-input`, `dropdown`, `code`, `switch`, `file-upload`, etc.
- Support de `wandConfig` pour l'assistance IA dans les champs

### 2. Système d'exécution (`apps/sim/executor/`)

**Architecture DAG (Directed Acyclic Graph) :**
- `dag/builder.ts` : Construction du graphe de dépendances
- `execution/engine.ts` : Moteur d'exécution principal
- `execution/block-executor.ts` : Exécution individuelle des blocs
- `execution/edge-manager.ts` : Gestion des connexions entre blocs

**Handlers spécialisés :**
- `handlers/agent/` : Gestion des agents IA avec mémoire
- `handlers/condition/` : Logique conditionnelle
- `handlers/router/` : Routage conditionnel
- `handlers/parallel/` : Exécution parallèle
- `handlers/loop/` : Boucles

**Résolution de variables :**
- `variables/resolver.ts` : Système de résolution des variables
- Support de `{{previous.output.field}}`, `{{context.field}}`, etc.

### 3. Composants UI (`apps/sim/components/`)

- Composants ReactFlow personnalisés
- Système de configuration de blocs avec subBlocks
- Gestion des connexions visuelles

## Éléments à adapter pour Wozif-Connect

### ✅ 1. Système de résolution de variables amélioré

**Fichier de référence :** `sim-reference/apps/sim/executor/variables/resolver.ts`

**Améliorations possibles :**
- Support de chemins imbriqués : `{{previous.output.data.field}}`
- Résolution conditionnelle basée sur le type de bloc
- Cache des valeurs résolues pour performance

### ✅ 2. Gestion des outputs de blocs

**Fichier de référence :** `sim-reference/apps/sim/executor/execution/block-executor.ts`

**Idées :**
- Stockage structuré des outputs dans le contexte
- Typage TypeScript pour les outputs
- Validation des outputs selon le schéma défini

### ✅ 3. Système de conditions avancé

**Fichier de référence :** `sim-reference/apps/sim/executor/handlers/condition/condition-handler.ts`

**Améliorations :**
- Support de conditions complexes (AND/OR)
- Évaluation lazy des conditions
- Support de comparaisons numériques avancées

### ✅ 4. Gestion des connexions conditionnelles

**Fichier de référence :** `sim-reference/apps/sim/executor/dag/construction/edges.ts`

**Idées :**
- Support de multiples sorties par bloc (comme condition VRAI/FAUX)
- Validation des connexions au moment de la construction
- Détection de cycles dans le graphe

### ✅ 5. Système de subBlocks pour la configuration

**Fichier de référence :** `sim-reference/apps/sim/blocks/types.ts` (SubBlockConfig)

**Avantages :**
- Configuration déclarative des champs UI
- Support de conditions pour afficher/masquer des champs
- Types de champs variés (input, dropdown, code, file-upload, etc.)
- Support de l'assistance IA (wandConfig)

### ✅ 6. Exécution parallèle

**Fichier de référence :** `sim-reference/apps/sim/executor/orchestrators/parallel.ts`

**Utilité :**
- Exécuter plusieurs branches en parallèle
- Attendre la fin de toutes les branches avant de continuer
- Gestion des erreurs dans les branches parallèles

### ✅ 7. Gestion des boucles

**Fichier de référence :** `sim-reference/apps/sim/executor/orchestrators/loop.ts`

**Fonctionnalités :**
- Boucles avec conditions d'arrêt
- Itération sur des collections
- Limite de sécurité pour éviter les boucles infinies

## Fichiers clés à examiner

1. **Types de blocs :** `apps/sim/blocks/types.ts`
2. **Moteur d'exécution :** `apps/sim/executor/execution/engine.ts`
3. **Builder DAG :** `apps/sim/executor/dag/builder.ts`
4. **Résolution de variables :** `apps/sim/executor/variables/resolver.ts`
5. **Handler condition :** `apps/sim/executor/handlers/condition/condition-handler.ts`
6. **Handler agent :** `apps/sim/executor/handlers/agent/agent-handler.ts`

## Recommandations d'implémentation

### Priorité 1 : Résolution de variables améliorée
- Implémenter un système de résolution similaire à Sim
- Support des chemins imbriqués
- Cache pour performance

### Priorité 2 : Gestion des outputs structurés
- Typage des outputs de chaque bloc
- Stockage dans le contexte de manière structurée
- Validation selon schéma

### Priorité 3 : Système de subBlocks
- Créer un système déclaratif pour la configuration UI
- Réduire le code répétitif dans les panneaux d'inspection
- Support de conditions pour afficher/masquer des champs

### Priorité 4 : Exécution parallèle et boucles
- Implémenter l'exécution parallèle pour les branches indépendantes
- Améliorer le système de boucles existant

## Notes techniques

- Sim utilise **Bun** comme runtime (plus rapide que Node.js)
- Utilise **Drizzle ORM** pour la base de données
- **Socket.io** pour les mises à jour en temps réel
- **Trigger.dev** pour les jobs en arrière-plan
- Support de **pgvector** pour les recherches vectorielles

## Ressources

- Repository : https://github.com/simstudioai/sim
- Documentation : https://docs.sim.ai
- Site web : https://sim.ai
