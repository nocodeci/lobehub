'use client';

import { KLAVIS_SERVER_TYPES, LOBEHUB_SKILL_PROVIDERS } from '@lobechat/const';
import isEqual from 'fast-deep-equal';
import { memo, useCallback, useMemo } from 'react';

import { createIntegrationDetailModal } from '@/features/IntegrationDetailModal';
import { WhatsAppSkillCard } from '@/features/WhatsApp';
import { serverConfigSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useToolStore } from '@/store/tool';
import { klavisStoreSelectors, lobehubSkillStoreSelectors } from '@/store/tool/selectors';
import { KlavisServerStatus } from '@/store/tool/slices/klavisStore';
import { LobehubSkillStatus } from '@/store/tool/slices/lobehubSkillStore/types';

import Empty from '../Empty';
import { gridStyles } from '../style';
import BuiltinSkillItem from './BuiltinSkillItem';
import Item from './Item';

interface BuiltinSkillDef {
  avatar: string;
  description: string;
  identifier: string;
  label: string;
}

const BUILTIN_SKILLS: BuiltinSkillDef[] = [
  {
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIHJ4PSI1MTIiIGZpbGw9IiNDNDc4NUIiLz48cGF0aCBkPSJNNTEyIDYxMmM1NS4yMjggMCAxMDAtNDQuNzcyIDEwMC0xMDBzLTQ0Ljc3Mi0xMDAtMTAwLTEwMC0xMDAgNDQuNzcyLTEwMCAxMDAgNDQuNzcyIDEwMCAxMDAgMTAwWiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjU2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNTEyIDY2MmExNDkuOTk4IDE0OS45OTggMCAwIDEtOTIuNTk3IDEzOC41ODIgMTUwLjAwMiAxNTAuMDAyIDAgMCAxLTIwNC41MjEtMTA5LjMxOCAxNDkuOTk4IDE0OS45OTggMCAwIDEgNjMuNzgzLTE1My45ODRBMTQ5Ljk5MiAxNDkuOTkyIDAgMCAxIDM2MiA1MTJhMTQ5Ljk5OSAxNDkuOTk5IDAgMSAxIDE1MC0xNTAgMTQ5Ljk5OCAxNDkuOTk4IDAgMCAxIDI5Ny4xMTgtMjkuMjYzQTE1MCAxNTAgMCAwIDEgNjYyIDUxMmMyOS42NjcgMCA1OC42NjggOC43OTcgODMuMzM1IDI1LjI4YTE0OS45OTUgMTQ5Ljk5NSAwIDAgMSA2My43ODMgMTUzLjk4NEExNTAgMTUwIDAgMCAxIDUxMiA2NjJaTTUxMiAzNjJ2NTBNMzYyIDUxMmg1ME02NjIgNTEyaC01ME01MTIgNjYydi01ME0zNzguNjY3IDM3OC42NjdsNjIuNjY2IDYyLjY2Nk01ODIuNjY3IDQ0MS4zMzNsNjIuNjY2LTYyLjY2Nk0zNzguNjY3IDY0NS4zMzNsNjIuNjY2LTYyLjY2Nk01ODIuNjY3IDU4Mi42NjdsNjIuNjY2IDYyLjY2NiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjU2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=',
    description:
      'Generate and preview interactive UI components, data visualizations, charts, SVG illustrations, and web applications. Create rich visual content that users can interact with directly.',
    identifier: 'lobe-artifacts',
    label: 'Artefacts',
  },
  {
    avatar: '🧠',
    description:
      'Create a personalized knowledge base about yourself. Memorize preferences, track activities and experiences, store identity information, and retrieve relevant context in future conversations.',
    identifier: 'lobe-user-memory',
    label: 'Mémoire',
  },
  {
    avatar: '💻',
    description:
      'Run Python, JavaScript, and TypeScript code in an isolated cloud environment. Execute shell commands, manage files, search content with regular expressions, and export results securely.',
    identifier: 'lobe-cloud-sandbox',
    label: 'Bac à sable cloud',
  },
  {
    avatar: '✅',
    description:
      'Plan goals and track progress using the GTD method. Create strategic plans, manage task lists with status tracking, and execute long-running asynchronous tasks.',
    identifier: 'lobe-gtd',
    label: 'Outils GTD',
  },
  {
    avatar: '📓',
    description:
      'Create and manage persistent documents within conversations. Save notes, reports, articles, and markdown content accessible at any time.',
    identifier: 'lobe-notebook',
    label: 'Carnet',
  },
];

interface LobeHubListProps {
  keywords: string;
}

