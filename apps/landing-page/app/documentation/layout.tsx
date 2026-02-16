'use client';

import React, { useState, useEffect } from 'react';
import { Flexbox } from '@lobehub/ui';
import { Input } from 'antd';
import { createStyles } from 'antd-style';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search,
    Compass,
    Bot,
    MessageSquare,
    Brain,
    Users,
    Link2,
    Code2,
    CreditCard,
    Shield,
    HelpCircle,
    ChevronRight,
    ChevronDown,
} from 'lucide-react';

const NAV_SECTIONS = [
    {
        title: 'Prise en main',
        id: 'getting-started',
        icon: <Compass size={16} />,
        items: [
            { label: "Qu'est-ce que Connect ?", href: '/documentation' },
            { label: 'Créer un compte', href: '/documentation/getting-started/create-account' },
            { label: "Aperçu de l'interface", href: '/documentation/getting-started/interface' },
            { label: 'Créer votre premier agent', href: '/documentation/getting-started/first-agent' },
        ],
    },
    {
        title: 'Agents IA',
        id: 'agents',
        icon: <Bot size={16} />,
        items: [
            { label: 'Comprendre les agents', href: '/documentation/agents' },
            { label: 'Configurer un agent', href: '/documentation/agents/configure' },
            { label: 'Prompt système', href: '/documentation/agents/system-prompt' },
            { label: 'Base de connaissances', href: '/documentation/agents/knowledge-base' },
            { label: 'Outils & Plugins', href: '/documentation/agents/tools' },
            { label: "Équipe d'agents", href: '/documentation/agents/team' },
        ],
    },
    {
        title: 'WhatsApp',
        id: 'whatsapp',
        icon: <MessageSquare size={16} />,
        items: [
            { label: 'Connecter WhatsApp', href: '/documentation/whatsapp' },
            { label: 'Scanner le QR Code', href: '/documentation/whatsapp/scan-qr' },
            { label: 'Messages automatiques', href: '/documentation/whatsapp/auto-messages' },
            { label: 'Groupes & Diffusion', href: '/documentation/whatsapp/groups' },
        ],
    },
    {
        title: 'Modèles IA',
        id: 'ai-models',
        icon: <Brain size={16} />,
        items: [
            { label: 'Modèles disponibles', href: '/documentation/models' },
            { label: 'Consommation de crédits', href: '/documentation/models/credits' },
            { label: 'BYOK (Bring Your Own Key)', href: '/documentation/models/byok' },
            { label: 'Configurer un provider', href: '/documentation/models/provider' },
        ],
    },
    {
        title: 'CRM & Contacts',
        id: 'crm',
        icon: <Users size={16} />,
        items: [
            { label: 'Gestion des contacts', href: '/documentation/crm' },
            { label: 'Tags & Segments', href: '/documentation/crm/tags' },
            { label: 'Historique de conversations', href: '/documentation/crm/history' },
        ],
    },
    {
        title: 'Intégrations',
        id: 'integrations',
        icon: <Link2 size={16} />,
        items: [
            { label: 'Google Sheets', href: '/documentation/integrations' },
            { label: 'Webhooks', href: '/documentation/integrations/webhooks' },
            { label: 'API REST', href: '/documentation/integrations/api' },
            { label: 'Zapier & Make', href: '/documentation/integrations/zapier' },
        ],
    },
    {
        title: 'API & Développeur',
        id: 'api-developer',
        icon: <Code2 size={16} />,
        items: [
            { label: 'Introduction à l\'API', href: '/documentation/api' },
            { label: 'Clés API', href: '/documentation/api/keys' },
            { label: 'Authentification', href: '/documentation/api/authentication' },
            { label: 'Endpoints', href: '/documentation/api/endpoints' },
            { label: 'Exemples d\'intégration', href: '/documentation/api/examples' },
        ],
    },
    {
        title: 'Abonnements & Crédits',
        id: 'subscription',
        icon: <CreditCard size={16} />,
        items: [
            { label: 'Plans disponibles', href: '/documentation/subscription' },
            { label: 'Système de crédits', href: '/documentation/subscription/credits' },
            { label: 'Changer de plan', href: '/documentation/subscription/change-plan' },
            { label: 'Facturation', href: '/documentation/subscription/billing' },
        ],
    },
    {
        title: 'Sécurité & Compte',
        id: 'security',
        icon: <Shield size={16} />,
        items: [
            { label: 'Paramètres du compte', href: '/documentation/security' },
            { label: 'Données & Confidentialité', href: '/documentation/security/privacy' },
            { label: 'SSO & Authentification', href: '/documentation/security/sso' },
        ],
    },
    {
        title: 'FAQ',
        id: 'faq',
        icon: <HelpCircle size={16} />,
        items: [
            { label: 'Questions fréquentes', href: '/documentation/faq' },
        ],
    },
];

