"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Zap,
    ChevronLeft,
    ArrowRight,
    Rocket,
    Layout,
    Globe,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createApplication } from "@/lib/actions/applications";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NewApplicationPage() {
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const categories = [
        "E-commerce",
        "SaaS & Logiciel",
        "Services Financiers",
        "Éducation",
        "Santé",
        "Voyage & Tourisme",
        "Autre"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const res = await createApplication(name, website, category);
            if (res.success) {
                toast.success("Espace de travail créé avec succès !");
                // Save to local storage for quick selection
                if (res.data) {
                    localStorage.setItem('currentAppId', res.data.id);
                    document.cookie = `applicationId=${res.data.id}; path=/; max-age=31536000`;
                }
                router.push("/");
                router.refresh();
            } else {
                toast.error(res.error || "Erreur lors de la création");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 blur-[100px] rounded-full opacity-50" />
            </div>

            <div className="w-full max-w-5xl z-10 space-y-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Zap className="h-6 w-6 fill-current" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-white block leading-none">AfriFlow</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Setup Console</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="group text-muted-foreground hover:text-white transition-colors"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Annuler
                    </Button>
                </div>

                <div className="grid lg:grid-cols-5 gap-16 items-center">
                    {/* Left Side: Creation Form */}
                    <div className="lg:col-span-3 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <h1 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                                Lancez votre <br />
                                <span className="text-primary italic">prochain</span> espace.
                            </h1>
                            <p className="text-muted-foreground text-xl max-w-md leading-relaxed">
                                Donnez un nom à votre application pour commencer à orchestrer vos flux financiers.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                                            Nom de l'espace de travail
                                        </label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ex: AfriFlow Global, Boutique..."
                                            className="h-14 text-lg px-6 rounded-2xl bg-white/[0.03] border-white/[0.08] focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/20"
                                            autoFocus
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                                            Site Web (Optionnel)
                                        </label>
                                        <Input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://votre-site.com"
                                            className="h-14 text-base px-6 rounded-2xl bg-white/[0.03] border-white/[0.08] focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/20"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                                            Catégorie d'activité
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setCategory(cat)}
                                                    className={cn(
                                                        "h-10 px-4 rounded-xl text-xs font-bold border transition-all truncate",
                                                        category === cat
                                                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                            : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-16 px-12 rounded-3xl text-lg font-bold transition-all shadow-2xl shadow-primary/20 group relative overflow-hidden w-full md:w-auto"
                                    disabled={isLoading || !name.trim()}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isLoading ? "Préparation..." : "Créer l'espace"}
                                        {!isLoading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
                                    </span>
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-primary-foreground/10 animate-pulse" />
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Side: Features/Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                            {/* Tech Graphic with Rocket Icon - Larger size */}
                            <div className="absolute top-[-2rem] right-[-2rem] p-0 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none group-hover:scale-110 group-hover:rotate-12">
                                <div className="relative h-72 w-72 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[1px] border-primary/30 rounded-full animate-[spin_30s_linear_infinite]" />
                                    <div className="absolute inset-8 border-[1px] border-blue-400/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                                    <div className="absolute inset-16 border-[1px] border-emerald-400/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                    <Rocket className="h-20 w-20 text-primary opacity-40 rotate-[-12deg]" />
                                </div>
                            </div>

                            <div className="relative space-y-10">
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Isolation native</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Chaque espace est une instance séparée avec ses propres configurations et sécurité.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { icon: Shield, text: "Clés API souveraines", color: "text-blue-400" },
                                        { icon: Globe, text: "Paramètres régionaux dédiés", color: "text-emerald-400" },
                                        { icon: Zap, text: "Relances personnalisées", color: "text-amber-400" }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-4 group/item">
                                            <div className={cn("h-10 w-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] transition-colors group-hover/item:border-white/10", feat.color)}>
                                                <feat.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-muted-foreground/80">{feat.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] leading-relaxed">
                                        Prêt à passer à l'échelle ? <br />
                                        La souveraineté de vos données commence ici.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
