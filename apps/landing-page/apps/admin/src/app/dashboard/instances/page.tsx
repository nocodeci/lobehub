"use client";

import React, { useState } from "react";
import {
    Shield,
    Smartphone,
    Plus,
    RefreshCw,
    QrCode,
    Loader2,
    Wifi,
    Battery,
    Server,
    Activity,
    Signal,
    SmartphoneNfc,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Search,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminInstancesPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [instances, setInstances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectedNumber, setConnectedNumber] = useState<string | null>(null);

    const fetchSessions = async () => {
        try {
            const response = await fetch(`/api/bridge/sessions`);
            const data = await response.json();
            if (data.success) {
                // Map bridge sessions to display format
                const mapped = data.sessions
                    .filter((s: any) => {
                        const userId = String(s.userId).toLowerCase();
                        const isGarbage = userId === "undefined" || userId === "null" || userId === "" || userId === "test-user";
                        const isAuto = userId.startsWith("auto_") || userId.includes("automation_");

                        // Always show if connected, otherwise filter out test/auto sessions
                        if (s.status === "CONNECTED") return true;
                        return !isGarbage && !isAuto;
                    })
                    .map((s: any) => ({
                        id: s.userId,
                        name: s.pushName || (s.userId === "admin" ? "Master SIM" : `Node-${s.userId.slice(-4)}`),
                        number: (() => {
                            let raw = s.jid ? s.jid.split(':')[0].split('@')[0] : (s.userId === "admin" ? "" : s.userId);
                            if (s.userId === "admin" && !s.jid) return "MASTER";

                            // Format CI numbers: 225XXXXXXXXX -> +225 XX XX XX XX
                            if (raw.startsWith("225") && (raw.length === 12 || raw.length === 13)) {
                                const carrier = raw.startsWith("2250") ? raw.slice(3) : raw.slice(3);
                                // Just simple spacing for now
                                return `+225 ${raw.slice(3, 5)} ${raw.slice(5, 7)} ${raw.slice(7, 9)} ${raw.slice(9, 11)} ${raw.slice(11)}`;
                            }
                            return raw ? `+${raw}` : "INC_DEVICE";
                        })(),
                        status: s.status === "CONNECTED" ? "online" : "offline",
                        battery: s.status === "CONNECTED" ? (s.batteryPercentage > 0 ? `${s.batteryPercentage}%` : "92%") : "0%",
                        signal: s.status === "CONNECTED" ? (s.signalStrength || 5) : 0,
                        load: s.status === "CONNECTED" ? "12%" : "0%",
                        type: s.userId === "admin" ? "Master" : "Mirror",
                        platform: s.platform,
                        isCharging: s.isCharging
                    }));
                setInstances(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleGenerateQR = async () => {
        if (!phoneNumber) return;
        setIsGeneratingQR(true);

        // Sanitize phone number to use as userId
        let userId = phoneNumber.replace(/[^0-9]/g, "");

        // Auto-prefix for Ivory Coast numbers if 10 digits starting with 0
        if (userId.length === 10 && userId.startsWith("0")) {
            userId = "225" + userId;
        }

        try {
            // First call to initialize session
            await fetch(`/api/bridge?userId=${userId}`);

            // Poll for QR code
            const pollInterval = setInterval(async () => {
                const response = await fetch(`/api/bridge?userId=${userId}`);
                const data = await response.json();

                if (data.success && data.qr) {
                    setQrValue(data.qr);
                    setIsGeneratingQR(false);
                    setShowQR(true);
                } else if (data.status === "CONNECTED") {
                    setIsGeneratingQR(false);
                    setShowQR(false);
                    setConnectedNumber(userId);
                    clearInterval(pollInterval);
                    fetchSessions(); // Refresh list immediately

                    // Clear success message after 5 seconds
                    setTimeout(() => setConnectedNumber(null), 5000);
                }
            }, 2000);

            // Timeout after 60 seconds
            setTimeout(() => {
                clearInterval(pollInterval);
                if (isGeneratingQR) setIsGeneratingQR(false);
            }, 60000);

        } catch (error) {
            console.error("Failed to fetch QR:", error);
            setIsGeneratingQR(false);
        }
    };

    const handleDeleteInstance = async (userId: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'instance ${userId} ?`)) return;

        try {
            const response = await fetch(`/api/bridge?userId=${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchSessions();
            }
        } catch (error) {
            console.error("Failed to delete session:", error);
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <SmartphoneNfc className="size-5 text-purple-500" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                            Instances <span className="text-purple-500">SIM Maîtres</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">Gestion de l'infrastructure physique pour le simulateur WhatsApp.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Card className="bg-white/5 border-white/5 px-4 py-2 flex items-center gap-3 rounded-2xl">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Système OK</span>
                    </Card>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Canaux Actifs",
                        value: `${instances.filter(i => i.status === 'online').length} / ${instances.length}`,
                        icon: Signal,
                        color: "text-purple-500"
                    },
                    { label: "Load Global", value: "12%", icon: Activity, color: "text-blue-500" },
                    { label: "Uptime SIM", value: "99.9%", icon: CheckCircle2, color: "text-emerald-500" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#111] border-white/5 overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Connection Portal */}
                <div className="lg:col-span-1">
                    <Card className="bg-[#111] border-white/10 overflow-hidden sticky top-6">
                        <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600" />
                        <CardContent className="p-8">
                            {!showQR ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="size-20 rounded-[32px] bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                                        <Smartphone className="size-10 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-white mb-2">Connecter une SIM</h3>
                                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                                        Entrez le numéro de la SIM physique avant de générer le code de connexion.
                                    </p>

                                    <div className="w-full mb-6 space-y-2">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                            Numéro de téléphone
                                        </label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+225 00 00 00 00 00"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 transition-all"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleGenerateQR}
                                        disabled={isGeneratingQR || !phoneNumber}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black uppercase text-xs tracking-widest h-14 rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGeneratingQR ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            "Initialiser le Pont"
                                        )}
                                    </Button>

                                    {connectedNumber && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-full"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connecté avec succès</p>
                                                    <p className="text-xs font-bold text-white tracking-tight">Numéro: +{connectedNumber}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="mb-8 p-4 bg-white rounded-3xl">
                                        <div className={`size-48 bg-cover`} style={{ backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrValue)})` }} />
                                    </div>
                                    <div className="flex items-center gap-3 text-purple-400 animate-pulse mb-8">
                                        <div className="size-2 rounded-full bg-purple-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Prêt pour le scan ({phoneNumber})</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowQR(false)}
                                        className="w-full text-xs font-bold text-zinc-500 hover:text-white"
                                    >
                                        Modifier le numéro
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Instance List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Infrastructure SIM Active</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
                                <input
                                    className="bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-purple-500/50 w-48"
                                    placeholder="Rechercher Node..."
                                />
                            </div>
                        </div>
                    </div>

                    {instances.map((inst, idx) => (
                        <motion.div
                            key={inst.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="bg-[#111] border-white/5 hover:border-purple-500/30 transition-all duration-500 group">
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${inst.status === 'online'
                                            ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                            : 'bg-zinc-800 text-zinc-600 border border-white/5 opacity-50'
                                            }`}>
                                            <Smartphone className="size-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight">{inst.name}</h4>
                                                <Badge className="bg-white/5 text-zinc-500 border-none text-[8px] font-black uppercase tracking-widest">
                                                    {inst.type} {inst.platform && ` • ${inst.platform}`}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-zinc-500 font-mono tracking-wider">{inst.number}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full ${inst.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${inst.status === 'online' ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                                        {inst.status === 'online' ? 'MASTER ACTIVE' : 'NODE OFFLINE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 pl-6 border-l border-white/5">
                                        <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
                                            <Battery className={`size-4 ${inst.isCharging ? 'text-emerald-400 animate-pulse' : (parseInt(inst.battery) < 20 ? 'text-red-500 animate-bounce' : 'text-zinc-600 opacity-40')}`} />
                                            <span className="text-[11px] font-black text-white">{inst.battery}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
                                            <Wifi className="size-4 text-zinc-600 opacity-40" />
                                            <span className="text-[11px] font-black text-white">{inst.signal}/5</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
                                            <Activity className="size-4 text-zinc-600 opacity-40" />
                                            <span className="text-[11px] font-black text-white">{inst.load}</span>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => fetchSessions()}
                                                className="size-10 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                                            >
                                                <RefreshCw className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteInstance(inst.id)}
                                                className="size-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="size-10 rounded-xl bg-white/5 hover:bg-purple-500/20 text-zinc-500 hover:text-purple-500 transition-all">
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <div className="p-8 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center opacity-30 hover:opacity-100 transition-all cursor-pointer group hover:bg-white/5 mt-6">
                        <div className="size-12 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="size-6 text-zinc-500" />
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Ajouter un Node de secours (Mirror)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
