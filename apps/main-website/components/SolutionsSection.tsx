"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const solutions = [
  {
    id: "connect",
    name: "Connect",
    title: "Connect",
    description:
      "Transformez votre WhatsApp en machine de vente automatisée. Agents IA, chatbots intelligents, réponses automatiques et intégrations CRM pour les entreprises africaines.",
    stats: [
      { value: "24/7", label: "Disponibilité des agents IA" },
      { value: "10X", label: "Gain de productivité" },
    ],
    cta: { text: "Découvrir Connect", href: "https://connect.wozif.com/" },
    logo: "/images/solutions/connect-logo.png",
    image: "/images/solutions/connect.png",
    previewUrl: "https://connect.wozif.com/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(124,45,18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "rgb(255, 122, 0)",
  },
  {
    id: "gnata",
    name: "Gnata",
    title: "Gnata",
    description:
      "Votre site web en 1 heure. Plateforme de création de sites web ultra-rapide avec service humain. Faites une demande et recevez votre site professionnel en moins d'une heure.",
    stats: [
      { value: "1h", label: "Livraison garantie" },
      { value: "50K", label: "FCFA le site vitrine" },
    ],
    cta: { text: "Découvrir Gnata", href: "https://gnata.wozif.com/" },
    logo: "gnata-svg",
    image: "https://framerusercontent.com/images/jeFhaYpdEa3BliS5bZ6OaWj6frc.png?width=770&height=818",
    previewUrl: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(124,45,18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: "rgb(99, 102, 241)",
  },
  {
    id: "afriflow",
    name: "AfriFlow",
    title: "AfriFlow",
    description:
      "Orchestrateur de paiements africains. Acceptez tous les moyens de paiement africains — Mobile Money, cartes bancaires — via une seule intégration. 18+ opérateurs supportés.",
    stats: [
      { value: "2%", label: "Par transaction seulement" },
      { value: "18+", label: "Opérateurs Mobile Money" },
    ],
    cta: { text: "Découvrir AfriFlow", href: "https://afriflow.wozif.com/" },
    logo: "afriflow-svg",
    image: "https://framerusercontent.com/images/HE5WRrUlcjZHiAVEIC4GDosQw8.png?width=770&height=818",
    previewUrl: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(124,45,18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    color: "rgb(16, 185, 129)",
  },
];

const highlights = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(124, 45, 18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Essai gratuit",
    description: "Commencez à utiliser Connect immédiatement.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(124, 45, 18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Prise en main en 30 secondes",
    description: "Configurez votre espace en quelques instants.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(124, 45, 18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Garantie 30 jours",
    description: "Testez toutes les fonctionnalités en toute sérénité.",
  },
];

