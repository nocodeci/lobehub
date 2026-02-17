import {
  BotIcon,
  ChartNetworkIcon,
  CodeXmlIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  PaintBucketIcon,
  PenIcon,
  PercentIcon,
  TargetIcon,
} from 'lucide-react';

/**
 * Predefined interest areas with icons and translation keys.
 * Use with `t('interests.area.${key}')` from 'onboarding' namespace.
 */
export const INTEREST_AREAS = [
  { icon: PenIcon, key: 'writing' },
  { icon: CodeXmlIcon, key: 'coding' },
  { icon: PaintBucketIcon, key: 'design' },
  { icon: GraduationCapIcon, key: 'education' },
  { icon: ChartNetworkIcon, key: 'business' },
  { icon: PercentIcon, key: 'marketing' },
  { icon: TargetIcon, key: 'product' },
  { icon: HandCoinsIcon, key: 'sales' },
  { icon: BotIcon, key: 'agentReselling' },
] as const;

export type InterestAreaKey = (typeof INTEREST_AREAS)[number]['key'];
