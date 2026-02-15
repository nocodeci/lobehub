"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, ShieldCheck, Globe, Zap, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { registerUser } from "@/lib/actions/auth";

const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await registerUser(data);

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/auth/login?registered=true");
            }
        } catch (err: unknown) {
            setError("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#050505] text-white">
            {/* Left Column - Branded for AfriFlow */}
            <div className="hidden lg:flex w-5/12 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-primary/10 blur-[120px] rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white fill-current" />
                    </div>
                    <span className="font-bold text-2xl tracking-tighter uppercase italic">Afri<span className="text-primary">Flow</span></span>
                </motion.div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <Sparkles className="w-3 h-3 text-primary" /> Nouvelle Ère
                        </span>
                        <h2 className="text-5xl xl:text-7xl font-[900] text-white mb-8 leading-[0.9] tracking-[-0.05em]">
                            Propulsez <br /> vos flux <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-200 to-emerald-400">partout.</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { icon: Zap, text: "Déploiement en 60 secondes" },
                            { icon: ShieldCheck, text: "Infrastructure ultra-sécurisée" },
                            { icon: Globe, text: "Couverture panafricaine totale" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-4 text-slate-400"
                            >
                                <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <item.icon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>© 2024 AfriFlow Orchestration</span>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-16 bg-[#050505]">
                <div className="w-full max-w-[460px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-12">
                            <h1 className="text-4xl font-[900] text-white mb-3 tracking-[-0.04em] leading-tight uppercase">
                                Créer votre <br /> accès AfriFlow.
                            </h1>
                            <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed">
                                Démarrez votre orchestration financière avec un <b className="text-primary">compte unique</b>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex gap-3 items-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="name">Nom Complet</label>
                                <div className="relative">
                                    <input
                                        {...register("name")}
                                        id="name"
                                        type="text"
                                        placeholder="Jean Dupont"
                                        className={`w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] px-8 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold placeholder:text-white/20 ${errors.name ? "border-red-500/50 ring-red-500/5" : ""}`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-[11px] text-red-500 font-black uppercase mt-1 ml-4">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="email">Email Professionnel</label>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="nom@entreprise.com"
                                    className={`w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] px-8 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold placeholder:text-white/20 ${errors.email ? "border-red-500/50 ring-red-500/5" : ""}`}
                                />
                                {errors.email && (
                                    <p className="text-[11px] text-red-500 font-black uppercase mt-1 ml-4">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="password">Mot de passe</label>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] px-8 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold placeholder:text-white/20 ${errors.password ? "border-red-500/50 ring-red-500/5" : ""}`}
                                />
                                {errors.password && (
                                    <p className="text-[11px] text-red-500 font-black uppercase mt-1 ml-4">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full h-16 rounded-[2rem] bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] active:scale-[0.98] text-lg uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" /> Inscription...
                                    </>
                                ) : (
                                    <>
                                        Créer mon compte
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                Déjà un compte ? {" "}
                                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[11px] ml-2">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
