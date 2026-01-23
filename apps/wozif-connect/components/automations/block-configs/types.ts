// Types communs pour les configurations de blocs
export interface BlockConfigProps {
  node: {
    id: string | number;
    type: string;
    name: string;
    config: string;
  };
  updateConfig: (config: Record<string, any>) => void;
  // Contexte pour les blocs qui en ont besoin
  context?: {
    isClientWhatsAppConnected?: boolean;
    clientWhatsAppNumber?: string | null;
    isWhatsAppConnected?: boolean;
    automationId?: string;
    handleDisconnectWhatsApp?: () => void;
    isDisconnectingWhatsApp?: boolean;
    setShowConnectionModal?: (show: boolean) => void;
  };
}

// Helper pour parser la config JSON
export function parseConfig<T extends Record<string, any>>(
  configString: string,
  defaults: T
): T {
  try {
    const parsed = JSON.parse(configString || "{}");
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}
