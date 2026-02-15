"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoderLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/coder/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: mode,
                    email,
                    password,
                    name: mode === "register" ? name : undefined,
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Store coder ID in localStorage
                localStorage.setItem("gnata-coder-id", data.coder.id);
                localStorage.setItem("gnata-coder-name", data.coder.name);
                localStorage.setItem("gnata-coder-email", data.coder.email);

                // Redirect to dashboard
                router.push("/coder");
            } else {
                setError(data.error || "Une erreur est survenue");
            }
        } catch (err: any) {
            setError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
                            <Sparkles className="size-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {mode === "login" ? "Connexion Vibe Coder" : "Devenir Vibe Coder"}
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            {mode === "login"
                                ? "Connectez-vous pour accéder à vos projets"
                                : "Créez votre compte pour commencer à coder"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "register" && (
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom"
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="coder@gnata.io"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-3"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 text-base"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>
                                    {mode === "login" ? "Se connecter" : "Créer mon compte"}
                                    <ArrowRight className="size-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Toggle mode */}
                    <div className="mt-6 text-center">
                        <p className="text-zinc-500 text-sm">
                            {mode === "login" ? (
                                <>
                                    Pas encore de compte ?{" "}
                                    <button
                                        onClick={() => setMode("register")}
                                        className="text-purple-400 hover:text-purple-300 font-medium"
                                    >
                                        S'inscrire
                                    </button>
                                </>
                            ) : (
                                <>
                                    Déjà un compte ?{" "}
                                    <button
                                        onClick={() => setMode("login")}
                                        className="text-purple-400 hover:text-purple-300 font-medium"
                                    >
                                        Se connecter
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <p className="text-xs text-purple-400 mb-2 font-medium">🔐 Compte de test :</p>
                        <p className="text-xs text-zinc-400">
                            Email: <code className="text-purple-300">coder1@gnata.io</code>
                        </p>
                        <p className="text-xs text-zinc-400">
                            Password: <code className="text-purple-300">password123</code>
                        </p>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Retour au site principal
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
