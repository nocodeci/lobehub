'use client';

import { Block, Flexbox, Icon, Text } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ProductLogo } from '@/components/Branding';
import UserAvatar from '@/features/User/UserAvatar';
import UserPanel from '@/features/User/UserPanel';
import { useBYOKCheck } from '@/hooks/useSubscription';
import { useUserStore } from '@/store/user';
import { authSelectors, userProfileSelectors } from '@/store/user/selectors';

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  business: { bg: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' },
  enterprise: { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff' },
  free: { bg: cssVar.colorFillSecondary as string, color: cssVar.colorTextSecondary as string },
  pro: { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#1a1a2e' },
  starter: { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff' },
};

const PLAN_LABELS: Record<string, string> = {
  business: 'Business',
  enterprise: 'Enterprise',
  free: 'Gratuit',
  pro: 'Pro',
  starter: 'Starter',
};

export const USER_DROPDOWN_ICON_ID = 'user-dropdown-icon';

const PlanBadge = memo(() => {
  const { plan } = useBYOKCheck();
  const colors = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const label = PLAN_LABELS[plan] || 'Gratuit';
  const isGradient = colors.bg.includes('gradient');

  return (
    <Link
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: 'none' }}
      to="/subscription"
    >
      <span
        style={{
          background: isGradient ? colors.bg : colors.bg,
          borderRadius: 10,
          color: colors.color,
          cursor: 'pointer',
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.3,
          lineHeight: 1,
          padding: '3px 7px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Link>
  );
});

PlanBadge.displayName = 'PlanBadge';

const User = memo<{ lite?: boolean }>(({ lite }) => {
  const [nickname, username, isSignedIn] = useUserStore((s) => [
    userProfileSelectors.nickName(s),
    userProfileSelectors.username(s),
    authSelectors.isLogin(s),
  ]);
  return (
    <UserPanel>
      <Block
        align={'center'}
        clickable
        gap={8}
        horizontal
        paddingBlock={2}
        style={{
          minWidth: 32,
          overflow: 'hidden',
          paddingInlineEnd: lite ? 2 : 8,
          paddingInlineStart: 2,
        }}
        variant={'borderless'}
      >
        <UserAvatar shape={'square'} size={28} />
        {!lite && (
          <Flexbox align={'center'} gap={4} horizontal style={{ overflow: 'hidden' }}>
            {!isSignedIn && (nickname || username) ? (
              <ProductLogo color={cssVar.colorText} size={28} type={'text'} />
            ) : (
              <Text
                ellipsis
                style={{
                  flex: 1,
                }}
                weight={500}
              >
                {nickname || username}
              </Text>
            )}
            <PlanBadge />
            <Icon
              color={cssVar.colorTextDescription}
              icon={ChevronDownIcon}
              id={USER_DROPDOWN_ICON_ID}
            />
          </Flexbox>
        )}
      </Block>
    </UserPanel>
  );
});

export default User;