export default function SolutionsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const active = solutions[activeTab];

  return (
    <section className="w-full max-w-[1248px] mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-8">
        <span
          className="text-sm font-medium text-[rgb(255,122,0)] uppercase tracking-wider mb-3"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          L&apos;écosystème Wozif
        </span>
        <h2
          className="text-3xl lg:text-4xl font-bold text-[rgb(26,26,26)] text-center"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          Nos solutions
        </h2>
        <p
          className="text-[rgb(77,77,77)] text-center mt-2 max-w-xl"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          Des solutions digitales pour démocratiser l&apos;accès au web et aux paiements en ligne en Afrique.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-0 bg-[rgb(234,234,234)] rounded-full p-1 flex-wrap justify-center">
          {solutions.map((sol, i) => (
            <button
              key={sol.id}
              onClick={() => setActiveTab(i)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === i
                  ? "bg-white text-[rgb(26,26,26)] shadow-[0_1px_1px_rgba(0,0,0,0.15),0_3px_3px_rgba(0,0,0,0.05)]"
                  : "text-[rgb(77,77,77)] hover:text-[rgb(26,26,26)]"
              }`}
              style={{ fontFamily: '"Inter Tight", sans-serif' }}
            >
              {sol.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[20px] shadow-[0_14px_30px_rgba(209,209,209,0.1),0_55px_55px_rgba(209,209,209,0.09),0_1px_1px_rgba(0,0,0,0.15),0_3px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col lg:flex-row"
          >
            {/* Left: Info */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4">
                  {active.logo === "gnata-svg" ? (
                    <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                      <path d="M115 75 L 75 75 L 75 115 A 40 40 0 1 1 115 75 Z" fill="none" stroke="#A855F7" strokeWidth="14" />
                      <path d="M115 75 L 115 110" stroke="#A855F7" strokeWidth="14" strokeLinecap="butt" />
                      <circle cx="75" cy="75" r="7" fill="#A855F7" />
                    </svg>
                  ) : active.logo === "afriflow-svg" ? (
                    <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                      <circle cx="75" cy="75" r="60" stroke="#10B981" strokeWidth="12" fill="none" />
                      <path d="M75 30 L75 120" stroke="#10B981" strokeWidth="10" strokeLinecap="round" />
                      <path d="M45 55 L75 30 L105 55" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M45 95 L75 120 L105 95" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  ) : active.logo ? (
                    <img src={active.logo} alt={active.title} className="h-8 w-auto" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(${active.color}cc 0%, ${active.color}33 100%)` }}>
                      <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center"
                        style={{ backgroundColor: active.color }}>
                        {active.icon}
                      </div>
                    </div>
                  )}
                  <h3
                    className="text-xl font-semibold text-[rgb(26,26,26)]"
                    style={{ fontFamily: '"Inter Tight", sans-serif' }}
                  >
                    {active.title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="text-[rgb(77,77,77)] text-sm leading-relaxed mb-5"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  {active.description}
                </p>

                {/* CTA Button */}
                <a
                  href={active.cta.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[rgb(245,245,245)] text-[rgb(26,26,26)] text-sm font-medium hover:bg-[rgb(235,235,235)] transition-colors"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  {active.cta.text}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-0 mt-5 pt-4 border-t border-[rgb(224,224,224)]">
                {active.stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i > 0 ? "pl-6 border-l border-[rgb(224,224,224)]" : ""}`}
                  >
                    <p
                      className="text-2xl font-semibold text-[rgb(26,26,26)] mb-1"
                      style={{ fontFamily: '"Inter Tight", sans-serif' }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-sm text-[rgb(77,77,77)]"
                      style={{ fontFamily: '"Inter Tight", sans-serif' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 p-3 lg:p-4 flex items-center justify-center max-w-full lg:max-w-[50%]">
              {active.previewUrl ? (
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[rgb(18,18,18)] group cursor-pointer">
                  <div
                    className="absolute top-0 left-0 w-full transition-transform duration-[12s] ease-linear group-hover:-translate-y-[80%]"
                    style={{ height: "10000px" }}
                  >
                    <iframe
                      src={active.previewUrl}
                      title={`Aperçu ${active.title}`}
                      className="border-0 pointer-events-none origin-top-left"
                      style={{
                        width: "200%",
                        height: "10000px",
                        transform: "scale(0.5)",
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-xl pointer-events-none z-[1]" style={{ boxShadow: "inset 0 0 15px 5px rgb(18 18 18 / 0.4)" }} />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    Aperçu live
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full aspect-[16/10] rounded-xl overflow-hidden flex flex-col items-center justify-center"
                  style={{ backgroundColor: active.color + "11" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: active.color + "22" }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: active.color }}
                    >
                      {active.icon}
                    </div>
                  </div>
                  <p
                    className="text-lg font-semibold text-[rgb(26,26,26)]"
                    style={{ fontFamily: '"Inter Tight", sans-serif' }}
                  >
                    {active.title}
                  </p>
                  <span
                    className="mt-1 text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: active.color + "22",
                      color: active.color,
                      fontFamily: '"Inter Tight", sans-serif',
                    }}
                  >
                    Bientôt disponible
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-6 border border-[rgb(224,224,224)] rounded-xl overflow-hidden">
        {highlights.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-6 ${
              i > 0 ? "border-t md:border-t-0 md:border-l border-[rgb(224,224,224)]" : ""
            }`}
          >
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(rgba(250,145,59,0.8) 0%, rgba(246,143,58,0.2) 100%)" }}
            >
              <div className="w-[30px] h-[30px] rounded-[7px] bg-[rgb(255,122,0)] flex items-center justify-center">
                {item.icon}
              </div>
            </div>
            <div>
              <p
                className="text-sm font-semibold text-[rgb(26,26,26)] mb-0.5"
                style={{ fontFamily: '"Inter Tight", sans-serif' }}
              >
                {item.title}
              </p>
              <p
                className="text-sm text-[rgb(77,77,77)]"
                style={{ fontFamily: '"Inter Tight", sans-serif' }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
