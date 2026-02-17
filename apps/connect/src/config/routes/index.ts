import {
  BarChart3,
  BrainCircuit,
  Coins,
  CreditCard,
  FilePenIcon,
  Image,
  LibraryBigIcon,
  type LucideIcon,
  Settings,
  ShapesIcon,
  Store,
} from 'lucide-react';

export interface NavigationRoute {
  /** CMDK i18n key in common namespace */
  cmdkKey: string;
  /** Electron i18n key in electron namespace */
  electronKey: string;
  /** Route icon component */
  icon: LucideIcon;
  /** Unique route identifier */
  id: string;
  /** Keywords for CMDK search (fallback) */
  keywords?: string[];
  /** i18n key for CMDK keywords in common namespace */
  keywordsKey?: string;
  /** Route path */
  path: string;
  /** Path prefix for checking current location */
  pathPrefix: string;
  /** Whether route supports dynamic titles (for specific items) */
  useDynamicTitle?: boolean;
}

/**
 * Shared navigation route configuration
 * Used by both Electron navigation and CommandMenu (CMDK)
 */
export const NAVIGATION_ROUTES: NavigationRoute[] = [
  {
    cmdkKey: 'cmdk.community',
    electronKey: 'navigation.discover',
    icon: ShapesIcon,
    id: 'community',
    keywords: ['discover', 'market', 'assistant', 'model', 'provider', 'mcp'],
    keywordsKey: 'cmdk.keywords.community',
    path: '/community',
    pathPrefix: '/community',
  },
  {
    cmdkKey: 'cmdk.painting',
    electronKey: 'navigation.image',
    icon: Image,
    id: 'image',
    keywords: ['painting', 'art', 'generate', 'draw'],
    keywordsKey: 'cmdk.keywords.painting',
    path: '/image',
    pathPrefix: '/image',
  },
  {
    cmdkKey: 'cmdk.resource',
    electronKey: 'navigation.resources',
    icon: LibraryBigIcon,
    id: 'resource',
    keywords: ['knowledge', 'files', 'library', 'documents'],
    keywordsKey: 'cmdk.keywords.resources',
    path: '/resource',
    pathPrefix: '/resource',
  },
  {
    cmdkKey: 'cmdk.pages',
    electronKey: 'navigation.pages',
    icon: FilePenIcon,
    id: 'page',
    keywords: ['documents', 'write', 'notes'],
    keywordsKey: 'cmdk.keywords.pages',
    path: '/page',
    pathPrefix: '/page',
    useDynamicTitle: true,
  },
  {
    cmdkKey: 'cmdk.memory',
    electronKey: 'navigation.memory',
    icon: BrainCircuit,
    id: 'memory',
    keywords: ['identities', 'contexts', 'preferences', 'experiences'],
    keywordsKey: 'cmdk.keywords.memory',
    path: '/memory',
    pathPrefix: '/memory',
  },
  {
    cmdkKey: 'cmdk.settings',
    electronKey: 'navigation.settings',
    icon: Settings,
    id: 'settings',
    keywords: ['settings', 'preferences', 'configuration', 'options'],
    keywordsKey: 'cmdk.keywords.settings',
    path: '/settings',
    pathPrefix: '/settings',
  },
  {
    cmdkKey: 'cmdk.subscription',
    electronKey: 'navigation.subscription',
    icon: CreditCard,
    id: 'subscription',
    keywords: ['subscription', 'billing', 'plan', 'payment', 'abonnement'],
    path: '/subscription',
    pathPrefix: '/subscription',
  },
  {
    cmdkKey: 'cmdk.usage',
    electronKey: 'navigation.usage',
    icon: BarChart3,
    id: 'usage',
    keywords: ['usage', 'statistics', 'consumption', 'credits', 'quota'],
    path: '/usage',
    pathPrefix: '/usage',
  },
  {
    cmdkKey: 'cmdk.credits',
    electronKey: 'navigation.credits',
    icon: Coins,
    id: 'credits',
    keywords: ['credits', 'balance', 'topup', 'recharge', 'crédits'],
    path: '/credits',
    pathPrefix: '/credits',
  },
  {
    cmdkKey: 'cmdk.ecommerce',
    electronKey: 'navigation.ecommerce',
    icon: Store,
    id: 'ecommerce',
    keywords: ['ecommerce', 'shop', 'store', 'products', 'vente', 'produits', 'boutique'],
    path: '/ecommerce',
    pathPrefix: '/ecommerce',
  },
];

/**
 * Get route configuration by id
 */
export const getRouteById = (id: string): NavigationRoute | undefined =>
  NAVIGATION_ROUTES.find((r) => r.id === id);

/**
 * Get navigable routes for CMDK (excludes settings which has separate handling)
 */
export const getNavigableRoutes = (): NavigationRoute[] =>
  NAVIGATION_ROUTES.filter((r) =>
    ['resource', 'page', 'memory'].includes(r.id),
  );
