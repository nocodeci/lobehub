import { isDesktop } from '@lobechat/const';
import { type PropsWithChildren } from 'react';

import { authEnv } from '@/envs/auth';
import { isDemoMode } from '@/utils/isDemoMode';

import BetterAuth from './BetterAuth';
import Desktop from './Desktop';
import NoAuth from './NoAuth';

const AuthProvider = ({ children }: PropsWithChildren) => {
  // In demo mode, skip auth entirely so the dashboard appears as unauthenticated
  if (isDemoMode()) {
    return <NoAuth>{children}</NoAuth>;
  }

  if (isDesktop) {
    return <Desktop>{children}</Desktop>;
  }

  if (authEnv.AUTH_SECRET) {
    return <BetterAuth>{children}</BetterAuth>;
  }

  return <NoAuth>{children}</NoAuth>;
};

export default AuthProvider;
