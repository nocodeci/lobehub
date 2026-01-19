"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    Zap,
    ChevronRight,
    Palette,
    Globe,
    ChevronDown,
    Monitor,
    Smartphone,
    Lock,
    Cpu,
    Fingerprint,
    Scaling,
    RotateCcw,
    Battery,
    Wifi,
    Image as ImageIcon,
    Plus,
    CreditCard
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import fr from 'react-phone-number-input/locale/fr';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- Helper for Emoji Flags ---
const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// --- Comprehensive Country Data Generator with French Locale ---
const WORLD_COUNTRIES = getCountries().map(code => ({
    code,
    name: fr[code] || code,
    dial_code: `+${getCountryCallingCode(code)}`,
    flag: getFlagEmoji(code),
    currency: "XOF"
}));

const StudioControls = ({ businessName, setBusinessName, brandColor, setBrandColor, theme, setTheme, merchantLogo, setMerchantLogo }: any) => (
    <div className="flex flex-col gap-6 p-4">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Fingerprint size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Configuration</h3>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Signature Business</Label>
                <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-10 bg-white/[0.03] border-white/10 rounded-xl focus:ring-emerald-500/50 font-bold transition-all hover:bg-white/[0.05] focus:bg-white/5"
                />
            </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Palette size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Visuel</h3>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Atmosphère</Label>
                <Tabs value={theme} onValueChange={(v) => setTheme(v as any)} className="w-full">
                    <TabsList className="w-full h-10 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
                        <TabsTrigger value="light" className="flex-1 rounded-lg text-[10px] font-black uppercase data-[state=active]:bg-white data-[state=active]:text-black">Clair</TabsTrigger>
                        <TabsTrigger value="dark" className="flex-1 rounded-lg text-[10px] font-black uppercase data-[state=active]:bg-white data-[state=active]:text-black">Sombre</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <ImageIcon size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Branding Client</h3>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Logo Partenaire</Label>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all">
                        {merchantLogo ? (
                            <img src={merchantLogo} alt="Logo" className="w-8 h-8 object-contain" />
                        ) : (
                            <Plus size={16} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-[8px] text-white/40 font-medium">Format PNG ou SVG. Max 2MB.</p>
                        <Button variant="outline" className="h-8 px-3 rounded-xl text-[8px] font-black uppercase bg-white/5 border-white/10" onClick={() => setMerchantLogo(merchantLogo ? null : "https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_Robot_Head.svg")}>
                            {merchantLogo ? "Retirer" : "Choisir un Logo"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export function CheckoutDemo() {
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [brandColor, setBrandColor] = useState("#10B981");
    const [businessName, setBusinessName] = useState("Votre Marque");
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [selectedCountryCode, setSelectedCountryCode] = useState("SN");
    const [merchantLogo, setMerchantLogo] = useState<string | null>(null);

    const selectedCountry = useMemo(() =>
        WORLD_COUNTRIES.find(c => c.code === selectedCountryCode) || WORLD_COUNTRIES[0],
        [selectedCountryCode]
    );

    // Auto-Scaling Logic (Simplified for landing page context)
    const [scale, setScale] = useState(0.85);
    const stageRef = useRef<HTMLDivElement>(null);

    // Mouse Tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [100, 0]);

    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, ${brandColor}25 0%, transparent 60%)`;

    // Auto-Toggle View Mode
    useEffect(() => {
        const interval = setInterval(() => {
            setViewMode(prev => prev === "desktop" ? "mobile" : "desktop");
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <section className="py-32 bg-[#020202] relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-20 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400"
                    >
                        Personnalisation Totale
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Votre identité. <span className="text-zinc-500">Votre paiement.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Utilisez notre studio intégré pour personnaliser chaque aspect de voter page de paiement en temps réel.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:h-[700px] border border-white/10 rounded-3xl bg-black/40 overflow-hidden backdrop-blur-sm">
                    {/* Controls Sidebar */}
                    <div className="lg:col-span-3 border-r border-white/5 bg-[#050505] flex flex-col items-stretch overflow-y-auto">
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-white flex items-center justify-center rounded-lg shadow-xl">
                                    <Cpu size={16} className="text-black" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-black tracking-tighter leading-none text-white">Studio.</h1>
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500 block">Live Preview</span>
                                </div>
                            </div>
                        </div>
                        <StudioControls {...{ businessName, setBusinessName, brandColor, setBrandColor, theme, setTheme, merchantLogo, setMerchantLogo }} />
                    </div>

                    {/* Preview Stage */}
                    <div className="lg:col-span-9 relative bg-[#020202] flex flex-col overflow-hidden">
                        {/* Toolbar */}
                        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#020202]/50 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                                <Button variant="ghost" onClick={() => setViewMode("desktop")} className={cn("h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", viewMode === "desktop" ? "bg-white text-black shadow-sm" : "text-white/30")}><Monitor size={10} className="mr-2" /> Studio</Button>
                                <Button variant="ghost" onClick={() => setViewMode("mobile")} className={cn("h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", viewMode === "mobile" ? "bg-white text-black shadow-sm" : "text-white/30")}><Smartphone size={10} className="mr-2" /> Mobile</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                    <Scaling size={12} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500">{(scale * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Stage */}
                        <div
                            ref={stageRef}
                            className={cn(
                                "flex-1 relative flex items-center justify-center overflow-hidden p-8 perspective-2000 transition-all duration-700",
                                theme === "light"
                                    ? "bg-[#F8FAFC] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"
                                    : "bg-[#020202]"
                            )}
                            onMouseMove={(e) => viewMode === "desktop" && handleMouseMove(e)}
                            onMouseLeave={() => { x.set(0); y.set(0); }}
                        >
                            <motion.div
                                style={{
                                    scale,
                                    rotateX: viewMode === "desktop" ? rotateX : 0,
                                    rotateY: viewMode === "desktop" ? rotateY : 0,
                                    transformStyle: "preserve-3d",
                                }}
                                className={cn(
                                    "relative transition-all duration-1000 flex border overflow-hidden shrink-0 origin-center",
                                    theme === "dark"
                                        ? "bg-[#080808]/95 border-white/10 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
                                        : "bg-white border-black/5 text-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]",
                                    viewMode === "mobile"
                                        ? cn("w-[320px] h-[640px] rounded-[3rem] border-[8px] flex-col", theme === "light" ? "border-slate-200" : "border-[#151515]")
                                        : "w-[900px] h-[580px] rounded-[2.5rem]"
                                )}
                            >
                                {/* --- 📱 Smart Status Bar (Mobile Only) --- */}
                                {viewMode === "mobile" && (
                                    <div className={cn("h-10 px-8 flex items-center justify-between opacity-40 z-50", theme === "light" ? "text-black" : "text-white")}>
                                        <span className="text-[8px] font-black">09:41</span>
                                        <div className={cn("absolute left-1/2 -translate-x-1/2 top-3 w-16 h-4 rounded-full border shadow-2xl z-50 overflow-hidden", theme === "light" ? "bg-slate-100 border-black/5" : "bg-black border-white/5")}></div>
                                        <div className={cn("flex items-center gap-1", theme === "light" ? "text-black" : "text-white")}>
                                            <Wifi size={8} />
                                            <Battery size={8} />
                                        </div>
                                    </div>
                                )}

                                <motion.div className="absolute inset-0 pointer-events-none opacity-30 z-0" style={{ background: glareBackground }} />

                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <div className={cn(
                                        "relative w-full overflow-hidden transition-all duration-500 shadow-2xl backdrop-blur-3xl flex",
                                        viewMode === "mobile"
                                            ? "max-w-[320px] rounded-[1.5rem] flex-col"
                                            : "max-w-[800px] rounded-[2rem] h-[450px]", // Desktop specific size
                                        theme === "dark"
                                            ? "bg-[#0A0A0B]/90 border border-white/10 text-white"
                                            : "bg-white/90 border border-black/5 text-black"
                                    )}>

                                        {/* --- DESKTOP LEFT SIDE (Summary) --- */}
                                        {viewMode === "desktop" && (
                                            <div className={cn(
                                                "w-[35%] p-8 flex flex-col justify-between border-r",
                                                theme === "dark"
                                                    ? "bg-white/[0.02] border-white/5"
                                                    : "bg-black/[0.02] border-black/5"
                                            )}>
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-10 w-10 shadow-lg rounded-xl flex items-center justify-center ring-1 ring-inset overflow-hidden", theme === "dark" ? "bg-white ring-white/10" : "bg-black ring-black/5")}>
                                                            {merchantLogo ? (
                                                                <img src={merchantLogo} alt="Logo" className="w-6 h-6 object-contain" />
                                                            ) : (
                                                                <Zap className={cn("h-5 w-5", theme === "dark" ? "text-black" : "text-white")} fill="currentColor" />
                                                            )}
                                                        </div>
                                                        <h2 className="text-sm font-black tracking-tight uppercase">{businessName}</h2>
                                                    </div>

                                                    <div className="space-y-4 pt-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Commande #8X29F</p>
                                                            <div className="text-3xl font-black tracking-tighter">
                                                                75 000 <span className="text-sm text-emerald-500">XOF</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 pt-4">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="opacity-70">Abonnement Annuel</span>
                                                                <span className="font-bold">65 000</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="opacity-70">TVA (18%)</span>
                                                                <span className="font-bold">10 000</span>
                                                            </div>
                                                            <Separator className={theme === "dark" ? "bg-white/10" : "bg-black/10"} />
                                                            <div className="flex justify-between text-xs font-black">
                                                                <span>Total</span>
                                                                <span>75 000 XOF</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-[9px] font-medium opacity-40 uppercase tracking-widest flex items-center gap-2">
                                                    <Lock size={10} /> Paiement Sécurisé par AfriFlow
                                                </div>
                                            </div>
                                        )}

                                        {/* --- RIGHT SIDE / MOBILE MAIN (Payment Form) --- */}
                                        <div className={cn(
                                            "flex-1 flex flex-col",
                                            viewMode === "desktop" ? "p-8" : ""
                                        )}>
                                            {/* Mobile Header */}
                                            {viewMode === "mobile" && (
                                                <div className={cn("p-5 pb-3 flex items-center justify-between border-b", theme === "dark" ? "border-white/5" : "border-black/5")}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-9 w-9 shadow-xl rounded-xl flex items-center justify-center ring-1 ring-inset overflow-hidden", theme === "dark" ? "bg-white ring-white/10" : "bg-black ring-black/5")}>
                                                            {merchantLogo ? (
                                                                <img src={merchantLogo} alt="Logo" className="w-5 h-5 object-contain" />
                                                            ) : (
                                                                <Zap className={cn("h-4 w-4", theme === "dark" ? "text-black" : "text-white")} fill="currentColor" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h2 className={cn("text-xs font-black tracking-tight uppercase", theme === "dark" ? "text-white" : "text-black")}>{businessName}</h2>
                                                            <p className="text-[8px] font-medium opacity-50 uppercase tracking-widest flex items-center gap-1.5">
                                                                <Globe size={8} className="text-emerald-500" /> Secure Node v2.1
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-auto animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mobile Summary */}
                                            {viewMode === "mobile" && (
                                                <div className="px-5 pt-5 space-y-1">
                                                    <Label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">Montant total dû</Label>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className={cn("text-3xl font-black tracking-tighter italic", theme === "dark" ? "text-white" : "text-black")}>
                                                            75 000
                                                        </span>
                                                        <span className="text-xs font-black italic" style={{ color: brandColor }}>XOF</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Desktop Title */}
                                            {viewMode === "desktop" && (
                                                <div className="mb-6">
                                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-4">Moyen de paiement</h3>
                                                    <div className="flex gap-4 border-b border-white/5 pb-4">
                                                        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all", theme === "dark" ? "bg-white text-black border-transparent" : "bg-black text-white border-transparent")}>
                                                            <Smartphone size={14} />
                                                            <span className="text-[10px] font-bold uppercase">Mobile Money</span>
                                                        </div>
                                                        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer opacity-50 hover:opacity-100 transition-all", theme === "dark" ? "border-white/10" : "border-black/10")}>
                                                            <CreditCard size={14} />
                                                            <span className="text-[10px] font-bold uppercase">Carte Bancaire</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={cn("space-y-4", viewMode === "mobile" ? "px-5 pb-5 pt-5" : "")}>

                                                {/* Mobile Method Selection */}
                                                {viewMode === "mobile" && (
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                            <div className={cn("min-w-[80px] shrink-0 p-2 rounded-xl border flex flex-col items-center gap-1.5", theme === "light" ? "bg-white shadow-lg border-emerald-500" : "bg-white/10 border-emerald-500")}>
                                                                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center p-1"><img src="https://paydunya.com/refont/images/icon_pydu/partners/om.png" className="w-full h-full object-contain" /></div>
                                                                <span className="text-[6px] font-black uppercase">Orange</span>
                                                            </div>
                                                            <div className={cn("min-w-[80px] shrink-0 p-2 rounded-xl border flex flex-col items-center gap-1.5 opacity-50", theme === "dark" ? "border-white/10" : "border-black/5")}>
                                                                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center p-1"><img src="https://paydunya.com/refont/images/icon_pydu/partners/wave.png" className="w-full h-full object-contain" /></div>
                                                                <span className="text-[6px] font-black uppercase">Wave</span>
                                                            </div>
                                                            <div className={cn("min-w-[80px] shrink-0 p-2 rounded-xl border flex flex-col items-center gap-1.5 opacity-50", theme === "dark" ? "border-white/10" : "border-black/5")}>
                                                                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center p-1"><img src="https://paydunya.com/refont/images/icon_pydu/partners/visa.png" className="w-full h-full object-contain" /></div>
                                                                <span className="text-[6px] font-black uppercase">Visa</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Desktop Method Selection Grid */}
                                                {viewMode === "desktop" && (
                                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                                        <div className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all", theme === "light" ? "bg-white shadow-md border-emerald-500 ring-1 ring-emerald-500" : "bg-emerald-500/10 border-emerald-500")}>
                                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center p-1.5"><img src="https://paydunya.com/refont/images/icon_pydu/partners/om.png" className="w-full h-full object-contain" /></div>
                                                            <span className="text-[9px] font-black uppercase">Orange</span>
                                                        </div>
                                                        <div className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-all", theme === "dark" ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-black/5")}>
                                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center p-1.5"><img src="https://paydunya.com/refont/images/icon_pydu/partners/wave.png" className="w-full h-full object-contain" /></div>
                                                            <span className="text-[9px] font-black uppercase">Wave</span>
                                                        </div>
                                                        <div className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-all", theme === "dark" ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-black/5")}>
                                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg" className="w-full h-full object-contain" /></div>
                                                            <span className="text-[9px] font-black uppercase">MTN</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">Numéro de téléphone</Label>
                                                        <div className="flex gap-2">
                                                            <div className={cn("h-10 px-3 rounded-xl border flex items-center gap-2 w-28", theme === "dark" ? "bg-white/[0.03] border-white/10" : "bg-black/[0.03] border-black/10")}>
                                                                <span className="text-lg">{selectedCountry.flag}</span>
                                                                <span className="text-[10px] font-black">{selectedCountry.dial_code}</span>
                                                                <ChevronDown size={10} className="opacity-20 ml-auto" />
                                                            </div>
                                                            <div className={cn("h-10 px-4 rounded-xl border flex-1 text-[11px] font-bold flex items-center", theme === "dark" ? "bg-white/[0.03] border-white/10 text-white/40" : "bg-black/[0.03] border-black/10 text-black/40")}>
                                                                77 123 45 67
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={cn("h-12 rounded-xl flex items-center justify-between px-6 shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4", theme === "dark" ? "bg-white text-black" : "bg-black text-white")}>
                                                        <span className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                                            <Lock size={10} className="opacity-30" />
                                                            Payer 75 000 XOF
                                                        </span>
                                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", theme === "dark" ? "bg-black/10" : "bg-white/10")}>
                                                            <ChevronRight size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Footer */}
                                            {viewMode === "mobile" && (
                                                <div className={cn("mt-auto p-3 flex items-center justify-center gap-2", theme === "dark" ? "bg-black/40" : "bg-black/5")}>
                                                    <span className="text-[7px] font-bold opacity-30 uppercase tracking-[0.2em]">Synchronisé par</span>
                                                    <div className={cn("flex items-center gap-1 px-2 py-0.5 border rounded-full", theme === "dark" ? "bg-white/[0.03] border-white/5" : "bg-black/[0.03] border-black/5")}>
                                                        <Zap size={6} style={{ color: brandColor }} fill="currentColor" />
                                                        <span className="text-[7px] font-black italic tracking-tighter uppercase">AfriFlow</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
