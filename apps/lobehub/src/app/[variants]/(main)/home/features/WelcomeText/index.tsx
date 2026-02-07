'use client';

import { Flexbox, Typography } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/slices/auth/selectors';

const { Title, Text } = Typography;

const useStyles = createStyles(({ css, token }) => ({
    container: css`
    padding-inline: 16px;
    text-align: center;
  `,
    greeting: css`
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
    subtitle: css`
    font-size: 16px;
    color: ${token.colorTextSecondary};
    margin-top: 8px;
  `,
}));

const WelcomeText = memo(() => {
    const { styles } = useStyles();
    const { t } = useTranslation('common');
    const isLogin = useUserStore(authSelectors.isLogin);
    const username = useUserStore((s) => s.user?.fullName || s.user?.username);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 18) return 'Bon après-midi';
        return 'Bonsoir';
    };

    return (
        <Flexbox align="center" className={styles.container} gap={8}>
            <span className={styles.greeting}>
                {getGreeting()}{isLogin && username ? `, ${username}` : ''} 👋
            </span>
            <span className={styles.subtitle}>
                Comment puis-je vous aider aujourd'hui ?
            </span>
        </Flexbox>
    );
});

export default WelcomeText;
