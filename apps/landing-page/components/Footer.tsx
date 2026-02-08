"use client";

import React from "react";
import { Flexbox, Button } from "@lobehub/ui";
import {
    Globe,
    ChevronRight,
    Linkedin,
    Facebook,
    Twitter,
    Github
} from "lucide-react";

export const Footer = ({ styles }: { styles: any }) => {
    return (
        <section
            style={{
                width: "100%",
                background: "transparent",
                padding: "0 24px 40px 24px",
            }}
        >
            <div
                className={styles.container}
                style={{
                    background: "#ece5dd",
                    borderRadius: 48,
                    border: "1px solid rgba(7, 94, 84, 0.1)",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: 1440,
                    margin: "0 auto",
                }}
            >
                {/* Newsletter CTA */}
                <div
                    style={{
                        width: "100%",
                        padding: "48px 24px",
                        borderBottom: "1px solid rgba(7, 94, 84, 0.1)",
                    }}
                >
                    <Flexbox
                        horizontal
                        justify="space-between"
                        align="center"
                        gap={32}
                        style={{
                            maxWidth: 1200,
                            margin: "0 auto",
                            flexWrap: "wrap",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 800,
                                margin: 0,
                                color: "#075e54",
                                flex: "1 1 400px",
                            }}
                        >
                            Recevez les dernières actualités IA & Automatisation directement dans votre boîte mail
                        </h2>
                        <Flexbox
                            horizontal
                            gap={8}
                            style={{ flex: "1 1 350px", width: "100%" }}
                        >
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                style={{
                                    flex: 1,
                                    height: 48,
                                    borderRadius: 12,
                                    border: "1px solid rgba(7, 94, 84, 0.2)",
                                    paddingInline: 16,
                                    fontSize: 16,
                                }}
                            />
                            <Button
                                type="primary"
                                style={{
                                    height: 48,
                                    borderRadius: 12,
                                    background: "#075e54",
                                    fontWeight: 700,
                                }}
                            >
                                Souscrire
                            </Button>
                        </Flexbox>
                    </Flexbox>
                </div>

                {/* Footer Content Widgets */}
                <div
                    style={{
                        width: "100%",
                        padding: "64px 24px",
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: 48,
                            width: "100%",
                        }}
                    >
                        {/* Logo Column */}
                        <Flexbox gap={24} align="start">
                            <div>
                                <Flexbox horizontal align="center" gap={12}>
                                    <img
                                        src="https://framerusercontent.com/images/8WfVzYJ9pXQ5hZ3Z0zY7mYc.png"
                                        alt="Connect Logo"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            objectFit: "contain",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 24,
                                            fontWeight: 900,
                                            color: "#000",
                                        }}
                                    >
                                        Connect
                                    </span>
                                </Flexbox>
                                <p
                                    style={{
                                        marginTop: 16,
                                        color: "#666",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Réinventer l'automatisation, propulser votre croissance.
                                </p>
                            </div>
                            <Button
                                variant="text"
                                icon={<Globe size={16} />}
                                style={{
                                    color: "#075e54",
                                    fontWeight: 600,
                                    padding: 0,
                                }}
                            >
                                Français <ChevronRight size={14} style={{ marginLeft: 4 }} />
                            </Button>
                        </Flexbox>

                        {/* Products Column */}
                        <Flexbox gap={16}>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#075e54",
                                    opacity: 0.6,
                                }}
                            >
                                Produits
                            </span>
                            <Flexbox gap={12}>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Orchestrateur IA</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Agents WhatsApp</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>WhatsApp Collect</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>School Automation</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>API Connect Direct</a>
                            </Flexbox>
                        </Flexbox>

                        {/* Developers Column */}
                        <Flexbox gap={16}>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#075e54",
                                    opacity: 0.6,
                                }}
                            >
                                Développeurs
                            </span>
                            <Flexbox gap={12}>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Bien démarrer</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Bibliothèque SDK</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Tutoriels</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Documentation API</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Statut Système</a>
                            </Flexbox>
                        </Flexbox>

                        {/* Resources Column */}
                        <Flexbox gap={16}>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#075e54",
                                    opacity: 0.6,
                                }}
                            >
                                Ressources
                            </span>
                            <Flexbox gap={12}>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Études de cas</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Actualités IA</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Recrutement</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Démo Live</a>
                            </Flexbox>
                        </Flexbox>

                        {/* Connect Column */}
                        <Flexbox gap={16}>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#075e54",
                                    opacity: 0.6,
                                }}
                            >
                                Connect
                            </span>
                            <Flexbox gap={12}>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>À propos</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Nous contacter</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Conditions</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>Confidentialité</a>
                                <a href="#" style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>CGU Services</a>
                            </Flexbox>
                        </Flexbox>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        width: "100%",
                        padding: "32px 24px",
                        borderTop: "1px solid rgba(7, 94, 84, 0.1)",
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
                    <Flexbox
                        horizontal
                        justify="space-between"
                        align="center"
                        gap={24}
                        style={{ flexWrap: "wrap" }}
                    >
                        <p style={{ color: "#666", margin: 0 }}>
                            © 2016 - 2026 Connect. Tous droits réservés par Wozif Innovation.
                        </p>
                        <Flexbox horizontal gap={24}>
                            <a href="#" style={{ color: "var(--brand-primary)" }}><Linkedin size={20} /></a>
                            <a href="#" style={{ color: "var(--brand-primary)" }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: "var(--brand-primary)" }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: "var(--brand-primary)" }}><Github size={20} /></a>
                        </Flexbox>
                    </Flexbox>
                </div>
            </div>
        </section>
    );
};
