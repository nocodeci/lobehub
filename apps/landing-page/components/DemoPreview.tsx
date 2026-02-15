import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Loader2, ExternalLink, MousePointerClick } from 'lucide-react';

export default function DemoPreview() {
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [isInteractive, setIsInteractive] = useState(false);
    const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeContainerRef = useRef<HTMLDivElement>(null);

    // Only load iframe when the user has scrolled the component into view
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Delay iframe load to avoid scroll jump on initial render
                    timeout = setTimeout(() => {
                        setShouldLoadIframe(true);
                    }, 300);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px', threshold: 0.1 }
        );
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, []);

    // Initial check and resize listener for responsiveness
    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            // Calculate scale factor to force desktop view (1280px base) on mobile
            if (width < 1280 && iframeContainerRef.current) {
                const containerWidth = iframeContainerRef.current.offsetWidth;
                setScaleFactor(containerWidth / 1280);
            } else {
                setScaleFactor(1);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track scroll progress relative to this component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const rotateXValue = isMobile ? 10 : 20;
    const rotateX = useTransform(scrollYProgress, [0, 1], [rotateXValue, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
    const translateZ = useTransform(scrollYProgress, [0, 1], [isMobile ? -50 : -100, 0]);

    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const springScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Base desktop dimensions
    const DESKTOP_WIDTH = 1280;
    const DESKTOP_HEIGHT = 800;

    // Resulting display height after scaling
    const displayHeight = DESKTOP_HEIGHT * scaleFactor;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                perspective: '2000px',
                paddingBottom: isMobile ? '20px' : '40px',
            }}
        >
            <motion.div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    borderRadius: isMobile ? 12 : 20,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 32px 100px rgba(7,94,84,0.12), 0 8px 32px rgba(0,0,0,0.06)',
                    background: '#0a0a0a',
                    rotateX: springRotateX,
                    scale: springScale,
                    z: translateZ,
                    transformOrigin: 'top center',
                }}
            >
                {/* ── macOS-style title bar ── */}
                <div
                    style={{
                        height: isMobile ? 36 : 44,
                        background: '#1a1a1a',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: isMobile ? '0 12px' : '0 16px',
                        gap: 8,
                        zIndex: 20
                    }}
                >
                    {!isMobile && (
                        <div style={{ display: 'flex', gap: 7, marginRight: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
                        </div>
                    )}

                    <div
                        style={{
                            flex: 1,
                            maxWidth: isMobile ? 'none' : 460,
                            margin: isMobile ? 0 : '0 auto',
                            height: 24,
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            fontSize: 11,
                            color: 'rgba(255,255,255,0.45)',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        app.connect.wozif.com
                    </div>

                    <a
                        href="https://app.connect.wozif.com/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            color: 'rgba(255,255,255,0.4)',
                            transition: 'color .15s',
                            textDecoration: 'none',
                        }}
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* ── iframe container ── */}
                <div
                    ref={iframeContainerRef}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: displayHeight,
                        background: '#0a0a0a',
                        overflow: 'hidden',
                        cursor: isInteractive ? 'default' : 'pointer'
                    }}
                    onClick={() => setIsInteractive(true)}
                >
                    {/* Interaction Overlay (Allows scrolling the page until clicked) */}
                    <AnimatePresence>
                        {!isInteractive && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                whileHover={{ background: 'rgba(0,0,0,0.85)' }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'background 0.3s ease'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    color: 'white',
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    <div style={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: '50%',
                                        background: 'rgba(7,94,84,0.9)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 20px rgba(7,94,84,0.4)'
                                    }}>
                                        <MousePointerClick size={24} />
                                    </div>
                                    <span style={{
                                        fontWeight: 600,
                                        fontSize: isMobile ? 14 : 16,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        Cliquer pour explorer la démo
                                    </span>
                                    <span style={{
                                        fontSize: 12,
                                        opacity: 0.8,
                                        maxWidth: 200
                                    }}>
                                        (Le défilement de la page reste actif tant que vous ne cliquez pas)
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Exit interaction button */}
                    {isInteractive && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsInteractive(false);
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 30,
                                background: 'rgba(0,0,0,0.7)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: 30,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            Quitter l'aperçu interactif
                        </button>
                    )}
                    {/* Loading overlay */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 16,
                                zIndex: 11,
                                background: '#0a0a0a',
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 size={isMobile ? 24 : 32} color="#075e54" />
                            </motion.div>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                                Chargement...
                            </span>
                        </motion.div>
                    )}

                    <div style={{
                        width: DESKTOP_WIDTH,
                        height: DESKTOP_HEIGHT,
                        transform: `scale(${scaleFactor})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: isInteractive ? 'auto' : 'none'
                    }}>
                        {shouldLoadIframe && (
                            <iframe
                                src="https://app.connect.wozif.com/demo"
                                title="Connect - Plateforme d'automatisation IA"
                                loading="lazy"
                                allow="clipboard-write"
                                tabIndex={-1}
                                onLoad={() => {
                                    const scrollY = window.scrollY;
                                    setLoading(false);
                                    requestAnimationFrame(() => {
                                        window.scrollTo(0, scrollY);
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: 'block',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* ── "Aperçu démo" badge ── */}
                <div
                    style={{
                        position: 'absolute',
                        top: isMobile ? 44 : 52,
                        right: 8,
                        background: '#075e54',
                        color: '#fff',
                        fontSize: isMobile ? 8 : 10,
                        fontWeight: 700,
                        padding: isMobile ? '2px 8px' : '4px 12px',
                        borderRadius: 20,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        zIndex: 15,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 12px rgba(7,94,84,0.3)',
                    }}
                >
                    Aperçu démo
                </div>
            </motion.div>
        </div>
    );
}
