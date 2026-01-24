'use client';

import React, { useState } from 'react';
import { ChevronRight, Variable, X, Plus } from 'lucide-react';
import { allNodeSchemas, NodeInputDefinition, NodeOutputDefinition } from '../../types/node-io-schemas';

interface NodeConnectionPanelProps {
  availableNodes: Record<string, {
    type: string;
    label: string;
    inputs?: NodeInputDefinition[];
    outputs?: NodeOutputDefinition[];
  }>;
  currentNodeOutputs: NodeOutputDefinition[];
  onConnect: (fromOutputId: string, fromNodeId: string, toInputId: string, toNodeId: string, mapping: any) => void;
}

export default function NodeConnectionPanel({
  availableNodes,
  currentNodeOutputs,
  onConnect,
}: NodeConnectionPanelProps) {
  const [selectedFromOutput, setSelectedFromOutput] = useState<{ nodeId: string; outputId: string } | null>(null);
  const [selectedToNode, setSelectedToNode] = useState<string>('');
  const [selectedToInput, setSelectedToInput] = useState<string>('');
  const [mappingConfig, setMappingConfig] = useState<Record<string, any>>({});

  // Filtrer les nœuds disponibles (exclure le nœud actuel)
  const availableNodesToConnect = Object.entries(availableNodes).filter(([key]) => {
    // Permettre de connecter à des nœuds du même type ou différents
    return true;
  });

  const handleConnect = () => {
    if (!selectedFromOutput || !selectedToNode || !selectedToInput) {
      return;
    }

    onConnect(
      selectedFromOutput.outputId,
      selectedFromOutput.nodeId,
      selectedToInput,
      selectedToNode,
      mappingConfig,
    );

    // Réinitialiser après connexion
    setSelectedFromOutput(null);
    setSelectedToNode('');
    setSelectedToInput('');
    setMappingConfig({});
  };

  const handleMappingChange = (inputId: string, value: string) => {
    setMappingConfig(prev => ({
      ...prev,
      [inputId]: value,
    }));
  };

  return (
    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest text-muted-foreground">
          Connexion des Nœuds
        </h3>
        <button
          onClick={() => {/* Géré par le parent */}}
          className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Section : Choisir la sortie */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-white/70 mb-2">
          1. Choisir une sortie du nœud actuel
        </p>

        {currentNodeOutputs.length === 0 ? (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
            <p className="text-xs text-yellow-200">
              Ce nœud n'a pas de sorties disponibles
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentNodeOutputs.map((output) => (
              <button
                key={output.id}
                onClick={() => setSelectedFromOutput({
                  nodeId: 'current',
                  outputId: output.id,
                })}
                className={`p-3 rounded-lg border transition-all ${
                  selectedFromOutput?.outputId === output.id
                    ? 'bg-primary/20 border-primary text-white'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Variable className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">
                      {output.name}
                    </p>
                    <p className="text-[10px] text-white/60">
                      Type: {output.type}
                    </p>
                  </div>
                </div>

                {output.variableName && (
                  <div className="flex items-center gap-1 mt-2 px-2 py-1 bg-white/5 rounded">
                    <Variable className="h-3 w-3 text-primary/70" />
                    <span className="text-[10px] text-primary/70 font-mono">
                      {output.variableName}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section : Choisir le nœud cible */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-white/70 mb-2">
          2. Choisir le nœud cible
        </p>

        <div className="space-y-2">
          {availableNodesToConnect.map(([nodeId, node]) => (
            <button
              key={nodeId}
              onClick={() => setSelectedToNode(nodeId)}
              className={`p-3 rounded-lg border transition-all ${
                selectedToNode === nodeId
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ChevronRight className="h-3 w-3 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white">
                    {node.label}
                  </p>
                  <p className="text-[10px] text-white/60">
                    Type: {node.type}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section : Mapper les entrées */}
      {selectedToNode && availableNodes[selectedToNode]?.inputs && availableNodes[selectedToNode]!.inputs!.length > 0 && (
        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold text-white/70 mb-2">
            3. Mapper les sorties vers les entrées
          </p>

          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            {(availableNodes[selectedToNode]!.inputs || []).map((input) => (
              <div key={input.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-xs text-white/80 mb-1">
                      {input.name}
                    </label>
                    {input.description && (
                      <p className="text-[10px] text-white/60 mb-1">
                        {input.description}
                      </p>
                    )}
                  </div>

                  {/* Sélecteur de variable */}
                  <div className="flex items-center gap-1">
                    <Variable className="h-4 w-4 text-primary/70" />
                    <select
                      value={mappingConfig[input.id] || ''}
                      onChange={(e) => handleMappingChange(input.id, e.target.value)}
                      className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                    >
                      <option value="">-- Sélectionner une variable --</option>
                      {currentNodeOutputs.map((output) => (
                        <option key={output.id} value={output.variableName || output.id}>
                          {output.variableName ? output.variableName : output.id}
                          {output.variableName ? ` (${output.name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type de mappage */}
                <div className="flex items-center gap-2 text-[10px] text-white/50">
                  <span className="text-white/70">
                    Variable: {mappingConfig[input.id] || 'Non défini'}
                  </span>
                  <span className="text-white/50">
                    →
                  </span>
                  <span className={mappingConfig[input.id] ? 'text-green-400' : 'text-white/30'}>
                    {mappingConfig[input.id] || 'Aucune'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton de connexion */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={handleConnect}
          disabled={!selectedFromOutput || !selectedToNode || !selectedToInput}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            !selectedFromOutput || !selectedToNode || !selectedToInput
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white cursor-pointer'
          }`}
        >
          {selectedFromOutput ? (
            <span>
              Connecter {selectedFromOutput.nodeId === 'current' ? 'sortie' : selectedFromOutput.nodeId} → {selectedToNode}
            </span>
          ) : (
            <span>
              Sélectionner une sortie et un nœud cible
            </span>
          )}
        </button>

        <button
          onClick={() => {/* Annuler - géré par le parent */}}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-sm font-semibold transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}