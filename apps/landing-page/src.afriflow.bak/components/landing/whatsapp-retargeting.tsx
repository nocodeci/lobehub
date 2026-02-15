"use client";

import { motion } from "framer-motion";
import { MessageCircle, QrCode, Smartphone, XCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";

export function WhatsAppRetargeting() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium uppercase tracking-wider">
                            <MessageCircle className="h-3 w-3" />
                            Retargeting Intelligent
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
                            Ne laissez plus aucune <br />
                            <span className="text-zinc-500">vente vous échapper.</span>
                        </h2>

                        <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                            Lorsqu'une transaction échoue, AfriFlow déclenche automatiquement une relance personnalisée via WhatsApp ou Email pour récupérer le client instantanément.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <QrCode className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Connexion Instantanée</h3>
                                    <p className="text-zinc-500 text-sm">Scannez simplement un QR code pour lier votre numéro WhatsApp Business. Aucune API complexe requise.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Récupération Automatique</h3>
                                    <p className="text-zinc-500 text-sm">Le système détecte l'échec et envoie un lien de paiement sécurisé au client dans la minute.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visualization */}
                    <div className="relative">
                        {/* Phone Mockup Frame */}
                        <div className="relative z-10 mx-auto border-gray-800 bg-[#0a0a0a] border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
                            <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[10px] top-[72px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[124px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[178px] rounded-l-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[10px] top-[142px] rounded-r-lg"></div>

                            {/* Header */}
                            <div className="bg-[#1f2c34] p-4 flex items-center gap-3 border-b border-white/5">
                                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">B</div>
                                <div>
                                    <div className="text-white text-sm font-medium">Boutique 225</div>
                                    <div className="text-xs text-zinc-400">En ligne</div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 bg-[#0b141a] p-4 space-y-4 relative">
                                <div className="absolute inset-0 opacity-5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]" />

                                {/* Message 1: Failed Transaction */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-[#1f2c34] p-3 rounded-lg rounded-tl-none max-w-[85%] relative z-10"
                                >
                                    <p className="text-white text-xs leading-relaxed">
                                        Bonjour 👋, nous avons remarqué que votre paiement de <span className="font-bold">25.000 FCFA</span> a échoué.
                                    </p>
                                    <span className="text-[10px] text-zinc-500 block mt-1 text-right">10:42</span>
                                </motion.div>

                                {/* Message 2: Solution */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="bg-[#1f2c34] p-3 rounded-lg rounded-tl-none max-w-[85%] relative z-10"
                                >
                                    <p className="text-white text-xs leading-relaxed mb-2">
                                        Pas de panique ! Vous pouvez réessayer avec un autre moyen de paiement ici 👇
                                    </p>
                                    <div className="bg-[#0b141a] rounded p-2 mb-1 border border-white/5">
                                        <div className="text-green-400 text-xs font-medium mb-1">pay.afriflow.com</div>
                                        <div className="text-zinc-400 text-[10px]">Lien sécurisé expire dans 15min</div>
                                    </div>
                                    <span className="text-[10px] text-zinc-500 block mt-1 text-right">10:42</span>
                                </motion.div>

                                {/* User Reply Simulation */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 3.5 }}
                                    className="bg-[#005c4b] p-3 rounded-lg rounded-tr-none max-w-[85%] self-end ml-auto relative z-10"
                                >
                                    <p className="text-white text-xs leading-relaxed">
                                        Merci ! C'est payé ✅
                                    </p>
                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] text-white/60 mr-1">10:45</span>
                                        <CheckCircle2 className="h-3 w-3 text-sky-400" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Integration Visual (QR Code Card connected to phone) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute bottom-10 -left-12 bg-[#18181b] p-4 rounded-2xl border border-white/10 shadow-2xl w-48 z-20 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-white">Connexion Bot</span>
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                            <div className="bg-white p-2 rounded-lg mb-2">
                                <QrCode className="h-full w-full text-black" />
                            </div>
                            <p className="text-[10px] text-center text-zinc-400">Scannez pour activer</p>
                        </motion.div>


                    </div>
                </div>
            </div>
        </section>
    );
}
