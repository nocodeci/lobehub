'use client';

import {
    Flexbox,
    Button,
    Center,
} from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import {
    PlayCircle,
    BookOpen,
} from 'lucide-react';
import { StepsSection } from '@/components/StepsSection';

const { Title, Paragraph } = Typography;

const useStyles = createStyles(({ css }: { css: any }) => ({
    main: css`
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #000;
  `,
    container: css`
    width: 100%;
    max-width: 1100px;
    padding: 0 24px;
    margin: 0 auto;
  `,
    hero: css`
    padding: 120px 0 80px;
    text-align: center;
    background: linear-gradient(180deg, rgba(7, 94, 84, 0.05) 0%, #fff 100%);
    width: 100%;
  `,
    stepContainer: css`
    padding: 80px 0;
  `
}));

const TutorialPage = () => {
    const { styles } = useStyles();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Title level={1} style={{ fontSize: 56, fontWeight: 900, marginBottom: 24 }}>
                        Maîtrisez Connect en 5 minutes
                    </Title>
                    <Paragraph style={{ fontSize: 20, color: '#444', maxWidth: 800, margin: '0 auto 40px' }}>
                        Découvrez comment transformer vos conversations WhatsApp en véritables moteurs de productivité grâce à nos guides pas à pas.
                    </Paragraph>
                    <Flexbox horizontal gap={16} justify="center">
                        <Button size="large" type="primary" icon={<PlayCircle size={20} />} style={{ background: '#075e54', height: 56, paddingInline: 32, borderRadius: 12, fontWeight: 700 }}>
                            Regarder la démo
                        </Button>
                        <Button size="large" icon={<BookOpen size={20} />} style={{ height: 56, paddingInline: 32, borderRadius: 12, fontWeight: 700 }}>
                            Lire le guide complet
                        </Button>
                    </Flexbox>
                </div>
            </section>

            <section className={styles.stepContainer}>
                <div className={styles.container}>
                    <Center style={{ marginBottom: 60 }}>
                        <Title level={2} style={{ fontWeight: 900, fontSize: 36 }}>La méthode Connect</Title>
                        <Paragraph style={{ color: '#666', fontSize: 16 }}>Trois étapes simples pour automatiser votre business.</Paragraph>
                    </Center>

                    <StepsSection />
                </div>
            </section>
        </main>
    );
};

export default TutorialPage;
