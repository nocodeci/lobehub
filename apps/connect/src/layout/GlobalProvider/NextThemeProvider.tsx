'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

import { isDemoMode } from '@/utils/isDemoMode';

interface NextThemeProviderProps {
  children: ReactNode;
}

export default function NextThemeProvider({ children }: NextThemeProviderProps) {
  const isDemo = isDemoMode();

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={isDemo ? 'dark' : 'system'}
      disableTransitionOnChange
      enableSystem={!isDemo}
      forcedTheme={isDemo ? 'dark' : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
