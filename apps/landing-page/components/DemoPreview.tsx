'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Home,
    FilePen,
    ChevronDown,
    PanelLeftClose,
    Settings,
    CreditCard,
    BarChart3,
    LibraryBig,
    BrainCircuit,
    CircleHelp,
    Monitor,
    Send,
    Paperclip,
    Blocks,
    Bot,
    Users2,
    Settings2,
    GlobeOff,
} from 'lucide-react';

/* ─── tiny helper ─── */
const Ico = ({ children, size = 18, color }: { children: React.ReactNode; size?: number; color?: string }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {children}
    </span>
);

/* ─── Sidebar nav item ─── */
const NavItem = ({
    icon,
    label,
    active,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            paddingInline: 4,
            borderRadius: 8,
            cursor: 'pointer',
            background: active ? 'rgba(7,94,84,0.08)' : 'transparent',
            transition: 'background .15s',
        }}
    >
        <div
            style={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            <Ico size={18} color={active ? 'var(--demo-text)' : 'var(--demo-text-secondary)'}>{icon}</Ico>
        </div>
        <span
            style={{
                flex: 1,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--demo-text)' : 'var(--demo-text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            {label}
        </span>
    </div>
);

/* ─── Skeleton line ─── */
const Skel = ({ w = '100%' }: { w?: string }) => (
    <div
        style={{
            height: 16,
            borderRadius: 4,
            background: 'var(--demo-skeleton)',
            width: w,
            opacity: 0.55,
        }}
    />
);
const SkelCircle = () => (
    <div
        style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--demo-skeleton)',
            flexShrink: 0,
        }}
    />
);

/* ─── Skill logo chip ─── */
const SkillLogo = ({ src, alt, offset }: { src: string; alt: string; offset: number }) => (
    <div
        style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#fff',
            border: '1.5px solid var(--demo-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: offset > 0 ? -6 : 0,
            zIndex: offset,
            position: 'relative',
        }}
    >
        <img src={src} alt={alt} width={14} height={14} style={{ objectFit: 'contain' }} />
    </div>
);

