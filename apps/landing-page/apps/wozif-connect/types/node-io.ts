// Définition des entrées/sorties pour tous les nœuds du système

export interface NodeInputDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'json' | 'file';
  description?: string;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  variableName?: string; // Permet de mapper à une variable dynamique
}

export interface NodeOutputDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'array' | 'object' | 'json' | 'boolean';
  description?: string;
  variableName?: string; // Permet de mapper à une variable dynamique
}

export interface NodeIOSchema {
  inputs: NodeInputDefinition[];
  outputs: NodeOutputDefinition[];
}