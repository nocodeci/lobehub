"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  User,
  Bell,
  CreditCard,
  Smartphone,
  Languages,
  Moon,
  Volume2,
  Database,
  Shield,
  HelpCircle,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  Globe,
  Plus,
  RefreshCw,
  QrCode,
  Loader2,
  CheckCircle2,
  XCircle,
  Wifi,
  Battery,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { id: "profile", icon: User, label: "Profil & Compte" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "billing", icon: CreditCard, label: "Facturation & Plan" },
  { id: "instance", icon: Smartphone, label: "WhatsApp Instance" },
  { id: "preferences", icon: Moon, label: "Préférences" },
  { id: "advanced", icon: Database, label: "Données & Backup" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("profile");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Extraire les informations utilisateur de la session
  const user = session?.user;
  const userName = user?.name || "Utilisateur";
  const userEmail = user?.email || "";
  const userId = (user as any)?.id || "";

  // Générer les initiales à partir du nom
  const userInitials = useMemo(() => {
    if (!userName) return "??";
    const parts = userName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  }, [userName]);

  // Générer un ID court pour l'affichage
  const shortUserId = useMemo(() => {
    if (!userId) return "----";
    return userId.slice(-4).toUpperCase();
  }, [userId]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [instances, setInstances] = useState<any[]>([]);
  const [connectedNumber, setConnectedNumber] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/sessions`);
      const data = await response.json();
      if (data.success) {
        const mapped = data.sessions
          .filter((s: any) => {
            const userId = String(s.userId).toLowerCase();
            const isGarbage =
              userId === "undefined" ||
              userId === "null" ||
              userId === "" ||
              userId === "test-user";
            const isAuto =
              userId.startsWith("auto_") || userId.includes("automation_");

            // Always show if connected, otherwise filter out test/auto sessions
            if (s.status === "CONNECTED") return true;
            return !isGarbage && !isAuto;
          })
          .map((s: any) => ({
            id: s.userId,
            name:
              s.pushName ||
              (s.userId === "admin"
                ? "SIM Maître"
                : `SIM ${s.userId.slice(-4)}`),
            number: s.jid
              ? `+${s.jid.split(":")[0].split("@")[0]}`
              : s.userId === "admin"
                ? "MASTER"
                : `+${s.userId}`,
            status: s.status === "CONNECTED" ? "online" : "offline",
            battery:
              s.status === "CONNECTED"
                ? s.batteryPercentage > 0
                  ? `${s.batteryPercentage}%`
                  : "92%"
                : "0%",
            signal: s.status === "CONNECTED" ? s.signalStrength || 5 : 0,
            isCharging: s.isCharging,
            platform: s.platform,
          }));
        setInstances(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  React.useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateQR = async () => {
    if (!phoneNumber) return;
    setIsGeneratingQR(true);
    setConnectionError(null);

    const userId = phoneNumber.replace(/[^0-9]/g, "");

    try {
      // First call to initialize session
      await fetch(`http://localhost:8080/api/qr?userId=${userId}`);

      // Poll for QR code
      const pollInterval = setInterval(async () => {
        const response = await fetch(
          `http://localhost:8080/api/qr?userId=${userId}`,
        );
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
          fetchSessions();
          setTimeout(() => setConnectedNumber(null), 5000);
        } else if (data.lastError) {
          setConnectionError(data.lastError);
          setIsGeneratingQR(false);
          clearInterval(pollInterval);
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
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'instance ${userId} ?`))
      return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/sessions?userId=${userId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (data.success) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
          <div className="max-w-[1200px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                Configuration <span className="text-primary">Générale</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                Personnalisez votre expérience et gérez les paramètres de votre
                plateforme.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Settings Navigation */}
              <div className="lg:col-span-1 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeSection === item.id
                        ? "bg-primary text-black shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === "profile" && (
                    <div className="space-y-6">
                      <Card className="bg-[#171717] border-white/10 overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                            <div className="relative group">
                              <div className="h-24 w-24 rounded-[32px] bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-3xl font-black border-2 border-white/10 group-hover:border-primary/50 transition-colors overflow-hidden">
                                {userInitials}
                              </div>
                              <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center border-4 border-[#171717] hover:scale-110 transition-transform">
                                <Camera className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="text-center md:text-left">
                              <h3 className="text-xl font-black uppercase tracking-tight">
                                {userName}
                              </h3>
                              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                                Administrateur Principal
                              </p>
                              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <Badge className="bg-emerald-400/10 text-emerald-400 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  Enterprise Plan
                                </Badge>
                                <Badge className="bg-white/5 text-white/40 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest underline decoration-primary/50">
                                  ID: #WZ-{shortUserId}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                Nom complet
                              </label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50"
                                  defaultValue={userName}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                Email professionnel
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50"
                                  defaultValue={userEmail}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                Numéro WhatsApp
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50"
                                  placeholder="+225 00 00 00 00 00"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                Fuseau Horaire
                              </label>
                              <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <select className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50 appearance-none">
                                  <option>GMT+00:00 (Abidjan)</option>
                                  <option>GMT+01:00 (Paris)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-3">
                            <Button
                              variant="ghost"
                              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                            >
                              Annuler
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-black font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-primary/20">
                              Enregistrer les modifications
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeSection === "notifications" && (
                    <Card className="bg-[#171717] border-white/10">
                      <CardContent className="p-8 space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 mb-6 font-sans">
                          Canaux de notification
                        </h3>

                        <div className="space-y-6">
                          {[
                            {
                              title: "Alertes CRM",
                              desc: "Recevoir une notification lors d'une nouvelle vente ou lead.",
                              active: true,
                            },
                            {
                              title: "Statut Instance",
                              desc: "Être prévenu si votre WhatsApp est déconnecté.",
                              active: true,
                            },
                            {
                              title: "Rapport Hebdomadaire",
                              desc: "Le résumé de vos performances chaque lundi matin.",
                              active: false,
                            },
                            {
                              title: "Erreurs Automation",
                              desc: "Alertes immédiates en cas d'échec d'un workflow.",
                              active: true,
                            },
                          ].map((notif, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group"
                            >
                              <div className="space-y-0.5">
                                <p className="text-xs font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                                  {notif.title}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium opacity-50 uppercase tracking-widest">
                                  {notif.desc}
                                </p>
                              </div>
                              <Switch
                                checked={notif.active}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === "instance" && (
                    <div className="space-y-6">
                      {/* Admin Notice */}
                      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight text-white mb-1">
                            Administration des Instances Maîtres
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            Connectez vos cartes SIM physiques ici. Ces numéros
                            seront utilisés par le{" "}
                            <span className="text-primary font-bold">
                              Simulateur/Playground
                            </span>{" "}
                            pour envoyer de vrais messages lors des tests.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Add New Instance Card */}
                        <Card className="bg-[#171717] border-white/10 overflow-hidden relative group">
                          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                            {!showQR ? (
                              <>
                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                  <Smartphone className="h-8 w-8 text-muted-foreground opacity-40" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                                  Nouvelle Puce Physique
                                </h3>
                                <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">
                                  Entrez le numéro de la SIM avant de générer le
                                  code.
                                </p>

                                <div className="w-full mb-6 space-y-2">
                                  <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                      setPhoneNumber(e.target.value)
                                    }
                                    placeholder="+225 00 00 00 00 00"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all text-center"
                                  />
                                </div>

                                <Button
                                  onClick={handleGenerateQR}
                                  disabled={isGeneratingQR || !phoneNumber}
                                  className="bg-primary hover:bg-primary/90 text-black font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                  {isGeneratingQR ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>Générer QR Code</>
                                  )}
                                </Button>

                                {connectedNumber && (
                                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl w-full">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary" />
                                      <div className="text-left">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                                          Connecté
                                        </p>
                                        <p className="text-[10px] font-bold text-white">
                                          +{connectedNumber}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {connectionError && (
                                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl w-full">
                                    <div className="flex items-center gap-2">
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      <div className="text-left">
                                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                                          Échec
                                        </p>
                                        <p className="text-[10px] font-bold text-white max-w-[180px] break-words line-clamp-2">
                                          {connectionError}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="space-y-6 w-full flex flex-col items-center">
                                <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                  <div
                                    className="size-48 bg-cover"
                                    style={{
                                      backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrValue)})`,
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-primary animate-pulse">
                                  <RefreshCw className="h-3 w-3" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">
                                    Code prêt pour {phoneNumber}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  onClick={() => setShowQR(false)}
                                  className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-white"
                                >
                                  Modifier le numéro
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* List of Active Instances */}
                        <div className="space-y-4">
                          {instances.map((inst) => (
                            <Card
                              key={inst.id}
                              className="bg-[#171717] border-white/10 hover:border-primary/30 transition-all duration-300"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        inst.status === "online"
                                          ? "bg-emerald-400/10 text-emerald-400"
                                          : "bg-red-400/10 text-red-400"
                                      }`}
                                    >
                                      <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-black uppercase tracking-tight text-white">
                                        {inst.name}
                                      </h4>
                                      <p className="text-[10px] text-muted-foreground font-medium">
                                        {inst.number}{" "}
                                        {inst.platform && ` • ${inst.platform}`}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    className={`${
                                      inst.status === "online"
                                        ? "bg-emerald-500 text-black"
                                        : "bg-red-500 text-white"
                                    } border-none font-black text-[8px] uppercase tracking-widest`}
                                  >
                                    {inst.status === "online"
                                      ? "Connecté"
                                      : "Déconnecté"}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-black/20 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
                                    <Wifi className="h-3 w-3 text-muted-foreground opacity-40" />
                                    <span className="text-[10px] font-black text-white">
                                      {inst.signal}/5
                                    </span>
                                    <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">
                                      Signal
                                    </span>
                                  </div>
                                  <div className="bg-black/20 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
                                    <Battery
                                      className={`h-3 w-3 ${inst.isCharging ? "text-emerald-400 animate-pulse" : "text-muted-foreground opacity-40"}`}
                                    />
                                    <span className="text-[10px] font-black text-white">
                                      {inst.battery}
                                    </span>
                                    <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">
                                      Batterie
                                    </span>
                                  </div>
                                  <div
                                    onClick={() => fetchSessions()}
                                    className="bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                      Status
                                    </span>
                                  </div>
                                  <div
                                    onClick={() =>
                                      handleDeleteInstance(inst.id)
                                    }
                                    className="bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 hover:bg-red-500/10 transition-colors cursor-pointer group"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-red-500" />
                                    <span className="text-[7px] font-bold text-muted-foreground group-hover:text-red-500 uppercase tracking-widest mt-1">
                                      Suppr.
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          <div className="flex items-center gap-2 p-4 border border-dashed border-white/10 rounded-2xl justify-center opacity-40">
                            <Plus className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Auto-Scale Instances
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection !== "profile" &&
                    activeSection !== "notifications" &&
                    activeSection !== "instance" && (
                      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#171717]/50 rounded-[40px] border border-white/5 border-dashed">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                          <Settings className="h-10 w-10 text-muted-foreground opacity-20 animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">
                          Section en développement
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md mt-2">
                          Cette partie des réglages est en cours d'optimisation
                          pour vous offrir la meilleure expérience possible.
                        </p>
                      </div>
                    )}
                </motion.div>
              </div>
            </div>

            <div className="h-20" />
          </div>
        </div>
      </main>
    </div>
  );
}
