'use client';

import React, { useState, useEffect } from 'react';
import { Flexbox } from '@lobehub/ui';
import { Tag, Input } from 'antd';
import { createStyles } from 'antd-style';
import {
    PlayCircle,
    Search,
    Clock,
    Eye,
    Bot,
    MessageSquare,
    Brain,
    Link2,
    CreditCard,
    Shield,
    Rocket,
    Users,
    Sparkles,
    Play,
} from 'lucide-react';

// ─── Video data ───
const CATEGORIES = [
    { id: 'all', label: 'Tous', icon: <Sparkles size={14} /> },
    { id: 'getting-started', label: 'Prise en main', icon: <Rocket size={14} /> },
    { id: 'agents', label: 'Agents IA', icon: <Bot size={14} /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={14} /> },
    { id: 'models', label: 'Modèles IA', icon: <Brain size={14} /> },
    { id: 'integrations', label: 'Intégrations', icon: <Link2 size={14} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={14} /> },
    { id: 'billing', label: 'Abonnements', icon: <CreditCard size={14} /> },
];

const VIDEOS = [
    {
        id: 'intro',
        title: 'Découvrir Connect en 3 minutes',
        description: 'Présentation complète de la plateforme Connect et de ses fonctionnalités principales.',
        category: 'getting-started',
        duration: '3:12',
        views: '2.4k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
        featured: true,
    },
    {
        id: 'create-account',
        title: 'Créer son compte et configurer son espace',
        description: 'Apprenez à créer votre compte Connect, choisir votre plan et personnaliser votre espace de travail.',
        category: 'getting-started',
        duration: '4:35',
        views: '1.8k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'first-agent',
        title: 'Créer votre premier agent IA',
        description: 'Guide pas à pas pour créer, configurer et tester votre premier agent conversationnel.',
        category: 'agents',
        duration: '6:20',
        views: '3.1k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'system-prompt',
        title: 'Maîtriser le prompt système',
        description: 'Techniques avancées pour rédiger des prompts efficaces qui donnent des résultats exceptionnels.',
        category: 'agents',
        duration: '8:45',
        views: '2.7k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'knowledge-base',
        title: 'Configurer la base de connaissances',
        description: 'Uploadez vos documents PDF, Word et CSV pour que votre agent réponde avec vos données.',
        category: 'agents',
        duration: '5:10',
        views: '1.5k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'agent-team',
        title: "Créer une équipe d'agents collaboratifs",
        description: "Configurez plusieurs agents qui travaillent ensemble pour gérer des scénarios complexes.",
        category: 'agents',
        duration: '7:30',
        views: '980',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'connect-whatsapp',
        title: 'Connecter WhatsApp en 60 secondes',
        description: 'Scannez le QR code et connectez votre WhatsApp à Connect en moins d\'une minute.',
        category: 'whatsapp',
        duration: '1:45',
        views: '4.2k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'auto-messages',
        title: 'Configurer les messages automatiques',
        description: 'Mettez en place les réponses automatiques, horaires d\'activité et messages d\'absence.',
        category: 'whatsapp',
        duration: '5:55',
        views: '2.1k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'whatsapp-groups',
        title: 'Gérer les groupes et la diffusion',
        description: 'Utilisez votre agent dans les groupes WhatsApp et envoyez des messages de diffusion.',
        category: 'whatsapp',
        duration: '4:20',
        views: '1.3k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'choose-model',
        title: 'Choisir le bon modèle IA',
        description: 'Comparaison des modèles GPT-4o, Claude, DeepSeek, Gemini et comment choisir le meilleur pour votre usage.',
        category: 'models',
        duration: '6:40',
        views: '1.9k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'byok-setup',
        title: 'Configurer le BYOK (Bring Your Own Key)',
        description: 'Utilisez vos propres clés API pour économiser -50% sur votre abonnement Connect.',
        category: 'models',
        duration: '4:15',
        views: '1.1k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'google-sheets',
        title: 'Intégration Google Sheets',
        description: 'Connectez Google Sheets pour enregistrer automatiquement les leads et données de conversation.',
        category: 'integrations',
        duration: '5:30',
        views: '1.6k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'webhooks-api',
        title: 'Webhooks et API REST',
        description: 'Configurez des webhooks et utilisez l\'API REST pour des intégrations personnalisées.',
        category: 'integrations',
        duration: '7:15',
        views: '890',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'crm-contacts',
        title: 'Gérer vos contacts et le CRM',
        description: 'Organisez vos contacts avec des tags, segments et suivez l\'historique des conversations.',
        category: 'crm',
        duration: '5:00',
        views: '1.2k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
    {
        id: 'plans-credits',
        title: 'Comprendre les plans et les crédits',
        description: 'Tout savoir sur les abonnements, le système de crédits et comment optimiser votre consommation.',
        category: 'billing',
        duration: '4:50',
        views: '2.0k',
        thumbnail: '/connect-logo.png',
        youtubeId: '',
    },
];

const useStyles = createStyles(({ css }: { css: any }) => ({
    main: css`
        background: #fff;
        min-height: 100vh;
        color: #000;
    `,
    hero: css`
        padding: 140px 24px 60px;
        text-align: center;
        background: linear-gradient(180deg, rgba(7, 94, 84, 0.04) 0%, #fff 100%);
    `,
    container: css`
        width: 100%;
        max-width: 1200px;
        padding: 0 24px;
        margin: 0 auto;
    `,
    categoryBar: css`
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 48px;
    `,
    categoryBtn: css`
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 18px;
        border-radius: 100px;
        border: 1px solid rgba(0,0,0,0.08);
        background: #fff;
        font-size: 13px;
        font-weight: 600;
        color: #555;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            border-color: #075e54;
            color: #075e54;
            background: rgba(7, 94, 84, 0.03);
        }
    `,
    categoryBtnActive: css`
        background: #075e54 !important;
        color: #fff !important;
        border-color: #075e54 !important;
    `,
    featuredCard: css`
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.06);
        margin-bottom: 56px;
        display: grid;
        grid-template-columns: 1fr;
        @media (min-width: 768px) {
            grid-template-columns: 1.3fr 1fr;
        }
        transition: box-shadow 0.3s;
        &:hover {
            box-shadow: 0 16px 48px rgba(7, 94, 84, 0.1);
        }
    `,
    featuredThumbnail: css`
        position: relative;
        background: linear-gradient(135deg, #075e54 0%, #128c7e 50%, #25d366 100%);
        min-height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        @media (min-width: 768px) {
            min-height: 340px;
        }
    `,
    featuredPlayBtn: css`
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: all 0.3s;
        &:hover {
            background: rgba(255,255,255,0.35);
            transform: scale(1.1);
        }
    `,
    featuredInfo: css`
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        @media (min-width: 768px) {
            padding: 40px;
        }
    `,
    videoGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
        margin-bottom: 80px;
    `,
    videoCard: css`
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.06);
        overflow: hidden;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
            border-color: rgba(7, 94, 84, 0.2);
            box-shadow: 0 12px 32px rgba(7, 94, 84, 0.08);
            transform: translateY(-4px);
        }
    `,
    videoThumbnail: css`
        position: relative;
        background: linear-gradient(135deg, #075e54 0%, #128c7e 100%);
        height: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    videoPlayBtn: css`
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: all 0.3s;
    `,
    videoInfo: css`
        padding: 20px;
    `,
    durationBadge: css`
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
    `,
    comingSoon: css`
        position: absolute;
        top: 12px;
        left: 12px;
        background: rgba(255,255,255,0.9);
        color: #075e54;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
    `,
    meta: css`
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: #999;
        margin-top: 12px;
    `,
}));

