# Système de Paramètres Aligné avec Sim-Studio

## 🎯 Vue d'ensemble

Ce document décrit l'architecture de gestion des paramètres de blocs implémentée dans wozif-connect, alignée sur les meilleures pratiques de sim-studio.

## 📁 Structure des fichiers

```
lib/
├── blocks/
│   ├── types.ts           # Types TypeScript enrichis (SubBlockType, BlockConfig, etc.)
│   ├── registry.ts        # Registre des blocs
│   └── definitions/       # Définitions de chaque bloc
│       ├── ai_agent.ts
│       ├── condition.ts
│       ├── send_text.ts
│       └── ...
├── stores/
│   ├── index.ts           # Export des stores
│   ├── variables.ts       # Store Zustand pour les variables
│   └── subblock.ts        # Store pour les valeurs des subblocks
└── utils/
    └── references.ts      # Parser de références cross-block

components/builder/
├── index.ts               # Export des composants
├── BlockSettings.tsx      # Panneau de configuration des blocs
├── CustomNode.tsx         # Composant React Flow pour les nœuds
├── VariablesPanel.tsx     # Gestion des variables de workflow
└── ReferenceInput.tsx     # Input avec autocomplétion de références
```

## 🔧 Types de SubBlocks Supportés

| Type | Description | Exemple d'utilisation |
|------|-------------|----------------------|
| `short-input` | Input simple une ligne | Nom, URL, ID |
| `long-input` | Textarea multi-lignes | Instructions, prompts |
| `number-input` | Input numérique | Temperature, timeout |
| `dropdown` | Menu déroulant | Sélection de modèle |
| `combobox` | Dropdown avec recherche | Sélection avec filtre |
| `switch` | Toggle on/off | Activer/désactiver |
| `slider` | Slider numérique | 0-100, 0.0-2.0 |
| `ai-model-selector` | Sélecteur de modèle IA | OpenAI, Anthropic, etc. |
| `messages-input` | Messages LLM | System/User/Assistant |
| `condition-input` | Conditions logiques | IF/ELSE rules |
| `response-format` | JSON Schema | Structured output |
| `tool-input` | Configuration d'outils | Agent tools |
| `variable-selector` | Sélecteur de variable | Variables du workflow |

## 📊 Système de Variables

### Création et gestion

```typescript
import { useVariablesStore } from '@/lib/stores';

// Dans un composant
const { addVariable, updateVariable, deleteVariable, getVariablesByWorkflowId } = useVariablesStore();

// Ajouter une variable
addVariable({
  workflowId: 'workflow-123',
  name: 'user_name',
  type: 'string',
  value: 'John Doe'
});

// Récupérer les variables d'un workflow
const variables = getVariablesByWorkflowId('workflow-123');
```

### Types de variables supportés

- `string` - Texte libre
- `number` - Nombre
- `boolean` - Vrai/Faux
- `object` - Objet JSON
- `array` - Tableau

## 🔗 Références Cross-Block

### Syntaxes supportées

1. **Outputs de blocs**: `<block_name.property>`
   ```
   <agent1.response>
   <condition1.matchedCondition>
   ```

2. **Variables**: `{{variables.name}}`
   ```
   {{variables.user_name}}
   {{variables.api_key}}
   ```

3. **Syntaxe courte**: `{{var:name}}`
   ```
   {{var:user_name}}
   ```

### Utilisation dans le code

```typescript
import { parseReferences, resolveReferences, hasReferences } from '@/lib/utils/references';

// Parser les références
const refs = parseReferences("Bonjour <agent1.response>");
// [{ type: 'output', source: 'agent1', property: 'response', fullPath: '<agent1.response>' }]

// Résoudre les références
const resolved = resolveReferences(
  "Bonjour <agent1.response>",
  { agent1: { response: "John" } },
  {}
);
// "Bonjour John"
```

## 🎨 Conditions de Visibilité

Les subblocks peuvent être affichés conditionnellement :

```typescript
{
  id: 'apiKey',
  title: 'Clé API',
  type: 'short-input',
  condition: {
    field: 'model',
    value: ['gpt-4', 'gpt-3.5-turbo'],
    not: false  // Afficher si le modèle est dans la liste
  }
}
```

### Condition avec AND

```typescript
condition: {
  field: 'provider',
  value: 'openai',
  and: {
    field: 'useCustomKey',
    value: true
  }
}
```

## 🛠 Modes d'affichage

Chaque subblock peut avoir un mode :

- `basic` (défaut) - Toujours visible
- `advanced` - Visible dans la section "Options avancées"
- `both` - Visible partout

```typescript
{
  id: 'temperature',
  title: 'Température',
  type: 'slider',
  mode: 'advanced',  // Visible uniquement dans les options avancées
}
```

## 💾 Persistence des Valeurs

Les valeurs sont persisées automatiquement via Zustand avec middleware `persist` :

- `wozif-variables-storage` - Variables de workflow
- `wozif-subblock-storage` - Valeurs des subblocks

## 📝 Exemple de définition de bloc

```typescript
import { BlockConfig } from '../types';
import { Bot } from 'lucide-react';

export const MyAgentBlock: BlockConfig = {
  type: 'my_agent',
  name: 'Mon Agent',
  description: 'Description courte',
  category: 'ai',
  bgColor: '#10a37f',
  icon: Bot,
  
  subBlocks: [
    {
      id: 'model',
      title: 'Modèle',
      type: 'ai-model-selector',
      defaultValue: 'gpt-4o-mini',
      required: true,
    },
    {
      id: 'prompt',
      title: 'Instructions',
      type: 'long-input',
      placeholder: 'Décrivez le comportement...',
      rows: 6,
      connectionDroppable: true,
    },
    {
      id: 'temperature',
      title: 'Température',
      type: 'slider',
      min: 0,
      max: 2,
      step: 0.1,
      defaultValue: 0.7,
      mode: 'advanced',
    },
  ],
  
  inputs: {
    message: { type: 'string', description: 'Message utilisateur' },
  },
  
  outputs: {
    response: { type: 'string', description: 'Réponse de l\'agent' },
    tokens: { type: 'json', description: 'Statistiques tokens' },
  },
};
```

## 🚀 Prochaines étapes

- [ ] Intégrer `VariablesPanel` dans le panneau latéral de l'éditeur
- [ ] Remplacer les inputs texte par `ReferenceInput` pour le support autocomplete
- [ ] Ajouter la validation des champs requis
- [ ] Implémenter l'exécution avec résolution des références
- [ ] Ajouter le support pour `tool-input` (configuration d'outils)
