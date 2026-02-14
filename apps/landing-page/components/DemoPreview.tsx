import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Loader2, ExternalLink } from 'lucide-react';

/**
 * Embeds the real Wozif Connect platform in demo mode via iframe.
 * The /demo route on the platform skips authentication and lets visitors
 * explore the full UI without logging in.
 */
export default function DemoPreview() {
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress relative to this component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    // Transform scroll progress into 3D rotation and scale
    // Starts tilted (20 deg) and smaller (0.9), ends flat (0 deg) and full size (1)
    const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
    const translateZ = useTransform(scrollYProgress, [0, 1], [-100, 0]);

    // Apply smooth springing
    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const springScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                perspective: '2000px', // Essential for 3D rotation
                paddingBottom: '40px',
            }}
        >
            <motion.div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 32px 100px rgba(7,94,84,0.12), 0 8px 32px rgba(0,0,0,0.06)',
                    background: '#0a0a0a',
                    // Apply transformed values
                    rotateX: springRotateX,
                    scale: springScale,
                    z: translateZ,
                    transformOrigin: 'top center',
                }}
            >
                {/* ── macOS-style title bar ── */}
                <div
                    style={{
                        height: 44,
                        background: '#1a1a1a',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        gap: 8,
                    }}
                >
                    {/* Traffic lights */}
                    <div style={{ display: 'flex', gap: 7, marginRight: 12 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#ff5f57',
                            }}
                        />
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#febc2e',
                            }}
                        />
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#28c840',
                            }}
                        />
                    </div>

                    {/* URL bar */}
                    <div
                        style={{
                            flex: 1,
                            maxWidth: 460,
                            margin: '0 auto',
                            height: 28,
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.45)',
                            fontFamily:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        app.connect.wozif.com
                    </div>

                    {/* Open in new tab */}
                    <a
                        href="https://app.connect.wozif.com/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
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
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: 780,
                        background: '#0a0a0a',
                    }}
                >
                    {/* Loading overlay */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 16,
                                zIndex: 5,
                                background: '#0a0a0a',
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 size={32} color="#075e54" />
                            </motion.div>
                            <span
                                style={{
                                    fontSize: 14,
                                    color: 'rgba(255,255,255,0.5)',
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                Chargement de la plateforme...
                            </span>
                        </motion.div>
                    )}

                    <iframe
                        src="https://app.connect.wozif.com/demo"
                        title="Connect - Plateforme d'automatisation IA"
                        loading="lazy"
                        allow="clipboard-write"
                        onLoad={() => setLoading(false)}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            display: 'block',
                        }}
                    />
                </div>

                {/* ── "Aperçu démo" badge ── */}
                <div
                    style={{
                        position: 'absolute',
                        top: 52,
                        right: 12,
                        background: '#075e54',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 20,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        zIndex: 10,
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
