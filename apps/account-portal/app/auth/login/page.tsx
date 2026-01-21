"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://wozif.com";

export default function LoginPage() {
    const router = useRouter();
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
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                // Get callbackUrl from search params if it exists
                const searchParams = new URLSearchParams(window.location.search);
                const callbackUrl = searchParams.get("callbackUrl");

                if (callbackUrl) {
                    window.location.href = callbackUrl;
                } else {
                    router.push("/dashboard");
                    router.refresh();
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column - World Class Branding */}
            <div className="hidden lg:flex w-5/12 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden">
                {/* Background Kinetic Art */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-indigo-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/5 blur-[120px] rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <Link href={MAIN_SITE_URL} className="inline-block hover:scale-105 transition-transform group">
                        <Logo height={50} theme="dark" />
                    </Link>
                </motion.div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <Sparkles className="w-3 h-3" /> Wozif ID Unifié
                        </span>
                        <h2 className="text-5xl xl:text-7xl font-[900] text-white mb-8 leading-[0.9] tracking-[-0.05em]">
                            Une seule clé <br /> pour tout votre <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">futur.</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { icon: Zap, text: "Accès instantané à AfriFlow & Gnata" },
                            { icon: ShieldCheck, text: "Sécurité souveraine certifiée" },
                            { icon: Globe, text: "Gouvernance centralisée" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-4 text-slate-400"
                            >
                                <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <item.icon className="h-4 w-4 text-indigo-400" />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>© 2026 Wozif Tech</span>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-[460px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link
                            href={MAIN_SITE_URL}
                            className="inline-flex lg:hidden items-center gap-2 mb-12"
                        >
                            <Logo height={40} />
                        </Link>

                        <div className="mb-12">
                            <h1 className="text-4xl font-[900] text-slate-950 mb-3 tracking-[-0.04em] leading-tight uppercase">
                                Connectez-vous <br /> à votre domaine.
                            </h1>
                            <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed">
                                Entrez vos identifiants <b className="text-slate-900">Wozif ID</b> pour continuer vers l&apos;excellence.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-[2rem] bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex gap-3 items-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="auth-label" htmlFor="email">Email Professionnel</label>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="vous@entreprise.com"
                                    className={`auth-input ${errors.email ? "border-red-500 ring-red-500/5" : ""}`}
                                />
                                {errors.email && (
                                    <p className="text-[11px] text-red-500 font-black uppercase mt-1 ml-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="auth-label" htmlFor="password">Mot de passe</label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-500"
                                    >
                                        Oublié ?
                                    </Link>
                                </div>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`auth-input ${errors.password ? "border-red-500 ring-red-500/5" : ""}`}
                                />
                                {errors.password && (
                                    <p className="text-[11px] text-red-500 font-black uppercase mt-1 ml-1">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full h-16 rounded-[2rem] bg-slate-950 text-white font-black hover:bg-indigo-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] active:scale-[0.98] text-lg lg:text-xl uppercase tracking-widest h-18 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" /> Chiffrement...
                                    </>
                                ) : (
                                    <>
                                        Entrer dans l&apos;écosystème
                                        <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-slate-500 font-bold text-sm tracking-tight text-center sm:text-left">
                                Nouveau dans l&apos;élite ? <br />
                                <Link
                                    href="/auth/register"
                                    className="text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest text-[11px]"
                                >
                                    Créer votre compte personnel
                                </Link>
                            </p>

                            <div className="flex -space-x-3 opacity-30 hover:opacity-100 transition-opacity">
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black underline">W{n}</div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
