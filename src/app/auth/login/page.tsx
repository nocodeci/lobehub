"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/";
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
                callbackUrl: callbackUrl,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                // Use window.location.href instead of router.push to ensure a full page reload 
                // and avoid any potential origin/client-side routing issues during SSO
                window.location.href = callbackUrl;
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#050505] text-white">
            {/* Left Column - Branded for AfriFlow */}
            <div className="hidden lg:flex w-5/12 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
                {/* Background Kinetic Art */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-primary/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/5 blur-[120px] rounded-full" />
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
                            <Sparkles className="w-3 h-3 text-primary" /> Authentification Souveraine
                        </span>
                        <h2 className="text-5xl xl:text-7xl font-[900] text-white mb-8 leading-[0.9] tracking-[-0.05em]">
                            Accédez à <br /> l'orchestration <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-200 to-emerald-400">ultime.</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { icon: Zap, text: "Gestion unifiée des passerelles" },
                            { icon: ShieldCheck, text: "Sécurité bancaire de grade élite" },
                            { icon: Globe, text: "Gouvernance financière centralisée" },
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

                <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Partagez le Wozif ID</span>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white transition-colors">Politique</Link>
                        <Link href="#" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-16 bg-[#050505]">
                <div className="w-full max-w-[460px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-2 mb-12">
                            <Zap className="h-8 w-8 text-primary fill-current" />
                            <span className="font-bold text-xl tracking-tighter uppercase italic">Afri<span className="text-primary">Flow</span></span>
                        </div>

                        <div className="mb-12">
                            <h1 className="text-4xl font-[900] text-white mb-3 tracking-[-0.04em] leading-tight uppercase">
                                AfriFlow <br /> Connexion.
                            </h1>
                            <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed">
                                Connectez-vous avec votre <b className="text-primary">Wozif ID</b> pour accéder à votre dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {searchParams?.get("registered") && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex gap-3 items-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Compte créé avec succès ! Connectez-vous.
                                </motion.div>
                            )}
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
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="password">Mot de passe</label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-[11px] font-black uppercase tracking-widest text-primary hover:text-primary/80"
                                    >
                                        Oublié ?
                                    </Link>
                                </div>
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
                                        <Loader2 className="h-6 w-6 animate-spin" /> Authentification...
                                    </>
                                ) : (
                                    <>
                                        Entrer dans le Dashboard
                                        <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-slate-500 font-bold text-sm tracking-tight text-center sm:text-left">
                                Authentifié par <b className="text-white">Wozif ID</b> <br />
                                <Link
                                    href="/auth/register"
                                    className="text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[11px]"
                                >
                                    Démarrer avec un nouveau compte
                                </Link>
                            </p>

                            <div className="flex -space-x-3 opacity-30 hover:opacity-100 transition-opacity">
                                <Zap className="h-8 w-8 text-primary" />
                                <Globe className="h-8 w-8 text-indigo-400" />
                                <ShieldCheck className="h-8 w-8 text-emerald-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
