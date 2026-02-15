"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Simple admin authentication (you can replace with NextAuth later)
            // For now, check against hardcoded admin credentials
            const validAdmins = [
                { email: "admin@wozif.com", password: "admin123" },
                { email: "koffi@wozif.com", password: "wozif2026" },
            ];

            const admin = validAdmins.find(
                a => a.email === email && a.password === password
            );

            if (admin) {
                // Store admin session
                localStorage.setItem("wozif-admin-email", email);
                localStorage.setItem("wozif-admin-logged", "true");

                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError("Email ou mot de passe incorrect");
            }
        } catch (err: any) {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
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
                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
                            <Shield className="size-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Wozif Admin
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Connectez-vous pour accéder au tableau de bord
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="admin@wozif.com"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
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
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
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
                            className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="size-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <p className="text-xs text-blue-400 mb-2 font-medium">🔐 Compte admin de test :</p>
                        <p className="text-xs text-zinc-400">
                            Email: <code className="text-blue-300">admin@wozif.com</code>
                        </p>
                        <p className="text-xs text-zinc-400">
                            Password: <code className="text-blue-300">admin123</code>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-zinc-600 text-sm">
                        Wozif Dashboard © 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
