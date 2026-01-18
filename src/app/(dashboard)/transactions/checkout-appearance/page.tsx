"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    Zap,
    Check,
    ChevronRight,
    ShieldCheck,
    RotateCcw,
    Palette,
    Type,
    Globe,
    Search,
    ChevronDown,
    Monitor,
    Smartphone,
    CreditCard,
    Smartphone as Phone,
    Lock,
    Cpu,
    Fingerprint,
    Settings2,
    Scaling,
    Maximize,
    Minimize,
    Move,
    Wifi,
    Battery,
    Image as ImageIcon,
    Plus
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

// --- Specialized Package Imports ---
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import fr from 'react-phone-number-input/locale/fr';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
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

// --- Components ---
const StudioControls = ({ businessName, setBusinessName, brandColor, setBrandColor, theme, setTheme, merchantLogo, setMerchantLogo }: any) => (
    <div className="flex flex-col gap-10 p-2">
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Fingerprint size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Configuration</h3>
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Signature Business</Label>
                <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:ring-emerald-500/50 font-bold transition-all hover:bg-white/[0.05] focus:bg-white/5"
                />
            </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Palette size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Visuel</h3>
            </div>
            <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Atmosphère</Label>
                <Tabs value={theme} onValueChange={(v) => setTheme(v as any)} className="w-full">
                    <TabsList className="w-full h-12 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
                        <TabsTrigger value="light" className="flex-1 rounded-xl text-[10px] font-black uppercase data-[state=active]:bg-white data-[state=active]:text-black">Clair</TabsTrigger>
                        <TabsTrigger value="dark" className="flex-1 rounded-xl text-[10px] font-black uppercase data-[state=active]:bg-white data-[state=active]:text-black">Sombre</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ImageIcon size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Branding Client</h3>
            </div>
            <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Logo Partenaire</Label>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all">
                        {merchantLogo ? (
                            <img src={merchantLogo} alt="Logo" className="w-10 h-10 object-contain" />
                        ) : (
                            <Plus size={20} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-[10px] text-white/40 font-medium">Format PNG ou SVG. Max 2MB.</p>
                        <Button variant="outline" className="h-9 px-4 rounded-xl text-[9px] font-black uppercase bg-white/5 border-white/10" onClick={() => setMerchantLogo(merchantLogo ? null : "https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_Robot_Head.svg")}>
                            {merchantLogo ? "Retirer" : "Choisir un Logo"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Button className="w-full h-14 bg-white text-black hover:bg-emerald-500 hover:text-white font-black uppercase tracking-[0.1em] rounded-2xl transition-all border-none">
            Enregistrer
        </Button>
    </div>
);

export default function CheckoutAppearancePage() {
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [brandColor, setBrandColor] = useState("#10B981");
    const [businessName, setBusinessName] = useState("Wozif Pro");
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [selectedCountryCode, setSelectedCountryCode] = useState("SN");
    const [searchCountry, setSearchCountry] = useState("");
    const [merchantLogo, setMerchantLogo] = useState<string | null>(null);

    const selectedCountry = useMemo(() =>
        WORLD_COUNTRIES.find(c => c.code === selectedCountryCode) || WORLD_COUNTRIES[0],
        [selectedCountryCode]
    );

    const filteredCountries = useMemo(() =>
        WORLD_COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
            c.dial_code.includes(searchCountry) ||
            c.code.toLowerCase().includes(searchCountry.toLowerCase())
        ),
        [searchCountry]
    );

    // Auto-Scaling Logic
    const [scale, setScale] = useState(1);
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateScale = () => {
            if (!stageRef.current) return;
            const { width, height } = stageRef.current.getBoundingClientRect();
            const baseW = viewMode === "mobile" ? 400 : 1050;
            const baseH = viewMode === "mobile" ? 800 : 700;
            const padding = 60;
            const scaleW = (width - padding) / baseW;
            const scaleH = (height - padding) / baseH;
            setScale(Math.min(scaleW, scaleH, 1));
        };
        const observer = new ResizeObserver(updateScale);
        if (stageRef.current) observer.observe(stageRef.current);
        updateScale();
        return () => observer.disconnect();
    }, [viewMode]);

    // Mouse Tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [100, 0]);

    // Fix for the [object Object] bug in radial-gradient
    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, ${brandColor}25 0%, transparent 60%)`;

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-[#020202] text-white">

            {/* Sidebar stays Dark to represent the Studio UI */}
            <aside className="hidden lg:flex w-[340px] xl:w-[380px] border-r border-white/5 bg-[#050505] flex-col z-50 overflow-hidden shrink-0">
                <div className="p-8 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white flex items-center justify-center rounded-xl shadow-xl">
                            <Cpu size={20} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter leading-none">Studio.</h1>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 block">Édition Mondiale</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black">
                    <StudioControls {...{ businessName, setBusinessName, brandColor, setBrandColor, theme, setTheme, merchantLogo, setMerchantLogo }} />
                </div>
            </aside>

            {/* Main container stays Dark, only the stage inside reacts to the light/dark mode */}
            <main className="flex-1 relative flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#020202]">
                <div className={cn("relative z-40 h-20 px-6 xl:px-12 flex items-center justify-between shrink-0 backdrop-blur-xl border-b transition-all duration-500", theme === "light" ? "bg-white/80 border-black/5" : "bg-[#020202]/40 border-white/5")}>
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn("lg:hidden h-10 w-10 rounded-xl border transition-all", theme === "light" ? "bg-black/5 border-black/10 text-black" : "bg-white/5 border-white/10 text-white")}>
                                    <Settings2 size={18} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className={cn("w-[85%] sm:w-[380px] p-0 overflow-y-auto border-r transition-colors duration-500", theme === "light" ? "bg-white border-black/10" : "bg-[#050505] border-white/10")}>
                                <SheetHeader className={cn("p-8 border-b", theme === "light" ? "border-black/5" : "border-white/5")}>
                                    <SheetTitle className={cn("font-black text-xl flex items-center gap-3", theme === "light" ? "text-black" : "text-white")}>
                                        <Cpu size={20} className="text-emerald-500" /> Configuration Mondiale
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="p-8">
                                    <StudioControls {...{ businessName, setBusinessName, brandColor, setBrandColor, theme, setTheme, merchantLogo, setMerchantLogo }} />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <div className={cn("flex p-1 rounded-2xl border transition-all", theme === "light" ? "bg-black/5 border-black/5" : "bg-white/[0.03] border-white/5")}>
                            <Button variant="ghost" onClick={() => setViewMode("desktop")} className={cn("h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", viewMode === "desktop" ? "bg-white text-black shadow-sm" : theme === "light" ? "text-black/40" : "text-white/30")}><Monitor size={10} className="mr-2" /> Studio</Button>
                            <Button variant="ghost" onClick={() => setViewMode("mobile")} className={cn("h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", viewMode === "mobile" ? "bg-white text-black shadow-sm" : theme === "light" ? "text-black/40" : "text-white/30")}><Smartphone size={10} className="mr-2" /> Mobile</Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Scaling size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500">{(scale * 100).toFixed(0)}%</span>
                        </div>
                        <Button variant="outline" size="icon" className={cn("h-10 w-10 border rounded-xl hover:bg-opacity-80 transition-all", theme === "light" ? "bg-black/5 border-black/10 text-black" : "bg-white/5 border-white/10 text-white")}><RotateCcw size={16} /></Button>
                    </div>
                </div>

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
                                ? "bg-[#080808]/95 border-white/10 text-white shadow-[0_120px_200px_-50px_rgba(0,0,0,1)]"
                                : "bg-white border-black/5 text-black shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)]",
                            viewMode === "mobile"
                                ? cn("w-[380px] h-[760px] rounded-[4.5rem] border-[12px] flex-col", theme === "light" ? "border-slate-200 shadow-xl" : "border-[#151515]")
                                : "w-[1000px] h-[640px] rounded-[3.5rem]"
                        )}
                    >
                        {/* --- 📱 Smart Status Bar (Mobile Only) --- */}
                        {viewMode === "mobile" && (
                            <div className={cn("h-14 px-10 flex items-center justify-between opacity-40 z-50", theme === "light" ? "text-black" : "text-white")}>
                                <span className="text-[10px] font-black">09:41</span>
                                <div className={cn("absolute left-1/2 -translate-x-1/2 top-4 w-24 h-6 rounded-full border shadow-2xl z-50 overflow-hidden", theme === "light" ? "bg-slate-100 border-black/5" : "bg-black border-white/5")}>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                </div>
                                <div className={cn("flex items-center gap-1.5 pt-0.5", theme === "light" ? "text-black" : "text-white")}>
                                    <Wifi size={10} />
                                    <Battery size={10} />
                                </div>
                            </div>
                        )}

                        <motion.div className="absolute inset-0 pointer-events-none opacity-30 z-0" style={{ background: glareBackground }} />

                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            {/* --- Main Terminal Card (Preview) --- */}
                            <div className={cn(
                                "relative w-full max-w-[360px] overflow-hidden rounded-[2rem] border transition-all duration-500 shadow-2xl backdrop-blur-3xl",
                                theme === "dark"
                                    ? "bg-[#0A0A0B]/80 border-white/10 text-white"
                                    : "bg-white/80 border-black/5 text-black"
                            )}>

                                {/* Header Section */}
                                <div className={cn("p-6 pb-4 flex items-center justify-between border-b", theme === "dark" ? "border-white/5" : "border-black/5")}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-10 w-10 shadow-xl rounded-xl flex items-center justify-center ring-1 ring-inset overflow-hidden", theme === "dark" ? "bg-white ring-white/10" : "bg-black ring-black/5")}>
                                            {merchantLogo ? (
                                                <img src={merchantLogo} alt="Logo" className="w-6 h-6 object-contain" />
                                            ) : (
                                                <Zap className={cn("h-5 w-5", theme === "dark" ? "text-black" : "text-white")} fill="currentColor" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className={cn("text-xs font-black tracking-tight uppercase", theme === "dark" ? "text-white" : "text-black")}>{businessName}</h2>
                                            <p className="text-[9px] font-medium opacity-50 uppercase tracking-widest flex items-center gap-1.5">
                                                <Globe size={9} className="text-emerald-500" /> Secure Node v2.1
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black opacity-20 uppercase tracking-tighter block mb-0.5">ID: 8X29F</span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-auto animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">

                                    {/* Compact Amount Display */}
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Montant total dû</Label>
                                        <div className="flex items-baseline gap-2">
                                            <span className={cn("text-4xl font-black tracking-tighter italic", theme === "dark" ? "text-white" : "text-black")}>
                                                75 000
                                            </span>
                                            <span className="text-sm font-black italic" style={{ color: brandColor }}>XOF</span>
                                        </div>
                                    </div>

                                    {/* Order Details Mini-Grid */}
                                    <div className={cn("grid grid-cols-2 gap-4 py-4 border-y", theme === "dark" ? "border-white/5" : "border-black/5")}>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Client</p>
                                            <p className="text-[10px] font-black truncate">Jean Dupont</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Date</p>
                                            <p className="text-[10px] font-black">{new Date().toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>

                                    {/* Components */}
                                    <div className="space-y-5">

                                        {/* Phone Input Mock */}
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Règlement</Label>
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

                                        {/* Horizontal Payment Scroll */}
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Méthode</Label>
                                            <div className="flex gap-2 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                {(() => {
                                                    const DEMO_METHODS: Record<string, any[]> = {
                                                        SN: [
                                                            { name: "Orange", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png", active: true },
                                                            { name: "Wave", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wave.png", active: false },
                                                            { name: "Free", logo: "https://paydunya.com/refont/images/icon_pydu/partners/free.png", active: false },
                                                            { name: "Visa", logo: "https://paydunya.com/refont/images/icon_pydu/partners/visa.png", active: false }
                                                        ],
                                                        CI: [
                                                            { name: "Orange", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png", active: true },
                                                            { name: "Wave", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wave.png", active: false },
                                                            { name: "MTN", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg", active: false },
                                                            { name: "Visa", logo: "https://paydunya.com/refont/images/icon_pydu/partners/visa.png", active: false }
                                                        ],
                                                        BJ: [
                                                            { name: "MTN", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg", active: true },
                                                            { name: "Moov", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Moov_Africa_logo.svg/1200px-Moov_Africa_logo.svg.png", active: false },
                                                            { name: "Visa", logo: "https://paydunya.com/refont/images/icon_pydu/partners/visa.png", active: false }
                                                        ],
                                                        TG: [
                                                            { name: "T-Money", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Togo_Cel_logo.svg/2560px-Togo_Cel_logo.svg.png", active: true },
                                                            { name: "Moov", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Moov_Africa_logo.svg/1200px-Moov_Africa_logo.svg.png", active: false }
                                                        ],
                                                        ML: [
                                                            { name: "Orange", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png", active: true },
                                                            { name: "Moov", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Moov_Africa_logo.svg/1200px-Moov_Africa_logo.svg.png", active: false }
                                                        ]
                                                    };

                                                    const activeMethods = DEMO_METHODS[selectedCountry.code] || [
                                                        { name: "Visa", logo: "https://paydunya.com/refont/images/icon_pydu/partners/visa.png", active: true },
                                                        { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png", active: false }
                                                    ];

                                                    return activeMethods.map((m, i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                "min-w-[90px] shrink-0 p-3 rounded-2xl border transition-all duration-300 snap-center flex flex-col items-center gap-2 group",
                                                                m.active
                                                                    ? cn("bg-white text-black border-emerald-500 scale-[1.02]", theme === "light" && "shadow-xl border-black/5 ring-1 ring-black/5")
                                                                    : cn(
                                                                        "border-transparent hover:border-emerald-500/20",
                                                                        theme === "dark"
                                                                            ? "bg-white/[0.05] border-white/10 hover:bg-white/10 text-slate-300"
                                                                            : "bg-black/[0.03] border-black/5 hover:bg-black/[0.05] text-slate-600"
                                                                    )
                                                            )}
                                                            style={m.active ? { borderColor: brandColor } : {}}
                                                        >
                                                            <div className={cn(
                                                                "h-8 w-8 rounded-full flex items-center justify-center p-1.5 bg-white shadow-sm border-[0.5px] border-black/5"
                                                            )}>
                                                                <img
                                                                    src={m.logo}
                                                                    alt={m.name}
                                                                    className={cn(
                                                                        "w-full h-full object-contain transition-all duration-300",
                                                                        !m.active && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                                                                    )}
                                                                />
                                                            </div>
                                                            <span className="text-[7px] font-black uppercase tracking-tighter">{m.name}</span>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className={cn("h-14 rounded-2xl flex items-center justify-between px-6 shadow-xl", theme === "dark" ? "bg-white text-black" : "bg-black text-white")}>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <Lock size={10} className="opacity-30" />
                                            Confirmer
                                        </span>
                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", theme === "dark" ? "bg-black/10" : "bg-white/10")}>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Branding */}
                                <div className={cn("p-4 flex items-center justify-center gap-2", theme === "dark" ? "bg-black/40" : "bg-black/5")}>
                                    <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">Synchronisé par</span>
                                    <div className={cn("flex items-center gap-1 px-2 py-0.5 border rounded-full", theme === "dark" ? "bg-white/[0.03] border-white/5" : "bg-black/[0.03] border-black/5")}>
                                        <Zap size={8} style={{ color: brandColor }} fill="currentColor" />
                                        <span className="text-[8px] font-black italic tracking-tighter uppercase">AfriFlow</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