export const LobeHubList = memo<LobeHubListProps>(({ keywords }) => {
  const isLobehubSkillEnabled = useServerConfigStore(serverConfigSelectors.enableLobehubSkill);
  const isKlavisEnabled = useServerConfigStore(serverConfigSelectors.enableKlavis);
  const allLobehubSkillServers = useToolStore(lobehubSkillStoreSelectors.getServers, isEqual);
  const allKlavisServers = useToolStore(klavisStoreSelectors.getServers, isEqual);

  const [useFetchLobehubSkillConnections, useFetchUserKlavisServers] = useToolStore((s) => [
    s.useFetchLobehubSkillConnections,
    s.useFetchUserKlavisServers,
  ]);

  useFetchLobehubSkillConnections(isLobehubSkillEnabled);
  useFetchUserKlavisServers(isKlavisEnabled);

  const getLobehubSkillServerByProvider = useCallback(
    (providerId: string) => {
      return allLobehubSkillServers.find((server) => server.identifier === providerId);
    },
    [allLobehubSkillServers],
  );

  const getKlavisServerByIdentifier = useCallback(
    (identifier: string) => {
      return allKlavisServers.find((server) => server.identifier === identifier);
    },
    [allKlavisServers],
  );

  const filteredItems = useMemo(() => {
    const items: Array<
      | { builtin: BuiltinSkillDef; type: 'builtin' }
      | { provider: (typeof LOBEHUB_SKILL_PROVIDERS)[number]; type: 'lobehub' }
      | { serverType: (typeof KLAVIS_SERVER_TYPES)[number]; type: 'klavis' }
      | { type: 'whatsapp' }
    > = [];

    // Add built-in skills first
    for (const builtin of BUILTIN_SKILLS) {
      items.push({ builtin, type: 'builtin' });
    }

    // Add LobeHub skills
    if (isLobehubSkillEnabled) {
      for (const provider of LOBEHUB_SKILL_PROVIDERS) {
        items.push({ provider, type: 'lobehub' });
      }
    }

    // Add Klavis skills
    if (isKlavisEnabled) {
      for (const serverType of KLAVIS_SERVER_TYPES) {
        items.push({ serverType, type: 'klavis' });
      }
    }

    // Add WhatsApp skill
    items.push({ type: 'whatsapp' });

    // Filter by keywords
    const lowerKeywords = keywords.toLowerCase().trim();
    if (!lowerKeywords) return items;

    return items.filter((item) => {
      if (item.type === 'whatsapp') {
        return 'whatsapp'.includes(lowerKeywords) || 'messaging'.includes(lowerKeywords);
      }
      if (item.type === 'builtin') {
        return item.builtin.label.toLowerCase().includes(lowerKeywords);
      }
      const label = item.type === 'lobehub' ? item.provider.label : item.serverType.label;
      return label.toLowerCase().includes(lowerKeywords);
    });
  }, [keywords, isLobehubSkillEnabled, isKlavisEnabled]);

  const hasSearchKeywords = Boolean(keywords && keywords.trim());

  if (filteredItems.length === 0) return <Empty search={hasSearchKeywords} />;

  return (
    <div className={gridStyles.grid}>
      {filteredItems.map((item, index) => {
        // Built-in skills
        if (item.type === 'builtin') {
          return (
            <BuiltinSkillItem
              avatar={item.builtin.avatar}
              description={item.builtin.description}
              identifier={item.builtin.identifier}
              key={item.builtin.identifier}
              label={item.builtin.label}
            />
          );
        }

        // WhatsApp skill card
        if (item.type === 'whatsapp') {
          return (
            <WhatsAppSkillCard
              key="whatsapp-skill"
            />
          );
        }

        if (item.type === 'lobehub') {
          const server = getLobehubSkillServerByProvider(item.provider.id);
          const isConnected = server?.status === LobehubSkillStatus.CONNECTED;
          return (
            <Item
              description={item.provider.description}
              icon={item.provider.icon}
              identifier={item.provider.id}
              isConnected={isConnected}
              key={item.provider.id}
              label={item.provider.label}
              onOpenDetail={() =>
                createIntegrationDetailModal({ identifier: item.provider.id, type: 'lobehub' })
              }
              type="lobehub"
            />
          );
        }
        const server = getKlavisServerByIdentifier(item.serverType.identifier);
        const isConnected = server?.status === KlavisServerStatus.CONNECTED;
        return (
          <Item
            description={item.serverType.description}
            icon={item.serverType.icon}
            identifier={item.serverType.identifier}
            isConnected={isConnected}
            key={item.serverType.identifier}
            label={item.serverType.label}
            onOpenDetail={() =>
              createIntegrationDetailModal({
                identifier: item.serverType.identifier,
                serverName: item.serverType.serverName,
                type: 'klavis',
              })
            }
            serverName={item.serverType.serverName}
            type="klavis"
          />
        );
      })}
    </div>
  );
});

LobeHubList.displayName = 'LobeHubList';

export default LobeHubList;