const TutorialPage = () => {
    const { styles, cx } = useStyles();
    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filteredVideos = VIDEOS.filter((v) => {
        const matchCategory = activeCategory === 'all' || v.category === activeCategory;
        const matchSearch = !searchQuery.trim() ||
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const featuredVideo = VIDEOS.find((v) => v.featured);
    const gridVideos = filteredVideos.filter((v) => !v.featured || activeCategory !== 'all');

    return (
        <main className={styles.main}>
            {/* ─── Hero ─── */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Tag color="#075e54" style={{ borderRadius: 100, padding: '4px 16px', fontWeight: 700, fontSize: 13, marginBottom: 20 }}>
                        <PlayCircle size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                        Tutoriels vidéo
                    </Tag>
                    <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
                        Apprenez Connect<br />
                        <span style={{ color: '#075e54' }}>en vidéo</span>
                    </h1>
                    <p style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
                        Des tutoriels courts et pratiques pour maîtriser chaque fonctionnalité de Connect. Du débutant à l'expert.
                    </p>
                    <div style={{ maxWidth: 480, margin: '0 auto' }}>
                        <Input
                            prefix={<Search size={16} style={{ color: '#999' }} />}
                            placeholder="Rechercher un tutoriel..."
                            size="large"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                            style={{ borderRadius: 12, height: 48 }}
                        />
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                {/* ─── Categories ─── */}
                <div className={styles.categoryBar}>
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className={cx(styles.categoryBtn, activeCategory === cat.id && styles.categoryBtnActive)}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.icon} {cat.label}
                        </div>
                    ))}
                </div>

                {/* ─── Featured video ─── */}
                {featuredVideo && activeCategory === 'all' && !searchQuery.trim() && (
                    <div className={styles.featuredCard}>
                        <div className={styles.featuredThumbnail}>
                            <div className={styles.comingSoon}>Bientôt disponible</div>
                            <div className={styles.featuredPlayBtn}>
                                <Play size={36} fill="#fff" />
                            </div>
                            <div className={styles.durationBadge}>
                                <Clock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />
                                {featuredVideo.duration}
                            </div>
                        </div>
                        <div className={styles.featuredInfo}>
                            <Tag color="green" style={{ borderRadius: 6, width: 'fit-content', marginBottom: 12, fontWeight: 600 }}>
                                Recommandé
                            </Tag>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
                                {featuredVideo.title}
                            </h2>
                            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
                                {featuredVideo.description}
                            </p>
                            <div className={styles.meta}>
                                <Flexbox horizontal align="center" gap={4}>
                                    <Eye size={13} /> {featuredVideo.views} vues
                                </Flexbox>
                                <Flexbox horizontal align="center" gap={4}>
                                    <Clock size={13} /> {featuredVideo.duration}
                                </Flexbox>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Video grid ─── */}
                {gridVideos.length > 0 ? (
                    <div className={styles.videoGrid}>
                        {gridVideos.map((video) => (
                            <div key={video.id} className={styles.videoCard}>
                                <div className={styles.videoThumbnail}>
                                    <div className={styles.comingSoon}>Bientôt disponible</div>
                                    <div className={styles.videoPlayBtn}>
                                        <Play size={24} fill="#fff" />
                                    </div>
                                    <div className={styles.durationBadge}>
                                        <Clock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />
                                        {video.duration}
                                    </div>
                                </div>
                                <div className={styles.videoInfo}>
                                    <Tag color="green" style={{ borderRadius: 4, marginBottom: 8, fontSize: 11 }}>
                                        {CATEGORIES.find((c) => c.id === video.category)?.label}
                                    </Tag>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>
                                        {video.title}
                                    </h3>
                                    <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5, marginBottom: 0 }}>
                                        {video.description}
                                    </p>
                                    <div className={styles.meta}>
                                        <Flexbox horizontal align="center" gap={4}>
                                            <Eye size={12} /> {video.views}
                                        </Flexbox>
                                        <Flexbox horizontal align="center" gap={4}>
                                            <Clock size={12} /> {video.duration}
                                        </Flexbox>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0 80px', color: '#999' }}>
                        <Search size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
                        <p style={{ fontSize: 16, fontWeight: 600 }}>Aucun tutoriel trouvé</p>
                        <p style={{ fontSize: 14 }}>Essayez un autre terme de recherche ou une autre catégorie.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TutorialPage;
