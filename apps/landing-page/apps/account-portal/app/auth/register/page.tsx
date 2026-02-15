"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Globe, Loader2, Sparkles, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
    firstName: z.string().min(2, "Prénom trop court"),
    lastName: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères min.")
        .regex(/[A-Z]/, "Une majuscule requis")
        .regex(/[0-9]/, "Un chiffre requis"),
    terms: z.literal(true, {
        errorMap: () => ({ message: "Obligatoire" }),
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://wozif.com";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Une erreur est survenue");
            }

            const loginResult = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (loginResult?.error) {
                router.push("/auth/login?registered=true");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column - Elite Branding */}
            <div className="hidden lg:flex w-5/12 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-[120%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full" />
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                <div className="relative z-10">
                    <Link href={MAIN_SITE_URL} className="inline-block hover:scale-105 transition-transform group">
                        <Logo height={50} theme="dark" />
                    </Link>
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-6xl xl:text-8xl font-[900] text-white mb-10 leading-[0.85] tracking-[-0.06em]">
                            Bâtissez <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 font-black">l&apos;exceptionnel</span> <br /> avec Wozif.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { icon: Zap, title: "Go-live instantané", desc: "Configuration en moins d'une minute." },
                            { icon: ShieldCheck, title: "Sécurité souveraine", desc: "Données cryptées de bout en bout." },
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex gap-5 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                                    <feat.icon className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-lg tracking-tight mb-1 uppercase">{feat.title}</h4>
                                    <p className="text-slate-500 font-medium text-sm leading-snug">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-white/50">{n}</div>
                        ))}
                    </div>
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        Rejoint par +500 <br /> leaders tech
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto">
                <div className="w-full max-w-[500px] py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-12">
                            <h1 className="text-4xl lg:text-5xl font-[900] text-slate-950 mb-3 tracking-[-0.04em] leading-tight uppercase">
                                Créer votre <br /> identité Wozif.
                            </h1>
                            <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed">
                                Un seul compte pour piloter votre empire digital.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-5 rounded-[2rem] bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex gap-3 items-center animate-shake">
                                    <div className="w-2 h-2 rounded-full bg-red-600" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="auth-label" htmlFor="firstName">Prénom</label>
                                    <input
                                        {...register("firstName")}
                                        id="firstName"
                                        type="text"
                                        placeholder="Jean"
                                        className={`auth-input ${errors.firstName ? "border-red-500 ring-red-500/5" : ""}`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-[10px] text-red-500 font-black uppercase mt-1 ml-1">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="auth-label" htmlFor="lastName">Nom</label>
                                    <input
                                        {...register("lastName")}
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className={`auth-input ${errors.lastName ? "border-red-500 ring-red-500/5" : ""}`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-[10px] text-red-500 font-black uppercase mt-1 ml-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="auth-label" htmlFor="email">Email Professionnel</label>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="ceo@entreprise.com"
                                    className={`auth-input ${errors.email ? "border-red-500 ring-red-500/5" : ""}`}
                                />
                                {errors.email && (
                                    <p className="text-[10px] text-red-500 font-black uppercase mt-1 ml-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="auth-label" htmlFor="password">Mot de passe</label>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`auth-input ${errors.password ? "border-red-500 ring-red-500/5" : ""}`}
                                />
                                {errors.password ? (
                                    <p className="text-[10px] text-red-500 font-black uppercase mt-1 ml-1">{errors.password.message}</p>
                                ) : (
                                    <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-widest">Min. 8 caractères, un chiffre et une majuscule.</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 py-4">
                                <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer">
                                    <input
                                        {...register("terms")}
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1"
                                    />
                                    <label htmlFor="terms" className="text-xs font-bold text-slate-500 leading-relaxed cursor-pointer group-hover:text-slate-900 transition-colors">
                                        J&apos;accepte les <b className="text-slate-950 underline decoration-indigo-500/30">Conditions d&apos;Utilisation</b> et la <b className="text-slate-950 underline decoration-indigo-500/30">Politique de Confidentialité</b> de l&apos;écosystème Wozif.
                                    </label>
                                </div>
                                {errors.terms && (
                                    <p className="text-[10px] text-red-500 font-black uppercase ml-1">L&apos;acceptation est requise.</p>
                                )}
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full h-18 py-6 rounded-[2rem] bg-slate-950 text-white font-black hover:bg-indigo-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] active:scale-[0.98] text-lg lg:text-xl uppercase tracking-[0.2em] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" /> Création de l&apos;ID...
                                    </>
                                ) : (
                                    "Ouvrir mon domaine"
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                Déjà membre de l&apos;élite ?{" "}
                                <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest ml-1">
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
