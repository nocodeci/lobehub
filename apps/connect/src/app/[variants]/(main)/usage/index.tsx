'use client';

import { Icon } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Card, Progress, Spin, Tag, Typography } from 'antd';
import { cssVar } from 'antd-style';
import {
  BarChart3,
  BrainCircuit,
  Clock,
  CreditCard,
  HardDrive,
  MessageSquare,
  Sparkle,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';

const { Title, Text } = Typography;

interface UsageData {
  credits: { limit: number; used: number };
  messages: { limit: number; used: number };
  period: { end: string; start: string };
  plan: string;
  storage: { files: { limit: number; used: number }; vectors: { limit: number; used: number } };
}

const DEFAULT_USAGE: UsageData = {
  credits: { limit: 10_000_000, used: 0 },
  messages: { limit: 14_000, used: 0 },
  period: {
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    start: new Date().toISOString(),
  },
  plan: 'free',
  storage: {
    files: { limit: 2_000, used: 0 },
    vectors: { limit: 10_000, used: 0 },
  },
};

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const formatBytes = (mb: number): string => {
  if (mb >= 1_000) return `${(mb / 1_000).toFixed(1)} GB`;
  return `${mb} MB`;
};

const getPercent = (used: number, limit: number): number => {
  if (limit === 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
};

const getProgressColor = (percent: number): string => {
  if (percent >= 90) return '#ff4d4f';
  if (percent >= 70) return '#faad14';
  return cssVar.colorPrimary as string;
};

interface StatCardProps {
  icon: typeof Zap;
  label: string;
  limit: number;
  suffix?: string;
  used: number;
}

const StatCard = memo<StatCardProps>(({ icon, label, used, limit, suffix }) => {
  const percent = getPercent(used, limit);
  const color = getProgressColor(percent);
  const formatFn = suffix === 'MB' ? formatBytes : formatNumber;

  return (
    <Card style={{ borderRadius: 12, flex: '1 1 200px', minWidth: 200 }}>
      <Flexbox gap={12}>
        <Flexbox align="center" gap={8} horizontal justify="space-between">
          <Flexbox align="center" gap={8} horizontal>
            <Icon icon={icon} size={16} style={{ color }} />
            <Text strong style={{ fontSize: 13 }}>{label}</Text>
          </Flexbox>
          <Tag
            color={percent >= 90 ? 'error' : percent >= 70 ? 'warning' : 'default'}
            style={{ margin: 0 }}
          >
            {percent}%
          </Tag>
        </Flexbox>
        <Progress
          percent={percent}
          showInfo={false}
          strokeColor={color}
          style={{ margin: 0 }}
        />
        <Flexbox align="center" horizontal justify="space-between">
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatFn(used)} utilisé{used > 1 ? 's' : ''}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatFn(limit)} {suffix === 'MB' ? '' : 'max'}
          </Text>
        </Flexbox>
      </Flexbox>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

const PLAN_LABELS: Record<string, { color: string; label: string }> = {
  base: { color: 'orange', label: 'Version de base' },
  free: { color: 'default', label: 'Gratuit' },
  premium: { color: 'blue', label: 'Premium Pro' },
  ultimate: { color: 'gold', label: 'Utilisation intensive' },
};

const UsagePage = memo(() => {
  const [usage, setUsage] = useState<UsageData>(DEFAULT_USAGE);
  const [loading, setLoading] = useState(false);

  const userSettings = useUserStore(settingsSelectors.currentSettings);
  const stripeCustomerId = (userSettings as any)?.subscription?.stripeCustomerId as
    | string
    | undefined;

  // TODO: Fetch real usage data from API when available
  const fetchUsage = useCallback(async () => {
    setLoading(true);
    try {
      // For now, use default data. Replace with real API call:
      // const res = await fetch(`/api/usage?customerId=${stripeCustomerId}`);
      // const data = await res.json();
      // setUsage(data);
      setUsage(DEFAULT_USAGE);
    } finally {
      setLoading(false);
    }
  }, [stripeCustomerId]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const periodStart = new Date(usage.period.start).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
  const periodEnd = new Date(usage.period.end).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const planInfo = PLAN_LABELS[usage.plan] || PLAN_LABELS.free;
  const creditsPercent = getPercent(usage.credits.used, usage.credits.limit);

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Flexbox>
    );
  }

  return (
    <Flexbox
      gap={24}
      style={{
        margin: '0 auto',
        maxWidth: 960,
        overflow: 'auto',
        padding: '24px 16px',
        width: '100%',
      }}
    >
      {/* Header */}
      <Flexbox align="center" gap={12} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
        <Flexbox align="center" gap={8} horizontal>
          <Icon icon={BarChart3} size={22} style={{ color: cssVar.colorPrimary }} />
          <Title level={4} style={{ margin: 0 }}>Usage</Title>
        </Flexbox>
        <Flexbox align="center" gap={8} horizontal>
          <Tag color={planInfo.color} style={{ margin: 0 }}>{planInfo.label}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <Icon icon={Clock} size={12} /> {periodStart} — {periodEnd}
          </Text>
        </Flexbox>
      </Flexbox>

      {/* Credits Overview */}
      <Card style={{ borderRadius: 12 }}>
        <Flexbox gap={16}>
          <Flexbox align="center" gap={8} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
            <Flexbox align="center" gap={8} horizontal>
              <Icon icon={Sparkle} size={18} style={{ color: cssVar.colorPrimary }} />
              <Title level={5} style={{ margin: 0 }}>Crédits</Title>
            </Flexbox>
            <Text style={{ fontSize: 24, fontWeight: 700 }}>
              {formatNumber(usage.credits.used)}
              <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
                {' '}/ {formatNumber(usage.credits.limit)}
              </Text>
            </Text>
          </Flexbox>
          <Progress
            percent={creditsPercent}
            showInfo={false}
            size="default"
            strokeColor={getProgressColor(creditsPercent)}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatNumber(usage.credits.limit - usage.credits.used)} crédits restants pour cette période
          </Text>
        </Flexbox>
      </Card>

      {/* Stats Grid */}
      <Flexbox gap={16} horizontal style={{ flexWrap: 'wrap' }}>
        <StatCard
          icon={MessageSquare}
          label="Messages"
          limit={usage.messages.limit}
          used={usage.messages.used}
        />
        <StatCard
          icon={HardDrive}
          label="Stockage fichiers"
          limit={usage.storage.files.limit}
          suffix="MB"
          used={usage.storage.files.used}
        />
        <StatCard
          icon={BrainCircuit}
          label="Vecteurs"
          limit={usage.storage.vectors.limit}
          used={usage.storage.vectors.used}
        />
      </Flexbox>

      {/* Usage by Model */}
      <Card style={{ borderRadius: 12 }}>
        <Flexbox gap={16}>
          <Flexbox align="center" gap={8} horizontal>
            <Icon icon={Zap} size={18} />
            <Title level={5} style={{ margin: 0 }}>Consommation par modèle</Title>
          </Flexbox>
          <Flexbox gap={8}>
            {[
              { color: '#ab68ff', credits: 0, model: 'GPT-4o mini', messages: 0 },
              { color: '#10a37f', credits: 0, model: 'GPT-4o', messages: 0 },
              { color: '#d97757', credits: 0, model: 'Claude 3.5 Sonnet', messages: 0 },
              { color: '#52c41a', credits: 0, model: 'DeepSeek R1', messages: 0 },
            ].map((item) => (
              <Flexbox
                align="center"
                horizontal
                justify="space-between"
                key={item.model}
                style={{
                  borderBottom: `1px solid ${cssVar.colorBorderSecondary}`,
                  paddingBlock: 10,
                }}
              >
                <Flexbox align="center" gap={10} horizontal>
                  <div
                    style={{
                      background: item.color,
                      borderRadius: '50%',
                      height: 8,
                      width: 8,
                    }}
                  />
                  <Text style={{ fontSize: 13 }}>{item.model}</Text>
                </Flexbox>
                <Flexbox align="center" gap={16} horizontal>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.messages} messages
                  </Text>
                  <Text strong style={{ fontSize: 13 }}>
                    {formatNumber(item.credits)} crédits
                  </Text>
                </Flexbox>
              </Flexbox>
            ))}
          </Flexbox>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Les données de consommation seront mises à jour en temps réel une fois l&apos;API connectée.
          </Text>
        </Flexbox>
      </Card>

      {/* Quick Links */}
      <Card style={{ borderRadius: 12 }}>
        <Flexbox align="center" gap={16} horizontal justify="space-between" style={{ flexWrap: 'wrap' }}>
          <Flexbox gap={4}>
            <Flexbox align="center" gap={8} horizontal>
              <Icon icon={CreditCard} size={16} />
              <Text strong>Besoin de plus de crédits ?</Text>
            </Flexbox>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Passez à un plan supérieur pour augmenter vos limites.
            </Text>
          </Flexbox>
          <a href="/subscription" style={{ textDecoration: 'none' }}>
            <Tag color="blue" style={{ cursor: 'pointer', fontSize: 13, padding: '4px 12px' }}>
              Voir les plans →
            </Tag>
          </a>
        </Flexbox>
      </Card>
    </Flexbox>
  );
});

UsagePage.displayName = 'UsagePage';

export default UsagePage;
