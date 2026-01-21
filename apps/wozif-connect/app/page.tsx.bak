"use client";

import { motion } from "framer-motion";
import { MessageCircle, Zap, ShieldCheck, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/30">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight">Wozif Connect</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="https://wozif.com" className="hover:text-white transition-colors">Écosystème</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
              Essai Gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Compatible WhatsApp Business API
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Automatisez vos ventes sur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">WhatsApp</span> en Afrique.
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transformez chaque conversation en opportunité. Campagnes marketing, chatbots IA et paiements intégrés, le tout piloté depuis Wozif Connect.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 transition-all">
                <Zap className="h-4 w-4" />
                Démarrer Maintenant
              </Link>
              <Link href="#demo" className="h-12 px-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center gap-2 transition-all">
                Voir la Démo
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl aspect-[16/9] flex items-center justify-center group">
              <div className="absolute inset-0 bg-[url('https://ui.shadcn.com/placeholder.svg')] opacity-5" /> {/* Placeholder for real screenshot */}
              <div className="text-center p-8">
                <p className="text-zinc-500 mb-4">Interface Dashboard Wozif Connect</p>
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-600 group-hover:bg-white/10 group-hover:text-white transition-all cursor-pointer">
                  <div className="w-0 h-0 border-l-[12px] border-l-current border-y-[8px] border-y-transparent ml-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="h-6 w-6 text-green-400" />,
                title: "100% Anti-Ban",
                desc: "Nos algorithmes de 'warm-up' et de délais intelligents protègent votre numéro contre les blocages WhatsApp."
              },
              {
                icon: <Zap className="h-6 w-6 text-purple-400" />,
                title: "IA Chatbot",
                desc: "Connectez votre base de connaissances. L'IA répond aux questions fréquentes de vos clients 24/7."
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
                title: "Analystics Temps Réel",
                desc: "Suivez le taux d'ouverture, de clic et de conversion de vos campagnes marketing."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
