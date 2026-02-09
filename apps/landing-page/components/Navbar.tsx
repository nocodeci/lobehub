'use client';

import React, { useState, useEffect } from 'react';
import { Flexbox } from '@lobehub/ui';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createStyles } from 'antd-style';
import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';

const useStyles = createStyles(({ css }) => ({
  nav: css`
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 24px);
    max-width: 1440px;
    z-index: 1000;
    padding: 0;
    transition: all 0.3s ease;

    &.scrolled {
      top: 8px;
      max-width: 850px;
      filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.1));
    }
  `,
  header: css`
    height: 64px;
    background: rgba(236, 229, 221, 0.8);
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(7, 94, 84, 0.1);
    border-radius: 16px;
    padding: 0 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

    @media (min-width: 768px) {
      height: 72px;
      border-radius: 20px;
      padding: 0 32px;
    }

    .scrolled & {
      height: 56px;
      @media (min-width: 768px) {
        height: 64px;
      }
    }
  `,
  logoText: css`
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #000;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    font-size: 18px;

    @media (min-width: 768px) {
      font-size: 24px;
    }

    .scrolled & {
      font-size: 16px;
      @media (min-width: 768px) {
        font-size: 20px;
      }
    }
  `,
  logoImg: css`
    object-fit: contain;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    width: 32px;
    height: 32px;

    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
    }

    .scrolled & {
      width: 28px;
      height: 28px;
      @media (min-width: 768px) {
        width: 32px;
        height: 32px;
      }
    }
  `,
  navLinks: css`
    display: none;
    @media (min-width: 1024px) {
      display: flex;
      gap: 8px;
      background: rgba(0, 0, 0, 0.03);
      padding: 6px;
      border-radius: 14px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
  `,
  navLink: css`
        color: rgba(0,0,0,0.6);
        fontWeight: 700;
        fontSize: 14px;
        textDecoration: none;
        transition: all 0.3s ease;
        padding: 8px 16px;
        borderRadius: 10px;
        position: relative;

        &:hover {
            color: #000;
            background: rgba(255, 255, 255, 0.5);
        }

        &.active {
            color: #075e54;
        }

        &.featured {
            &:hover {
                color: #075e54;
                background: rgba(7, 94, 84, 0.05);
            }

            &.active {
                color: #075e54;
            }
        }
    `,
  desktopActions: css`
    display: none;
    @media (min-width: 1024px) {
      display: block;
    }
  `,
  mobileMenuBtn: css`
    display: flex;
    @media (min-width: 1024px) {
      display: none;
    }
  `,
  actionButton: css`
    border-radius: 12px !important;
    font-weight: 800 !important;
    padding-inline: 16px !important;
    background: #075e54 !important;
    border: none !important;
    color: #fff !important;
    box-shadow: 0 4px 12px rgba(7, 94, 84, 0.3) !important;
    transition: all 0.2s ease !important;
    height: 40px !important;
    font-size: 14px !important;
    cursor: pointer !important;

    &:hover {
      background: #064a43 !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(7, 94, 84, 0.4) !important;
    }

    @media (min-width: 768px) {
      height: 48px !important;
      border-radius: 16px !important;
      padding-inline: 32px !important;
      font-size: 16px !important;
    }

    .scrolled & {
      height: 36px !important;
      @media (min-width: 768px) {
        height: 40px !important;
      }
    }
  `
}));

export const Navbar = () => {
  const { styles, cx } = useStyles();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Blog", href: "/blog" },
    { label: "Tutoriel", href: "/tutoriel" },
    { label: "Tarification", href: "/pricing", featured: true },
    { label: "Documentation", href: "/documentation" },
    { label: "Outils", href: "/outils" },
  ];

  return (
    <>
      <nav className={cx(styles.nav, scrolled && "scrolled")}>
        <div className={styles.header}>
          <Flexbox horizontal align="center" justify="space-between" width="100%" height="100%">
            {/* Logo */}
            <a href="/" style={{ textDecoration: "none" }}>
              <Flexbox horizontal align="center" gap={12}>
                <img src="/connect-logo.png" alt="Logo" className={styles.logoImg} />
                <span className={styles.logoText}>Connect</span>
              </Flexbox>
            </a>

            {/* Desktop Nav */}
            <div className={styles.navLinks}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cx(
                      styles.navLink,
                      isActive && "active",
                      item.featured && "featured"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-active"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: '#fff',
                          borderRadius: 10,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          zIndex: -1
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Actions */}
            <Flexbox horizontal align="center" gap={12}>
              <div className={styles.desktopActions}>
                <ShadcnButton
                  onClick={() => (window.location.href = "https://app.connect.wozif.com")}
                  className={styles.actionButton}
                >
                  Démarrer
                </ShadcnButton>
              </div>
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </Flexbox>
          </Flexbox>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              zIndex: 999,
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isActive ? '#075e54' : '#000',
                    fontWeight: 700,
                    fontSize: 18,
                    textDecoration: 'none',
                    padding: '16px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {item.label}
                  {isActive && <motion.div layoutId="mobile-active" style={{ width: 6, height: 6, borderRadius: '50%', background: '#075e54' }} />}
                </a>
              );
            })}
            <div style={{ marginTop: 'auto', paddingBottom: 40 }}>
              <ShadcnButton
                onClick={() => (window.location.href = "https://app.connect.wozif.com")}
                className="w-full bg-[#075e54] text-white py-6 rounded-2xl text-lg font-bold"
              >
                Commencer gratuitement
              </ShadcnButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