/* ─── Typing dots animation ─── */
const TypingDots = () => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#075e54',
                }}
            />
        ))}
    </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function DemoPreview() {
    const [activeNav, setActiveNav] = useState('home');
    const [showTyping, setShowTyping] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [inputText, setInputText] = useState('');
    const [userSent, setUserSent] = useState(false);

    // Auto‑play demo typing animation
    useEffect(() => {
        const t1 = setTimeout(() => setShowTyping(true), 2000);
        const t2 = setTimeout(() => {
            setShowTyping(false);
            setShowReply(true);
        }, 4200);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setUserSent(true);
        setInputText('');
        setTimeout(() => setShowTyping(true), 500);
        setTimeout(() => {
            setShowTyping(false);
        }, 2500);
    };

    const skills = [
        { src: 'https://hub-apac-1.lobeobjects.space/assets/logos/gmail.svg', alt: 'Gmail' },
        { src: 'https://hub-apac-1.lobeobjects.space/assets/logos/googledrive.svg', alt: 'Drive' },
        { src: 'https://hub-apac-1.lobeobjects.space/assets/logos/googlecalendar.svg', alt: 'Calendar' },
        { src: 'https://hub-apac-1.lobeobjects.space/assets/logos/slack.svg', alt: 'Slack' },
        { src: 'https://hub-apac-1.lobeobjects.space/assets/logos/notion.svg', alt: 'Notion' },
    ];

    return (
        <div
            className="demo-preview-root"
            style={{
                /* CSS custom properties for theming */
                ['--demo-bg' as any]: '#f5f5f5',
                ['--demo-sidebar-bg' as any]: '#fafafa',
                ['--demo-surface' as any]: '#ffffff',
                ['--demo-text' as any]: '#1a1a1a',
                ['--demo-text-secondary' as any]: '#888',
                ['--demo-border' as any]: 'rgba(0,0,0,0.06)',
                ['--demo-skeleton' as any]: 'rgba(0,0,0,0.06)',
                ['--demo-accent' as any]: '#075e54',
                width: '100%',
                maxWidth: 1100,
                margin: '0 auto',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--demo-border)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                height: 620,
                background: 'var(--demo-bg)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: 13,
                color: 'var(--demo-text)',
                position: 'relative',
            }}
        >
            {/* ──── SIDEBAR ──── */}
            <aside
                style={{
                    width: 260,
                    minWidth: 260,
                    height: '100%',
                    background: 'var(--demo-sidebar-bg)',
                    borderRight: '1px solid var(--demo-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Sidebar Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 8px',
                        borderBottom: '1px solid var(--demo-border)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                            alt="Connect"
                            width={28}
                            height={28}
                            src="https://app.connect.wozif.com/branding/wozif-elephant.png"
                            style={{ borderRadius: 6, flexShrink: 0 }}
                        />
                        <span style={{ fontWeight: 800, fontSize: 16, userSelect: 'none' }}>Connect</span>
                        <Ico size={14} color="var(--demo-text-secondary)"><ChevronDown size={14} /></Ico>
                    </div>
                    <Ico size={18} color="var(--demo-text-secondary)"><PanelLeftClose size={18} /></Ico>
                </div>

                {/* Search */}
                <div style={{ padding: '4px 6px' }}>
                    <NavItem icon={<Search size={18} />} label="Search" />
                </div>

                {/* Nav Links */}
                <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <NavItem icon={<Home size={18} />} label="Home" active={activeNav === 'home'} onClick={() => setActiveNav('home')} />
                    <NavItem icon={<FilePen size={18} />} label="Pages" onClick={() => setActiveNav('pages')} active={activeNav === 'pages'} />
                </div>

                {/* Agent Section */}
                <div style={{ padding: '8px 6px 0', flex: 1, overflow: 'hidden' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '4px 8px',
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--demo-text-secondary)' }}>Agent</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0' }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    height: 36,
                                    padding: '6px',
                                }}
                            >
                                <SkelCircle />
                                <Skel w={`${50 + Math.random() * 40}%`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Nav */}
                <div style={{ padding: '4px 6px 4px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <NavItem icon={<BarChart3 size={18} />} label="Usage" />
                    <NavItem icon={<CreditCard size={18} />} label="Subscription" />
                    <NavItem icon={<Settings size={18} />} label="Settings" />
                    <NavItem icon={<LibraryBig size={18} />} label="Resources" />
                    <NavItem icon={<BrainCircuit size={18} />} label="Memory" />
                </div>

                {/* Sidebar Footer */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderTop: '1px solid var(--demo-border)',
                    }}
                >
                    <div style={{ display: 'flex', gap: 2 }}>
                        <Ico size={14} color="var(--demo-text-secondary)"><CircleHelp size={14} /></Ico>
                    </div>
                    <Ico size={14} color="var(--demo-text-secondary)"><Monitor size={14} /></Ico>
                </div>
            </aside>

            {/* ──── MAIN CONTENT ──── */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--demo-surface)',
                    borderRadius: '0 0 12px 0',
                    overflow: 'hidden',
                    padding: 8,
                }}
            >
                {/* Inner frame */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fbfbfb',
                        borderRadius: 12,
                        border: '1px solid var(--demo-border)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Top bar */}
                    <div style={{ height: 44, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} />

                    {/* Chat Content */}
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', paddingBottom: '12vh' }}>
                        <div style={{ width: '100%', maxWidth: 720, padding: '0 16px' }}>
                            {/* Greeting */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                style={{ textAlign: 'center', marginTop: 48, marginBottom: 40 }}
                            >
                                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg, #1a1a1a, #555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Bonsoir 👋
                                </div>
                                <div style={{ fontSize: 16, color: 'var(--demo-text-secondary)' }}>
                                    Comment puis-je vous aider aujourd&apos;hui ?
                                </div>
                            </motion.div>

                            {/* Skills Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                style={{
                                    background: 'var(--demo-surface)',
                                    border: '1px solid var(--demo-border)',
                                    borderRadius: 14,
                                    padding: '14px 18px',
                                    marginBottom: 24,
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <Ico color="var(--demo-accent)"><Blocks size={18} /></Ico>
                                    <span style={{ fontWeight: 600, fontSize: 13 }}>Add skills to Connect</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {skills.map((s, i) => (
                                        <SkillLogo key={s.alt} src={s.src} alt={s.alt} offset={i} />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Demo Reply Message */}
                            <AnimatePresence>
                                {showReply && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            background: 'rgba(7,94,84,0.06)',
                                            borderRadius: 16,
                                            borderBottomLeftRadius: 4,
                                            padding: '12px 16px',
                                            marginBottom: 12,
                                            maxWidth: '80%',
                                            fontSize: 13.5,
                                            lineHeight: 1.6,
                                            color: 'var(--demo-text)',
                                        }}
                                    >
                                        Bienvenue sur <strong>Wozif Connect</strong> ! Je peux vous aider à automatiser vos workflows WhatsApp, gérer vos agents IA, et connecter vos outils préférés. Que souhaitez-vous faire ? 🚀
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* User message if sent */}
                            <AnimatePresence>
                                {userSent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            background: 'var(--demo-accent)',
                                            color: '#fff',
                                            borderRadius: 16,
                                            borderBottomRightRadius: 4,
                                            padding: '12px 16px',
                                            marginBottom: 12,
                                            maxWidth: '80%',
                                            marginLeft: 'auto',
                                            fontSize: 13.5,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Comment créer mon premier agent WhatsApp ?
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {showTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            background: 'rgba(7,94,84,0.06)',
                                            borderRadius: 16,
                                            borderBottomLeftRadius: 4,
                                            padding: '10px 16px',
                                            maxWidth: 80,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <TypingDots />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ──── INPUT AREA ──── */}
                    <div style={{ padding: '0 16px 16px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            style={{
                                background: 'var(--demo-surface)',
                                border: '1px solid var(--demo-border)',
                                borderRadius: 20,
                                boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Text area */}
                            <div style={{ padding: '14px 16px', minHeight: 46 }}>
                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask, create, or start a task..."
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: 14,
                                        color: 'var(--demo-text)',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>

                            {/* Toolbar */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 8px',
                                    paddingRight: 12,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Model selector */}
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: '50%',
                                                background: '#d97757',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <svg fill="#fff" height="14" width="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <title>Claude</title>
                                                <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Settings2 */}
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -4 }}>
                                        <Ico size={20} color="var(--demo-text-secondary)"><Settings2 size={20} /></Ico>
                                    </div>

                                    {/* Globe off */}
                                    <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Ico size={20} color="var(--demo-text-secondary)"><GlobeOff size={20} /></Ico>
                                    </div>

                                    {/* Paperclip */}
                                    <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Ico size={20} color="var(--demo-text-secondary)"><Paperclip size={20} /></Ico>
                                    </div>

                                    {/* Blocks */}
                                    <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Ico size={20} color="var(--demo-text-secondary)"><Blocks size={20} /></Ico>
                                    </div>
                                </div>

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: 'var(--demo-accent)',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'transform .1s',
                                    }}
                                >
                                    <Send size={14} color="#fff" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.1 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                marginTop: 12,
                            }}
                        >
                            {[
                                { icon: <Bot size={16} />, label: 'Create Agent' },
                                { icon: <Users2 size={16} />, label: 'Create Group' },
                                { icon: <FilePen size={16} />, label: 'Write' },
                            ].map((btn) => (
                                <button
                                    key={btn.label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '7px 14px',
                                        borderRadius: 20,
                                        border: '1px solid var(--demo-border)',
                                        background: 'var(--demo-surface)',
                                        fontSize: 13,
                                        color: 'var(--demo-text-secondary)',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all .15s',
                                    }}
                                >
                                    <Ico size={16} color="var(--demo-text-secondary)">{btn.icon}</Ico>
                                    {btn.label}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Overlay label */}
            <div
                style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'var(--demo-accent)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 20,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    zIndex: 10,
                    pointerEvents: 'none',
                }}
            >
                Aperçu démo
            </div>
        </div>
    );
}
