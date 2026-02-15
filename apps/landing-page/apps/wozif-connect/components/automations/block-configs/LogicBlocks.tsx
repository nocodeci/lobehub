"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Repeat,
  Variable,
  Shuffle,
  StopCircle,
} from "lucide-react";

// Bloc Condition
export function ConditionConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    field: "message",
    operator: "contains",
    value: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <GitBranch className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Condition</h4>
            <p className="text-[10px] text-yellow-400/60">Branchement logique</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Champ à vérifier
          </label>
          <select
            value={config.field}
            onChange={(e) => updateConfig({ ...config, field: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="message">Message reçu</option>
            <option value="sender">Numéro expéditeur</option>
            <option value="contact_name">Nom du contact</option>
            <option value="tag">Tag du contact</option>
            <option value="variable">Variable personnalisée</option>
            <option value="sentiment">Sentiment (positif/négatif)</option>
            <option value="time">Heure actuelle</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Opérateur
          </label>
          <select
            value={config.operator}
            onChange={(e) => updateConfig({ ...config, operator: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="contains">Contient</option>
            <option value="not_contains">Ne contient pas</option>
            <option value="equals">Est égal à</option>
            <option value="not_equals">N'est pas égal à</option>
            <option value="starts_with">Commence par</option>
            <option value="ends_with">Finit par</option>
            <option value="greater_than">Supérieur à</option>
            <option value="less_than">Inférieur à</option>
            <option value="is_empty">Est vide</option>
            <option value="is_not_empty">N'est pas vide</option>
            <option value="matches_regex">Correspond au regex</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Valeur
          </label>
          <Input
            value={config.value}
            onChange={(e) => updateConfig({ ...config, value: e.target.value })}
            placeholder="Valeur à comparer"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
        <p className="text-[9px] text-muted-foreground italic">
          Si la condition est vraie → branche "Oui" | Sinon → branche "Non"
        </p>
      </div>
    </div>
  );
}

// Bloc Loop
export function LoopConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    loopType: "count",
    count: 3,
    arrayVariable: "",
    maxIterations: 100,
    delayBetween: 0,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Repeat className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Boucle</h4>
            <p className="text-[10px] text-purple-400/60">Répéter des actions</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Type de boucle
          </label>
          <select
            value={config.loopType}
            onChange={(e) => updateConfig({ ...config, loopType: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="count">Nombre fixe d'itérations</option>
            <option value="array">Parcourir une liste</option>
            <option value="while">Tant que (condition)</option>
          </select>
        </div>

        {config.loopType === "count" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Nombre d'itérations
            </label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={config.count}
              onChange={(e) => updateConfig({ ...config, count: parseInt(e.target.value) || 1 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}

        {config.loopType === "array" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Variable contenant la liste
            </label>
            <Input
              value={config.arrayVariable}
              onChange={(e) => updateConfig({ ...config, arrayVariable: e.target.value })}
              placeholder="{{contacts}}"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Délai entre itérations (secondes)
          </label>
          <Input
            type="number"
            min={0}
            value={config.delayBetween}
            onChange={(e) => updateConfig({ ...config, delayBetween: parseInt(e.target.value) || 0 })}
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Maximum d'itérations (sécurité)
          </label>
          <Input
            type="number"
            min={1}
            max={10000}
            value={config.maxIterations}
            onChange={(e) => updateConfig({ ...config, maxIterations: parseInt(e.target.value) || 100 })}
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-purple-400 font-bold">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          SORTIE: CYCLE
        </div>
        <p className="text-[9px] text-muted-foreground italic pl-4">
          Connectez ici les actions à répéter à chaque tour.
        </p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold mt-2">
          <div className="h-2 w-2 rounded-full bg-zinc-500"></div>
          SORTIE: TERMINÉ
        </div>
        <p className="text-[9px] text-muted-foreground italic pl-4">
          Connectez ici l'action à suivre une fois la boucle finie.
        </p>
      </div>
    </div>
  );
}

// Bloc Set Variable
export function SetVariableConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    variables: [
      {
        name: "",
        value: "",
        type: "static",
        expression: "",
      },
    ],
  });

  // Migration for old single variable format
  React.useEffect(() => {
    const rawConfig = JSON.parse(node.config || "{}");
    if (rawConfig.variableName && !rawConfig.variables) {
      updateConfig({
        variables: [
          {
            name: rawConfig.variableName,
            value: rawConfig.value || "",
            type: rawConfig.valueType || "static",
            expression: rawConfig.expression || "",
          },
        ],
      });
    }
  }, [node.config]);

  const addVariable = () => {
    updateConfig({
      ...config,
      variables: [
        ...config.variables,
        { name: "", value: "", type: "static", expression: "" },
      ],
    });
  };

  const removeVariable = (index: number) => {
    if (config.variables.length > 1) {
      updateConfig({
        ...config,
        variables: config.variables.filter((_: any, i: number) => i !== index),
      });
    }
  };

  const updateVariable = (index: number, field: string, value: string) => {
    const newVariables = [...config.variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    updateConfig({ ...config, variables: newVariables });
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Variable className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Définir Variables</h4>
              <p className="text-[10px] text-blue-400/60">Stocker des valeurs</p>
            </div>
          </div>
          <button
            onClick={addVariable}
            className="h-8 px-3 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/30 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        <div className="space-y-4">
          {config.variables.map((variable: any, idx: number) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 mb-1 block">
                    Nom de la variable
                  </label>
                  <Input
                    value={variable.name}
                    onChange={(e) => updateVariable(idx, "name", e.target.value)}
                    placeholder="nom_client"
                    className="bg-black/40 border-white/10 h-8 text-xs font-mono"
                  />
                </div>
                <div className="w-[120px]">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 mb-1 block">
                    Type
                  </label>
                  <select
                    value={variable.type}
                    onChange={(e) => updateVariable(idx, "type", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 text-[10px] px-2 text-white"
                  >
                    <option value="static">Statique</option>
                    <option value="expression">Expression</option>
                    <option value="api_response">Réponse API</option>
                    <option value="variable">Autre Var</option>
                  </select>
                </div>
                {config.variables.length > 1 && (
                  <button
                    onClick={() => removeVariable(idx)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {variable.type === "static" ? (
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 mb-1 block">
                    Valeur
                  </label>
                  <Input
                    value={variable.value}
                    onChange={(e) => updateVariable(idx, "value", e.target.value)}
                    placeholder="Valeur à assigner"
                    className="bg-black/40 border-white/10 h-8 text-xs"
                  />
                </div>
              ) : variable.type === "expression" ? (
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted-foreground/60 mb-1 block">
                    Expression JavaScript
                  </label>
                  <textarea
                    value={variable.expression}
                    onChange={(e) =>
                      updateVariable(idx, "expression", e.target.value)
                    }
                    className="w-full h-16 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                    placeholder="message.toUpperCase()"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <p className="text-[9px] text-muted-foreground italic">
          Utilisez {"{{nom_variable}}"} pour accéder à la valeur dans les autres
          blocs.
        </p>
      </div>
    </div>
  );
}

// Bloc Random Choice
export function RandomChoiceConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    choices: ["Option A", "Option B"],
    weighted: false,
    weights: [50, 50],
  });

  const addChoice = () => {
    updateConfig({
      ...config,
      choices: [...config.choices, `Option ${config.choices.length + 1}`],
      weights: [...config.weights, 50],
    });
  };

  const removeChoice = (index: number) => {
    if (config.choices.length > 2) {
      updateConfig({
        ...config,
        choices: config.choices.filter((_: any, i: number) => i !== index),
        weights: config.weights.filter((_: any, i: number) => i !== index),
      });
    }
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...config.choices];
    newChoices[index] = value;
    updateConfig({ ...config, choices: newChoices });
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Shuffle className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Choix Aléatoire</h4>
            <p className="text-[10px] text-pink-400/60">Branchement aléatoire</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Options ({config.choices.length})
          </label>
          {config.choices.map((choice: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={choice}
                onChange={(e) => updateChoice(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-black/40 border-white/10 h-9"
              />
              {config.choices.length > 2 && (
                <button
                  onClick={() => removeChoice(idx)}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addChoice}
            className="text-[10px] text-pink-400 hover:text-pink-300"
          >
            + Ajouter une option
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Probabilités pondérées</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.weighted}
              onChange={(e) => updateConfig({ ...config, weighted: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-pink-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc End Flow
export function EndFlowConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    action: "stop",
    message: "",
    returnValue: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <StopCircle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Fin du Flux</h4>
            <p className="text-[10px] text-red-400/60">Terminer l'automatisation</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Action de fin
          </label>
          <select
            value={config.action}
            onChange={(e) => updateConfig({ ...config, action: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="stop">Arrêter simplement</option>
            <option value="message">Envoyer un message final</option>
            <option value="redirect">Rediriger vers un autre flux</option>
            <option value="return">Retourner une valeur</option>
          </select>
        </div>

        {config.action === "message" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Message de fin
            </label>
            <textarea
              value={config.message}
              onChange={(e) => updateConfig({ ...config, message: e.target.value })}
              className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
              placeholder="Merci pour votre échange. À bientôt !"
            />
          </div>
        )}

        {config.action === "return" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Valeur de retour
            </label>
            <Input
              value={config.returnValue}
              onChange={(e) => updateConfig({ ...config, returnValue: e.target.value })}
              placeholder="{{resultat}}"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}
      </div>
    </div>
  );
}
