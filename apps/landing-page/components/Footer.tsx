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
  `,
    footerAi: css`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    border-top: 1px solid rgba(7, 94, 84, 0.1);
    @media (min-width: 768px) {
      padding: 32px 48px;
    }
  `,
    footerAiLabel: css`
    display: flex;
    align-items: center;
    gap: 8px;
    background: #075e54;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 20px;
    border-radius: 12px;
    white-space: nowrap;
  `,
    footerAiLinks: css`
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 12px;
    flex-wrap: wrap;
    & li a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      transition: all 0.2s;
      &:hover {
        border-color: #075e54;
        box-shadow: 0 2px 8px rgba(7, 94, 84, 0.15);
        transform: translateY(-1px);
      }
    }
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
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Produit</span>
                            <Flexbox gap={10}>
                                <a href="/#features" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Fonctionnalités</a>
                                <a href="/pricing" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Tarifs</a>
                                <a href="/blog" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Blog</a>
                                <a href="https://app.connect.wozif.com" target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Lancer Connect</a>
                            </Flexbox>
                        </Flexbox>

                        <Flexbox gap={16}>
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Ressources</span>
                            <Flexbox gap={10}>
                                <a href="/documentation" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Documentation</a>
                                <a href="/documentation/getting-started/create-account" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Bien démarrer</a>
                                <a href="/tutoriel" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Tutoriels vidéo</a>
                                <a href="/documentation/integrations/api" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Documentation API</a>
                            </Flexbox>
                        </Flexbox>

                        <Flexbox gap={16}>
                            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#075e54", opacity: 0.6 }}>Légal</span>
                            <Flexbox gap={10}>
                                <a href="/cgu" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Conditions générales</a>
                                <a href="/politique-confidentialite" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Confidentialité</a>
                                <a href="/mentions-legales" style={{ color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Mentions légales</a>
                            </Flexbox>
                        </Flexbox>
                    </div>
                </div>

                {/* Ask AI about Connect */}
                <div className={styles.footerAi}>
                    <Flexbox horizontal align="center" gap={16} style={{ flexWrap: 'wrap' }}>
                        <div className={styles.footerAiLabel}>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.27699 4.25395C5.59914 3.38333 6.83081 3.38333 7.15296 4.25395L8.24183 7.19731C8.34309 7.47095 8.55904 7.68681 8.83265 7.78813L11.777 8.87797C12.6474 9.20022 12.6474 10.4318 11.777 10.7539L8.83265 11.8428C8.559 11.9441 8.34315 12.16 8.24183 12.4336L7.15296 15.378C6.83082 16.2486 5.5992 16.2485 5.27699 15.378L4.18714 12.4336C4.08581 12.1601 3.86993 11.9441 3.59632 11.8428L0.652964 10.7539C-0.217655 10.4318 -0.217655 9.20013 0.652964 8.87797L3.59632 7.78813C3.87004 7.68684 4.08586 7.47103 4.18714 7.19731L5.27699 4.25395ZM11.6305 0.457075C11.856 -0.152358 12.7185 -0.152358 12.944 0.457075L13.5426 2.07426C13.6135 2.26585 13.7641 2.41742 13.9557 2.48832L15.5729 3.08696C16.1823 3.31247 16.1823 4.17395 15.5729 4.39946L13.9557 4.99809C13.7641 5.06899 13.6135 5.22055 13.5426 5.41215L12.944 7.02934C12.7185 7.63877 11.856 7.63877 11.6305 7.02934L11.0319 5.41215C10.961 5.2206 10.8103 5.06901 10.6188 4.99809L9.00062 4.39946C8.39168 4.17376 8.39162 3.31259 9.00062 3.08696L10.6188 2.48832C10.8103 2.41739 10.961 2.26579 11.0319 2.07426L11.6305 0.457075Z" fill="white" />
                            </svg>
                            Demander à l'IA à propos de Connect
                        </div>
                        <ul className={styles.footerAiLinks}>
                            <li>
                                <a href={`https://chatgpt.com/?prompt=${encodeURIComponent("Agis en tant qu'analyste indépendant de logiciels SaaS. En utilisant les informations publiques, explique brièvement ce que fait Connect by Wozif (https://connect.wozif.com), à qui il s'adresse, et les 3 fonctionnalités principales qui le différencient des outils d'automatisation WhatsApp et de chatbots IA. Garde la réponse factuelle, bien structurée et concise.")}&model=auto`} target="_blank" rel="noopener noreferrer" title="ChatGPT">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.8134 7.36682C16.9675 6.91002 17.0461 6.43174 17.0461 5.95031C17.0461 5.15369 16.831 4.37145 16.4231 3.684C15.6034 2.27609 14.0827 1.40687 12.4369 1.40687C12.1132 1.40687 11.7888 1.44062 11.4723 1.50766C11.0459 1.03362 10.5225 0.654151 9.9366 0.394275C9.35071 0.134399 8.71563 2.0192e-05 8.07326 0H8.04441C8.04146 9.88145e-05 8.03695 9.87602e-05 8.0336 9.87602e-05C6.04031 9.87602e-05 4.27265 1.26917 3.65985 3.14013C2.37666 3.39897 1.26892 4.193 0.621266 5.31553C0.214577 6.00714 0.000259672 6.79247 0 7.59207C0.000161657 8.71578 0.422935 9.79945 1.18645 10.6332C1.03232 11.09 0.953722 11.5683 0.953656 12.0497C0.953725 12.8464 1.16876 13.6286 1.57668 14.316C2.39633 15.7244 3.91713 16.5931 5.56306 16.5931C5.88711 16.5931 6.21027 16.5593 6.52713 16.4923C6.9536 16.9663 7.47707 17.3458 8.06301 17.6057C8.64895 17.8656 9.28407 18 9.92649 18H9.95533L9.96705 18C11.9614 18 13.7285 16.7309 14.3414 14.8582C15.6245 14.5993 16.7323 13.8053 17.3799 12.6827C17.7862 11.9917 18.0001 11.2071 18 10.4082C17.9999 9.28452 17.5771 8.20085 16.8136 7.36707L16.8134 7.36682ZM9.95653 16.8232H9.95183C9.15378 16.823 8.38107 16.5467 7.76806 16.0426C7.80447 16.0232 7.84044 16.0031 7.87597 15.9823L11.5083 13.912C11.599 13.8611 11.6743 13.7875 11.7268 13.6985C11.7792 13.6095 11.8068 13.5085 11.8069 13.4056V8.34938L13.3422 9.22409C13.3585 9.23214 13.3697 9.24775 13.372 9.26559V13.45C13.3699 15.3104 11.8421 16.8195 9.95653 16.8232ZM2.61125 13.7279C2.31123 13.216 2.15317 12.6352 2.15298 12.0439C2.15298 11.851 2.17005 11.6576 2.2033 11.4676C2.23029 11.4836 2.27741 11.5119 2.31121 11.5311L5.94357 13.6013C6.03415 13.6534 6.13713 13.6808 6.24197 13.6808C6.34682 13.6808 6.44978 13.6533 6.54035 13.6012L10.975 11.0747V12.8241C10.9755 12.833 10.9738 12.8419 10.97 12.85C10.9661 12.8581 10.9603 12.8652 10.9531 12.8705L7.28119 14.9624C6.7616 15.2574 6.17266 15.4128 5.57317 15.413C4.97308 15.4129 4.38356 15.2571 3.86371 14.9614C3.34386 14.6656 2.91196 14.2401 2.6113 13.7277L2.61125 13.7279ZM1.65569 5.90377C2.05461 5.22003 2.68454 4.6965 3.43522 4.42481C3.43522 4.45569 3.43341 4.51034 3.43341 4.54833V8.68871L3.43336 8.69217C3.43338 8.79497 3.46098 8.89594 3.51334 8.98481C3.5657 9.07369 3.64097 9.14731 3.7315 9.1982L8.16624 11.7244L6.63093 12.5991C6.62336 12.604 6.61466 12.607 6.60563 12.6078C6.59659 12.6086 6.5875 12.6072 6.57915 12.6037L2.90689 10.5101C2.38774 10.2133 1.95675 9.7872 1.65711 9.27434C1.35747 8.76149 1.1997 8.17994 1.19962 7.58797C1.19987 6.99691 1.35719 6.41625 1.65589 5.90392L1.65569 5.90377ZM14.2696 8.80007L9.83496 6.27354L11.3703 5.39917C11.3778 5.39424 11.3865 5.39124 11.3956 5.39043C11.4046 5.38962 11.4137 5.39103 11.422 5.39453L15.0943 7.48638C16.1513 8.08891 16.8034 9.20309 16.8034 10.4079C16.8034 11.8212 15.9097 13.0858 14.5658 13.5739V9.30961C14.566 9.30803 14.566 9.3064 14.566 9.30487C14.566 9.09642 14.4528 8.90373 14.2696 8.80007ZM15.7978 6.5308C15.7708 6.51444 15.7237 6.48643 15.6899 6.46726L12.0575 4.39705C11.967 4.34496 11.864 4.3175 11.7592 4.31745C11.6544 4.31745 11.5514 4.34502 11.4609 4.39705L7.02616 6.92359V5.17417L7.02611 5.17116C7.02611 5.16272 7.0281 5.1544 7.03193 5.14685C7.03575 5.13931 7.0413 5.13274 7.04815 5.12768L10.7201 3.03761C11.2395 2.74216 11.8284 2.58661 12.428 2.58657C14.316 2.58657 15.8471 4.09729 15.8471 5.96014C15.847 6.15131 15.8305 6.34212 15.7978 6.53055V6.5308ZM6.19148 9.64884L4.65582 8.77413C4.64776 8.77018 4.64082 8.76432 4.63561 8.75708C4.63041 8.74984 4.62709 8.74144 4.62597 8.73263V4.54823C4.62677 2.68632 6.15788 1.17688 8.04507 1.17688C8.84434 1.17706 9.61833 1.45331 10.2327 1.95771C10.1964 1.97714 10.1604 1.99727 10.1248 2.01809L6.49248 4.08825C6.40185 4.13914 6.32649 4.21279 6.27407 4.30172C6.22164 4.39065 6.19401 4.49169 6.19399 4.59458V4.59794L6.19148 9.64884ZM7.02546 7.87463L9.00062 6.74903L10.9757 7.87388V10.1244L9.00062 11.2492L7.02546 10.1244V7.87463Z" fill="black" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href={`https://www.perplexity.ai/search?q=${encodeURIComponent("Qu'est-ce que Connect by Wozif (https://connect.wozif.com), à qui s'adresse-t-il, et quelles sont les fonctionnalités qui le différencient des autres outils d'automatisation WhatsApp et chatbots IA ? Réponse factuelle et concise.")}`} target="_blank" rel="noopener noreferrer" title="Perplexity">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.8387 0V5.454H16.875V13.215H14.6737V18L9.396 13.3545V17.9632H8.57775V13.3492L3.294 18V13.1512H1.125V5.391H3.288V0L8.57775 4.8705V0.1425H9.39525V5.01L14.8387 0ZM9.396 6.783V12.2723L13.8555 16.1978V10.83L9.396 6.783ZM8.57175 6.723L4.11225 10.7715V16.1978L8.57175 12.2723V6.72375V6.723ZM14.6737 12.408H16.0568V6.26175H10.095L14.6737 10.4167V12.408ZM7.93725 6.198H1.9425V12.3442H3.2925V10.4123L7.9365 6.19725L7.93725 6.198ZM4.10625 1.857V5.3895H7.9425L4.10625 1.857ZM14.0205 1.857L10.1842 5.3895H14.0205V1.857Z" fill="#22B8CD" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href={`https://gemini.google.com/app?q=${encodeURIComponent("Qu'est-ce que Connect by Wozif, à qui s'adresse-t-il, et quelles fonctionnalités le différencient des outils d'automatisation WhatsApp et chatbots IA comme Manychat ou Tidio ?")}`} target="_blank" rel="noopener noreferrer" title="Gemini">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip_gemini_footer)">
                                            <path d="M17.1799 9.02917C15.7955 8.43983 14.5367 7.59094 13.4715 6.52833C11.9881 5.04194 10.9298 3.18542 10.4065 1.15167C10.3836 1.06134 10.3312 0.981239 10.2576 0.924027C10.184 0.866815 10.0935 0.835754 10.0003 0.835754C9.90707 0.835754 9.81653 0.866815 9.74296 0.924027C9.66939 0.981239 9.61698 1.06134 9.59402 1.15167C9.06966 3.18515 8.01117 5.04147 6.52819 6.52833C5.46288 7.59082 4.20415 8.43969 2.81986 9.02917C2.27819 9.2625 1.72152 9.45 1.15152 9.59417C1.06064 9.6165 0.979872 9.66866 0.92213 9.7423C0.864388 9.81595 0.833008 9.90683 0.833008 10.0004C0.833008 10.094 0.864388 10.1849 0.92213 10.2585C0.979872 10.3322 1.06064 10.3843 1.15152 10.4067C1.72152 10.55 2.27652 10.7375 2.81986 10.9708C4.20423 11.5602 5.46299 12.4091 6.52819 13.4717C8.01202 14.9582 9.07063 16.815 9.59402 18.8492C9.61635 18.94 9.66851 19.0208 9.74216 19.0786C9.81581 19.1363 9.90669 19.1677 10.0003 19.1677C10.0939 19.1677 10.1847 19.1363 10.2584 19.0786C10.332 19.0208 10.3842 18.94 10.4065 18.8492C10.5499 18.2783 10.7374 17.7233 10.9707 17.18C11.56 15.7956 12.4089 14.5368 13.4715 13.4717C14.9582 11.9882 16.815 10.9299 18.849 10.4067C18.9393 10.3837 19.0194 10.3313 19.0767 10.2577C19.1339 10.1842 19.1649 10.0936 19.1649 10.0004C19.1649 9.90722 19.1339 9.81668 19.0767 9.7431C19.0194 9.66953 18.9393 9.61712 18.849 9.59417C18.2785 9.45062 17.7203 9.26168 17.1799 9.02917Z" fill="#3186FF" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip_gemini_footer"><rect width="20" height="20" fill="white" /></clipPath>
                                        </defs>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href={`https://claude.ai/new?q=${encodeURIComponent("Explique ce qu'est Connect by Wozif (https://connect.wozif.com), à qui il s'adresse, et les 3 fonctionnalités principales qui le différencient des outils d'automatisation WhatsApp et chatbots IA. Réponse factuelle, structurée et concise.")}`} target="_blank" rel="noopener noreferrer" title="Claude">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.92319 13.3L7.85872 11.0933L7.92486 10.9016L7.85872 10.795L7.66695 10.795L7.0092 10.7545L4.76057 10.6937L2.81041 10.6127L0.921006 10.5115L0.445622 10.4103L0 9.82317L0.0458981 9.53033L0.445676 9.26173L1.01831 9.31166L2.28373 9.398L4.18254 9.52894L5.56013 9.60994L7.60085 9.82183H7.92486L7.97082 9.69095L7.86005 9.60994L7.7736 9.52894L5.80859 8.19812L3.68146 6.79169L2.5673 5.98184L1.96496 5.57157L1.66109 5.18688L1.53013 4.34739L2.07711 3.74542L2.8118 3.79535L2.99951 3.84533L3.74371 4.41756L5.33326 5.64718L7.40898 7.17505L7.71285 7.42746L7.8344 7.34112L7.84926 7.28035L7.71285 7.05228L6.58383 5.0128L5.37915 2.93835L4.84296 2.07857L4.70116 1.563C4.6512 1.35111 4.61476 1.17297 4.61476 0.955633L5.23735 0.110697L5.58171 0L6.41231 0.110697L6.76213 0.414378L7.27802 1.59407L8.11401 3.4513L9.41054 5.97661L9.79007 6.72569L9.99263 7.41945L10.0683 7.63134L10.1991 7.63129V7.50981L10.3058 6.08719L10.503 4.34067L10.6948 2.09341L10.761 1.46042L11.0742 0.701826L11.6968 0.29156L12.183 0.52374L12.5828 1.09597L12.5274 1.46581L12.2897 3.00985L11.8238 5.42852L11.5199 7.04817H11.6969L11.8996 6.84573L12.7193 5.75788L14.0969 4.03698L14.7046 3.35406L15.4137 2.59958L15.8687 2.24053L16.729 2.24047L17.3624 3.18121L17.0788 4.15302L16.1929 5.27595L15.4582 6.22748L14.4047 7.64469L13.747 8.77841L13.8078 8.86887L13.9645 8.85402L16.3441 8.34785L17.6298 8.11573L19.1641 7.85257L19.8582 8.17649L19.9339 8.50581L19.6611 9.17933L18.0202 9.58426L16.0957 9.96895L13.2298 10.6465L13.1947 10.6722L13.2352 10.7221L14.5263 10.8436L15.0787 10.8733H16.4305L18.9479 11.0609L19.6056 11.4955L20 12.0273L19.9339 12.4323L18.9209 12.9478L17.5542 12.6239L14.3642 11.8654L13.2702 11.5927L13.119 11.5927V11.6831L14.0306 12.5739L15.7012 14.0815L17.7932 16.0251L17.8999 16.5057L17.6311 16.8849L17.3476 16.8444L15.5095 15.4623L14.8004 14.8401L13.1946 13.489L13.088 13.489V13.6307L13.4581 14.172L15.4123 17.1076L15.5135 18.0078L15.3718 18.3007L14.8653 18.4775L14.3089 18.3763L13.165 16.7715L11.9846 14.9642L11.0325 13.3446L10.9164 13.4107L10.3545 19.4587L10.0912 19.7678L9.48342 20L8.97699 19.6153L8.70823 18.9931L8.97699 17.7635L9.30111 16.1587L9.56442 14.8832L9.80214 13.2987L9.94395 12.7722L9.93449 12.7372L9.81839 12.752L8.62311 14.3919L6.80531 16.847L5.36697 18.3857L5.0226 18.5221L4.42561 18.2129L4.48102 17.661L4.81459 17.1697L6.80531 14.639L8.00592 13.0706L8.78111 12.1649L8.77571 12.034H8.72982L3.44251 15.465L2.50115 15.5864L2.09597 15.2071L2.14599 14.5849L2.33775 14.3825L3.9273 13.2892L3.9219 13.2947L3.92319 13.3Z" fill="#D77655" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </Flexbox>
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
