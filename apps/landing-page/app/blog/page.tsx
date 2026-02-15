'use client';

import {
    Flexbox,
    Button,
} from '@lobehub/ui';
import { Typography, Card, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

const useStyles = createStyles(({ css }) => ({
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
    max-width: 1200px;
    padding: 0 24px;
    margin: 0 auto;
  `,
    hero: css`
    padding: 120px 0 60px;
    text-align: center;
    background: linear-gradient(180deg, rgba(7, 94, 84, 0.03) 0%, #fff 100%);
    width: 100%;
  `,
    blogGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
    margin: 60px 0;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
  `,
    blogCard: css`
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    
    &:hover {
        transform: translateY(-8px);
        border-color: #075e54;
        box-shadow: 0 20px 40px rgba(7, 94, 84, 0.1);
        
        .card-image {
            transform: scale(1.05);
        }
    }
  `,
    imageWrapper: css`
    width: 100%;
    height: 220px;
    overflow: hidden;
    position: relative;
  `,
    cardImage: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  `,
    categoryTag: css`
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border: none;
    color: #075e54;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 12px;
  `,
    featuredCard: css`
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 32px;
    overflow: hidden;
    border: 2px solid #075e54;
    
    @media (max-width: 900px) {
        grid-column: span 1;
        grid-template-columns: 1fr;
    }
  `,
    featuredImage: css`
    width: 100%;
    height: 100%;
    min-height: 320px;
    object-fit: cover;
  `,
    featuredContent: css`
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
}));

const posts = [
    {
        slug: "connect-vs-wazzap-ai-comparatif",
        title: "Connect vs Wazzap AI : Comparatif complet 2026",
        desc: "Analyse détaillée des deux plateformes d'automatisation WhatsApp. Découvrez pourquoi Connect offre plus de puissance, de flexibilité et un meilleur rapport qualité-prix.",
        category: "Comparatif",
        date: "15 Fév 2026",
        readTime: "12 min",
        image: "/blog/connect-vs-wazzap.png",
        featured: true
    },
    {
        slug: "top-10-alternatives-automatisation-whatsapp",
        title: "Top 10 des outils d'automatisation WhatsApp en 2026",
        desc: "Comparatif complet des meilleures plateformes : Connect, Wazzap AI, Respond.io, WATI, Tidio, ManyChat et plus. Lequel choisir pour votre business ?",
        category: "Comparatif",
        date: "14 Fév 2026",
        readTime: "15 min",
        image: "/blog/top-10-tools.png",
    },
    {
        slug: "ia-experience-client-whatsapp",
        title: "L'IA au service de l'Expérience Client sur WhatsApp",
        desc: "Comment les agents intelligents transforment radicalement la manière dont les entreprises interagissent avec leurs clients.",
        category: "Intelligence Artificielle",
        date: "8 Fév 2026",
        readTime: "5 min",
        image: "/blog/ai-customer-experience.png",
    },
    {
        slug: "automatisation-agents-autonomes",
        title: "Automatisation 2.0 : L'ère des agents autonomes",
        desc: "Découvrez comment l'orchestration multi-agents révolutionne les processus métiers complexes sans intervention humaine.",
        category: "Innovation",
        date: "5 Fév 2026",
        readTime: "8 min",
        image: "/blog/autonomous-agents.png"
    },
    {
        slug: "guide-whatsapp-collect",
        title: "Guide complet : WhatsApp Collect pour votre business",
        desc: "Tout ce qu'il faut savoir pour mettre en place une collecte de données performante directement via WhatsApp.",
        category: "Tutoriel",
        date: "2 Fév 2026",
        readTime: "12 min",
        image: "/blog/whatsapp-collect-guide.png"
    },
    {
        slug: "erreurs-automatisation-whatsapp",
        title: "5 erreurs à éviter avec l'automatisation WhatsApp",
        desc: "Les pièges courants qui peuvent nuire à votre relation client et comment les éviter.",
        category: "Conseils",
        date: "28 Jan 2026",
        readTime: "6 min",
        image: "/blog/automation-errors.png"
    },
    {
        slug: "roi-automatisation-whatsapp",
        title: "ROI de l'automatisation WhatsApp : étude de cas",
        desc: "Analyse détaillée du retour sur investissement de 10 entreprises ayant adopté Connect.",
        category: "Études de cas",
        date: "25 Jan 2026",
        readTime: "10 min",
        image: "/blog/roi-case-study.png"
    },
    {
        slug: "whatsapp-business-api-vs-cloud-api",
        title: "WhatsApp Business API vs Cloud API : le guide",
        desc: "Comprendre les différences et choisir la meilleure option pour votre entreprise.",
        category: "Technique",
        date: "20 Jan 2026",
        readTime: "8 min",
        image: "/blog/whatsapp-api-vs-cloud.png"
    }
];

const BlogPage = () => {
    const { styles, cx } = useStyles();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const featuredPost = posts.find(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Tag color="success" style={{ marginBottom: 16, background: 'rgba(7, 94, 84, 0.1)', border: 'none', color: '#075e54', fontWeight: 700 }}>Blog Connect</Tag>
                    <Title level={1} style={{ fontSize: 56, fontWeight: 900, marginBottom: 24 }}>
                        IA & Automatisation :<br />Restez à la pointe
                    </Title>
                    <Paragraph style={{ fontSize: 20, color: '#666', maxWidth: 800, margin: '0 auto 40px' }}>
                        Analyses, guides et actualités pour transformer votre entreprise avec l'écosystème Connect.
                    </Paragraph>
                </div>
            </section>

            <section className={styles.container}>
                {/* Featured Article */}
                {featuredPost && (
                    <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                        <motion.div
                            className={styles.featuredCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={featuredPost.image} alt={featuredPost.title} className={styles.featuredImage} />
                            <div className={styles.featuredContent}>
                                <Tag style={{ width: 'fit-content', marginBottom: 16, background: 'rgba(7, 94, 84, 0.1)', border: 'none', color: '#075e54', fontWeight: 700 }}>
                                    ⭐ Article à la une
                                </Tag>
                                <Tag style={{ width: 'fit-content', marginBottom: 16, background: '#f5f5f5', border: 'none', color: '#666' }}>
                                    {featuredPost.category}
                                </Tag>
                                <Title level={2} style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
                                    {featuredPost.title}
                                </Title>
                                <Paragraph style={{ fontSize: 17, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>
                                    {featuredPost.desc}
                                </Paragraph>
                                <Flexbox horizontal gap={16} style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>
                                    <Flexbox horizontal align="center" gap={6}><Calendar size={14} />{featuredPost.date}</Flexbox>
                                    <Flexbox horizontal align="center" gap={6}><Clock size={14} />{featuredPost.readTime} de lecture</Flexbox>
                                </Flexbox>
                                <Button type="primary" style={{ width: 'fit-content', background: '#075e54', height: 48, borderRadius: 12, fontWeight: 700, paddingInline: 24 }}>
                                    Lire l'article <ArrowRight size={16} style={{ marginLeft: 8 }} />
                                </Button>
                            </div>
                        </motion.div>
                    </Link>
                )}

                {/* Blog Grid */}
                <div className={styles.blogGrid}>
                    {regularPosts.map((post, i) => (
                        <Link key={i} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={styles.blogCard} styles={{ body: { padding: 24 } }}>
                                    <div className={styles.imageWrapper}>
                                        <img src={post.image} alt={post.title} className={cx(styles.cardImage, "card-image")} />
                                        <div className={styles.categoryTag}>{post.category}</div>
                                    </div>
                                    <Flexbox gap={12} style={{ marginTop: 20, flex: 1 }}>
                                        <Flexbox horizontal gap={16} style={{ fontSize: 13, color: '#999' }}>
                                            <Flexbox horizontal align="center" gap={4}><Calendar size={14} />{post.date}</Flexbox>
                                            <Flexbox horizontal align="center" gap={4}><Clock size={14} />{post.readTime} de lecture</Flexbox>
                                        </Flexbox>
                                        <Title level={3} style={{ fontSize: 20, fontWeight: 800, margin: '8px 0', lineHeight: 1.3, color: '#000' }}>
                                            {post.title}
                                        </Title>
                                        <Paragraph style={{ color: '#666', fontSize: 15, lineHeight: 1.6, marginBottom: 0 }}>
                                            {post.desc}
                                        </Paragraph>
                                        <Flexbox horizontal align="center" gap={6} style={{ marginTop: 'auto', paddingTop: 16, color: '#075e54', fontWeight: 700, fontSize: 15 }}>
                                            Lire la suite <ArrowRight size={16} />
                                        </Flexbox>
                                    </Flexbox>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <Flexbox align="center" style={{ marginBottom: 100 }}>
                    <Button size="large" style={{ borderRadius: 12, fontWeight: 700, paddingInline: 40, height: 56 }}>
                        Voir plus d'articles
                    </Button>
                </Flexbox>
            </section>
        </main>
    );
};

export default BlogPage;
