"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, LayoutTemplate, Palette, Rocket, ShoppingBag, AppWindow, Smartphone, Briefcase, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GnataLogo } from "../components/GnataLogo";
import { cn } from "@/lib/utils";

export default function GnataLanding() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("Je veux un site e-commerce pour ");
  const [activeCategory, setActiveCategory] = useState("E-commerce");
  const [availableCoders, setAvailableCoders] = useState(3);

  useEffect(() => {
    setMounted(true);
    // Dynamic expert count simulation
    const interval = setInterval(() => {
      setAvailableCoders(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return Math.min(Math.max(newVal, 2), 6); // Stay between 2 and 6
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GnataLogo className="h-10 w-10" />
            <span className="font-bold text-lg tracking-tight">Gnata</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</Link>
            <Link href="#templates" className="hover:text-white transition-colors">Modèles</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/start" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Tableau de Bord
              </Link>
            ) : (
              <Link href="http://localhost:3012/auth/login?callbackUrl=http://localhost:3002" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Connexion
              </Link>
            )}
            <Link href="/start" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
              Commander mon site
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Immersive Chat Focus */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">

        {/* Complex Ambient Background */}
        <div className="absolute inset-0 bg-[#030014]">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)] opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

          {/* Minimalist Header Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-purple-300/80 mb-6 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
              </span>
              Moteur IA Gnata v1.0
            </div>

            <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-2">
              Que voulez-vous <span className="text-purple-400">créer</span> ?
            </h1>
            <p className="text-lg text-zinc-500 max-w-lg mx-auto mt-4 font-light">
              Transformez une simple phrase en un site web complet, hébergé et prêt à vendre en moins d&apos;une heure.
            </p>
          </motion.div>


          {/* The Masterpiece Chat Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-full max-w-2xl mx-auto group"
          >
            {/* Floating Suggestions Badges (Orbiting) */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-12 -left-12 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A0A0B]/80 border border-white/5 backdrop-blur-md shadow-xl z-0">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-zinc-400">Mode E-commerce</span>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-8 -right-8 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A0A0B]/80 border border-white/5 backdrop-blur-md shadow-xl z-0">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-zinc-400">Portfolio</span>
            </motion.div>

            {/* Main Chat Box Container */}
            <div className="relative z-10 bg-[#0A0A0B] rounded-2xl border border-white/[0.08] ring-1 ring-white/[0.03] shadow-2xl shadow-purple-500/5 overflow-hidden backdrop-blur-xl">

              {/* Input Gradient Border Effect */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-50" />
              <div className="flex flex-col min-h-[140px] p-1">
                {/* Text Area with Typewriter Placeholder */}
                <TypewriterTextarea value={prompt} onChange={setPrompt} />

                {/* Bottom Toolbar */}
                <div className="flex items-center justify-between px-4 pb-4 mt-2">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors tooltip" aria-label="Ajouter un fichier">
                      <LayoutTemplate className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Style">
                      <Palette className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-600 font-mono hidden sm:block">Cmd + Entrée</span>
                    <Link
                      href={`/start?prompt=${encodeURIComponent(prompt)}`}
                      className="h-9 px-4 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.5)] transform hover:scale-[1.02]"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Lancer la création
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Human-in-the-loop Reassurance */}
            <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-400">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                {availableCoders} Experts Vibe Coders disponibles maintenant
              </div>
            </div>


            {/* Glow Behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500" />
          </motion.div>

          {/* Suggested Prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-3 max-w-4xl"
          >
            {[
              { label: "E-commerce", icon: ShoppingBag, prompt: "Je veux un site e-commerce pour " },
              { label: "Portfolio", icon: Palette, prompt: "Je veux un portfolio pour " },
              { label: "SaaS / App", icon: AppWindow, prompt: "J'ai besoin d'une application SaaS pour " },
              { label: "Landing Page", icon: Rocket, prompt: "Je veux une landing page pour " },
              { label: "App Mobile", icon: Smartphone, prompt: "Je veux une application mobile pour " },
              { label: "Site Vitrine", icon: Briefcase, prompt: "Je veux un site vitrine pour mon entreprise " },
              { label: "Sur Mesure", icon: PanelsTopLeft, prompt: "J'ai un projet sur mesure : " }
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(cat.prompt);
                  setActiveCategory(cat.label);
                }}
                className={cn(
                  "px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-2 group",
                  activeCategory === cat.label
                    ? "bg-purple-500/10 border-purple-500/30 text-white shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-500 hover:text-white"
                )}
              >
                <cat.icon className={cn(
                  "w-3 h-3 transition-colors",
                  activeCategory === cat.label ? "text-purple-400" : "text-zinc-600 group-hover:text-purple-400"
                )} />
                {cat.label}
              </button>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Steps Preview (Moved down) */}
      <section className="py-24 bg-[#030014]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-32 grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto"
          >
            {[
              { step: "01", title: "Choisissez", desc: "Sélectionnez un modèle parmi notre catalogue premium.", icon: <LayoutTemplate /> },
              { step: "02", title: "Personnalisez", desc: "Envoyez votre logo et vos textes via notre formulaire express.", icon: <Palette /> },
              { step: "03", title: "C&apos;est en ligne !", desc: "Recevez votre lien unique en moins d&apos;une heure.", icon: <Rocket /> }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.05] transition-colors group">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10 text-primary mb-6">
                  {item.icon}
                </div>
                <span className="text-6xl font-black text-white/5 absolute -top-2 right-4 select-none">{item.step}</span>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Discover Templates Section */}
      <section id="templates" className="py-24 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6">

          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-medium mb-2">Découvrez nos modèles</h2>
              <p className="text-zinc-400">Lancez votre prochain projet avec un design pro.</p>
            </div>
            <Link href="#templates" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors border border-transparent hover:border-white/10">
              Tout voir
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Templates Grid */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Boutique E-commerce", desc: "Design premium pour la vente", color: "from-purple-500/20 to-blue-500/20", tag: "E-commerce" },
              { title: "Portfolio Architecte", desc: "Minimaliste et structuré", color: "from-orange-500/20 to-red-500/20", tag: "Portfolio" },
              { title: "Blog Lifestyle", desc: "Élégant et lisible", color: "from-green-500/20 to-emerald-500/20", tag: "Blog" },
              { title: "Plateforme Événement", desc: "Inscription et billetterie", color: "from-pink-500/20 to-rose-500/20", tag: "SaaS" },
            ].map((template, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col gap-3"
              >
                {/* Card Image Placeholder */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0B] group-hover:border-purple-500/50 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                  {/* Mock UI Elements inside card */}
                  <div className="absolute inset-4 rounded-lg border border-white/5 bg-black/20 backdrop-blur-sm" />
                  <div className="absolute top-4 left-4 right-4 h-3 rounded-full bg-white/5 w-1/3" />
                  <div className="absolute top-10 left-4 right-4 bottom-4 grid grid-cols-2 gap-2">
                    <div className="rounded bg-white/5" />
                    <div className="rounded bg-white/5" />
                  </div>

                  {/* View Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Voir la démo
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-zinc-200 group-hover:text-purple-400 transition-colors">{template.title}</h3>
                    <p className="text-sm text-zinc-500">{template.desc}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 border border-white/10 px-2 py-0.5 rounded-full">{template.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discover Apps Section (Optional per request, keeping it tight) */}
          <div className="mt-24 pt-12 border-t border-white/5">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-medium mb-1">Applications populaires</h2>
                <p className="text-zinc-400 text-sm">Ce que les autres construisent avec Gnata.</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
              {["Gnata CRM", "AfriPay Dashboard", "EventFlow"].map((app, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-200">{app}</h4>
                    <p className="text-xs text-zinc-500 mt-1">Généré en 45 minutes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function TypewriterTextarea({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const examples = [
    "Je veux un site e-commerce pour vendre des chaussures à Abidjan...",
    "Je veux un portfolio minimaliste pour mes photos de mariage...",
    "J'ai besoin d'une landing page pour mon application mobile...",
    "Je souhaiterais un site de restaurant avec menu et réservation...",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % examples.length;
      const fullText = examples[i];

      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 50);

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);

  return (
    <textarea
      className="w-full h-full bg-transparent text-lg text-zinc-200 placeholder-zinc-500/50 p-5 focus:outline-none resize-none font-light leading-relaxed min-h-[100px]"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
    />
  );
}