const useStyles = createStyles(({ css }: { css: any }) => ({
    layout: css`
        display: flex;
        min-height: 100vh;
        background: #fff;
        color: #1a1a1a;
    `,
    sidebar: css`
        width: 280px;
        min-width: 280px;
        border-right: 1px solid rgba(0,0,0,0.06);
        padding: 120px 0 40px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        background: #fafbfc;
        @media (max-width: 900px) {
            display: none;
        }
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
    `,
    sidebarLogo: css`
        padding: 0 24px 24px;
        border-bottom: 1px solid rgba(0,0,0,0.06);
        margin-bottom: 16px;
    `,
    navSection: css`
        padding: 4px 16px;
    `,
    navSectionTitle: css`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        color: #333;
        padding: 10px 8px;
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.2s;
        &:hover { background: rgba(7, 94, 84, 0.05); }
    `,
    navItem: css`
        display: block;
        font-size: 13px;
        color: #666;
        padding: 7px 8px 7px 32px;
        border-radius: 6px;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { color: #075e54; background: rgba(7, 94, 84, 0.05); }
    `,
    navItemActive: css`
        color: #075e54 !important;
        font-weight: 600;
        background: rgba(7, 94, 84, 0.08);
    `,
    mainContent: css`
        flex: 1;
        min-width: 0;
        padding: 120px 48px 80px;
        max-width: 900px;
        @media (max-width: 900px) {
            padding: 120px 20px 80px;
        }
    `,
}));

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
    const { styles } = useStyles();
    const pathname = usePathname();
    const router = useRouter();
    const [expandedNav, setExpandedNav] = useState<string[]>(() => {
        // Auto-expand the section matching current path
        const ids: string[] = [];
        for (const sec of NAV_SECTIONS) {
            if (sec.items.some((item) => item.href === pathname)) {
                ids.push(sec.id);
            }
        }
        return ids.length > 0 ? ids : ['getting-started'];
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Expand section when navigating
        for (const sec of NAV_SECTIONS) {
            if (sec.items.some((item) => item.href === pathname)) {
                setExpandedNav((prev) => prev.includes(sec.id) ? prev : [...prev, sec.id]);
            }
        }
    }, [pathname]);

    const toggleNav = (id: string) => {
        setExpandedNav((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const filteredSections = searchQuery.trim()
        ? NAV_SECTIONS.map((sec) => ({
            ...sec,
            items: sec.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter((sec) => sec.items.length > 0)
        : NAV_SECTIONS;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <Flexbox horizontal align="center" gap={10}>
                        <img src="/connect-logo.png" alt="Connect" style={{ width: 28, height: 28 }} />
                        <span style={{ fontWeight: 800, fontSize: 16 }}>Connect Docs</span>
                    </Flexbox>
                </div>

                <div style={{ padding: '8px 16px 16px' }}>
                    <Input
                        prefix={<Search size={14} style={{ color: '#999' }} />}
                        placeholder="Rechercher..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        allowClear
                        style={{ borderRadius: 8 }}
                    />
                </div>

                {filteredSections.map((sec) => (
                    <div key={sec.id} className={styles.navSection}>
                        <div
                            className={styles.navSectionTitle}
                            onClick={() => toggleNav(sec.id)}
                        >
                            {sec.icon}
                            <span style={{ flex: 1 }}>{sec.title}</span>
                            {expandedNav.includes(sec.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        {expandedNav.includes(sec.id) && sec.items.map((item) => (
                            <div
                                key={item.href}
                                className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                                onClick={() => router.push(item.href)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                ))}
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
