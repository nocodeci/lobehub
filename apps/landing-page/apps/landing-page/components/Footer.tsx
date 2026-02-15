'use client';

import React from 'react';
import { Flexbox, Button } from '@lobehub/ui';
import {
    Globe,
    ChevronRight,
    Linkedin,
    Facebook,
    Twitter,
} from 'lucide-react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
    footerSection: css`
    width: 100%;
    padding: 0 16px 40px;
    @media (min-width: 768px) {
      padding: 0 24px 40px;
    }
  `,
    footerContainer: css`
    background: #ece5dd;
    border-radius: 32px;
    border: 1px solid rgba(7, 94, 84, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    @media (min-width: 768px) {
      border-radius: 48px;
    }
  `,
    footerNewsletter: css`
    width: 100%;
    padding: 40px 24px;
    border-bottom: 1px solid rgba(7, 94, 84, 0.1);
    @media (min-width: 768px) {
      padding: 48px;
    }
  `,
    footerMain: css`
    width: 100%;
    padding: 48px 24px;
    max-width: 1200px;
    margin: 0 auto;
    @media (min-width: 768px) {
      padding: 64px 48px;
    }
  `,
    footerGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 40px;
    width: 100%;
  `,
    footerBottom: css`
    width: 100%;
    padding: 32px 24px;
    border-top: 1px solid rgba(7, 94, 84, 0.1);
    max-width: 1200px;
    margin: 0 auto;
  `
}));

export const Footer = () => {
    const { styles } = useStyles();

    return (
        <footer className={styles.footerSection}>
            <div className={styles.footerContainer}>
                {/* Newsletter CTA */}
                <div className={styles.footerNewsletter}>
                    <Flexbox horizontal justify="space-between" align="center" gap={32} style={{ maxWidth: 1200, margin: "0 auto", flexWrap: "wrap" }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#075e54", flex: "1 1 400px" }}>
                            Recevez les dernières actualités IA & Automatisation directement dans votre boîte mail
                        </h2>
                        <Flexbox horizontal gap={8} style={{ flex: "1 1 350px", width: "100%" }}>
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                style={{ flex: 1, height: 48, borderRadius: 12, border: "1px solid rgba(7, 94, 84, 0.2)", paddingInline: 16, fontSize: 14 }}
                            />
                            <Button type="primary" style={{ height: 48, borderRadius: 12, background: "#075e54", fontWeight: 700 }}>
                                Souscrire
                            </Button>
                        </Flexbox>
                    </Flexbox>
                </div>

                {/* Links Grid */}
                <div className={styles.footerMain}>
                    <div className={styles.footerGrid}>
                        <Flexbox gap={20} align="start">
                            <Flexbox horizontal align="center" gap={12}>
                                <img src="/connect-logo.png" alt="Logo" style={{ width: 36, height: 36 }} />
                                <span style={{ fontSize: 22, fontWeight: 900, color: "#000" }}>Connect</span>
                            </Flexbox>
                            <p style={{ color: "#666", lineHeight: 1.5, fontSize: 14 }}>
                                Réinventer l'automatisation, propulser votre croissance.
                            </p>
                            <Button variant="text" icon={<Globe size={16} />} style={{ color: "#075e54", fontWeight: 600, padding: 0, fontSize: 14 }}>
                                Français <ChevronRight size={14} style={{ marginLeft: 4 }} />
                            </Button>
                        </Flexbox>

                        <Flexbox gap={16}>
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Produits</span>
                            <Flexbox gap={10}>
                                {["Orchestrateur IA", "Agents WhatsApp", "WhatsApp Collect", "School Automation", "API Direct"].map(l => (
                                    <a key={l} href="#" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l}</a>
                                ))}
                            </Flexbox>
                        </Flexbox>

                        <Flexbox gap={16}>
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Développeurs</span>
                            <Flexbox gap={10}>
                                {["Bien démarrer", "Documentation API", "Guides & Tutoriels", "SDKs", "Statut"].map(l => (
                                    <a key={l} href="#" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l}</a>
                                ))}
                            </Flexbox>
                        </Flexbox>

                        <Flexbox gap={16}>
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Légal</span>
                            <Flexbox gap={10}>
                                {["Conditions", "Confidentialité", "Cookies", "Mentions légales"].map(l => (
                                    <a key={l} href="#" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l}</a>
                                ))}
                            </Flexbox>
                        </Flexbox>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footerBottom}>
                    <Flexbox horizontal justify="space-between" align="center" gap={24} style={{ flexWrap: "wrap" }}>
                        <p style={{ color: "#666", margin: 0, fontSize: 13 }}>
                            © 2016 - 2026 Connect. Tous droits réservés par Wozif Innovation.
                        </p>
                        <Flexbox horizontal gap={20}>
                            <a href="#" style={{ color: "#075e54" }}><Linkedin size={18} /></a>
                            <a href="#" style={{ color: "#075e54" }}><Facebook size={18} /></a>
                            <a href="#" style={{ color: "#075e54" }}><Twitter size={18} /></a>
                        </Flexbox>
                    </Flexbox>
                </div>
            </div>
        </footer>
    );
};
