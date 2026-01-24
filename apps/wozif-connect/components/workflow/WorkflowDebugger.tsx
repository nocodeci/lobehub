'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, X, ChevronRight, Bug, CheckCircle } from 'lucide-react';

interface WorkflowDebugEvent {
  type: 'node_start' | 'node_input' | 'node_output' | 'node_error' | 'data_flow';
  nodeId: string;
  nodeType: string;
  timestamp: number;
  data?: any;
  message?: string;
}

interface WorkflowDebuggerProps {
  events: WorkflowDebugEvent[];
  clear: () => void;
  running: boolean;
}

export default function WorkflowDebugger({ events, clear, running }: WorkflowDebuggerProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'node_start' | 'node_output' | 'data_flow'>('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const toggleExpand = (index: number) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getEventIcon = (event: WorkflowDebugEvent) => {
    switch (event.type) {
      case 'node_start':
        return <Play className="h-3 w-3 text-green-500" />;
      case 'node_input':
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'node_output':
        return <ChevronRight className="h-3 w-3 text-purple-500" />;
      case 'node_error':
        return <Bug className="h-3 w-3 text-red-500" />;
      case 'data_flow':
        return <div className="h-3 w-3 flex items-center justify-center text-gray-500">
          <div className="w-1 h-px bg-current" />
        </div>;
      default:
        return <CheckCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatData = (data: any): string => {
    if (typeof data === 'string') return `"${data}"`;
    if (typeof data === 'number') return `${data}`;
    if (typeof data === 'boolean') return data ? 'true' : 'false';
    if (typeof data === 'object') return JSON.stringify(data, null, 2);
    if (Array.isArray(data)) return JSON.stringify(data, null, 2);
    return String(data);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  };

  return (
    <div className="h-64 bg-slate-900/95 border-t border-slate-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${running ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <h3 className="text-sm font-bold text-white">Débogage Workflow</h3>
        </div>
        <button
          onClick={clear}
          className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700">
        {(['all', 'node_start', 'node_output', 'data_flow'] as const[]).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as any)}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              filter === filterType ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {filterType === 'all' && 'Tout'}
            {filterType === 'node_start' && 'Nœuds'}
            {filterType === 'node_output' && 'Sorties'}
            {filterType === 'data_flow' && 'Flux de données'}
          </button>
        ))}
      </div>

      {/* Liste des événements */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className={`
              ${event.type === 'node_error' ? 'bg-red-500/10' : 'bg-slate-800/50'}
              ${expandedEvents.has(index) ? 'border-l-2 border-l-slate-600' : 'border-l border-slate-700'}
              hover:bg-slate-700/50
              transition-all
              rounded border p-2
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icône + Timestamp */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700">
                  {getEventIcon(event)}
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {formatTime(event.timestamp)}
                </span>
              </div>

              {/* Détails de l'événement */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">Type:</span>
                  <span className="text-xs text-white">
                    {event.type === 'node_start' && 'Démarrage nœud'}
                    {event.type === 'node_input' && 'Entrée de nœud'}
                    {event.type === 'node_output' && 'Sortie de nœud'}
                    {event.type === 'node_error' && 'Erreur'}
                    {event.type === 'data_flow' && 'Flux de données'}
                  </span>
                </div>

                {event.nodeId && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">Nœud:</span>
                    <span className="text-xs text-primary font-mono">{event.nodeId}</span>
                  </div>
                )}

                {event.nodeType && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">Type:</span>
                    <span className="text-xs text-gray-300">{event.nodeType}</span>
                  </div>
                )}

                {event.message && (
                  <div className="mb-1">
                    <span className="text-xs font-bold text-gray-400">Message:</span>
                    <span className="text-xs text-yellow-300">{event.message}</span>
                  </div>
                )}

                {/* Données (expansible) */}
                {event.data !== undefined && (
                  <div>
                    <button
                      onClick={() => toggleExpand(index)}
                      className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors"
                    >
                      <span className="font-mono">{expandedEvents.has(index) ? '▼' : '▶'}</span>
                    </button>

                    {expandedEvents.has(index) && (
                      <pre className="mt-2 p-2 bg-slate-900 rounded text-[10px] text-green-400 font-mono overflow-x-auto">
                        {formatData(event.data)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">
              <Play className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-400">
              Aucun événement de débogage pour le moment
            </p>
            <p className="text-[10px] text-gray-500">
              Lancez une exécution pour voir les données en temps réel
            </p>
          </div>
        )}
      </div>

      {/* Indicateur de statut */}
      {running && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-slate-900/95 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-white">Exécution en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}