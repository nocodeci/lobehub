'use client';

import { ThemeProvider, MotionProvider } from '@lobehub/ui';
import { ConfigProvider, theme } from 'antd';
import { motion } from 'motion/react';
import React, { type ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const content = (
        <ThemeProvider appearance={'light'}>
            <MotionProvider motion={motion}>
                <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
                    {children}
                </ConfigProvider>
            </MotionProvider>
        </ThemeProvider>
    );

    if (!mounted) {
        return <div style={{ visibility: 'hidden' }}>{content}</div>;
    }

    return content;
};
