"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Building2,
    Bell,
    CreditCard,
    Users,
    Mail,
    Globe2,
    Wallet,
    Settings2,
    ChevronRight,
    LogOut,
    Moon,
    Zap,
    Loader2
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
    updateApplicationImage,
    updateApplicationDetails,
    getFullCurrentApplication
} from "@/lib/actions/settings";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);
    const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

    const [appImage, setAppImage] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [website, setWebsite] = useState("");

    const loadAppData = useCallback(async () => {
        setIsLoading(true);
        const app = await getFullCurrentApplication();
        if (app) {
            setAppImage(app.image || "");
            setBusinessName(app.name || "");
            setWebsite(app.website || "");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadAppData();
    }, [loadAppData]);

    const handleUpdateImage = async () => {
        setIsUpdatingImage(true);
        const res = await updateApplicationImage(appImage);
        if (res.success) {
            toast.success("Image de l'espace mise à jour !");
        } else {
            toast.error(res.error || "Erreur lors de la mise à jour");
        }
        setIsUpdatingImage(false);
    };

    const handleUpdateDetails = async () => {
        setIsUpdatingDetails(true);
        const res = await updateApplicationDetails({
            name: businessName,
            website
        });
        if (res.success) {
            toast.success("Informations entreprises enregistrées !");
        } else {
            toast.error(res.error || "Une erreur est survenue");
        }
        setIsUpdatingDetails(false);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Système</h1>
                <p className="text-muted-foreground">
                    Personnalisez votre expérience AfriFlow et gérez vos préférences d'entreprise.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-8">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 gap-2">
                        <User className="h-4 w-4" /> Profil
                    </TabsTrigger>
                    <TabsTrigger value="business" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 gap-2">
                        <Building2 className="h-4 w-4" /> Entreprise
                    </TabsTrigger>
                    <TabsTrigger value="team" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 gap-2">
                        <Users className="h-4 w-4" /> Équipe
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 gap-2">
                        <CreditCard className="h-4 w-4" /> Facturation
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 gap-2">
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0 space-y-6">
                    <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
                        <CardHeader className="relative pt-12 pb-8 flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-white uppercase">Changer</span>
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-2xl font-bold">Amadou Diallo</CardTitle>
                            <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none">Administrateur Principal</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6 max-w-2xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Prénom</Label>
                                    <Input defaultValue="Amadou" className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Nom</Label>
                                    <Input defaultValue="Diallo" className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Email professionnel</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input defaultValue="amadou.diallo@teranga.sn" className="pl-10 bg-white/5 border-white/10" />
                                </div>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Mettre à jour mon profil</Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Préférences du Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Moon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Mode Sombre Automatique</p>
                                        <p className="text-xs text-muted-foreground">Synchroniser avec les réglages de votre système.</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary/40 relative cursor-pointer border border-primary/50">
                                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Animations Fluides</p>
                                        <p className="text-xs text-muted-foreground">Activer les transitions premium de l'interface.</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-emerald-500/40 relative cursor-pointer border border-emerald-500/50">
                                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="business" className="mt-0 space-y-6">
                    <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <CardHeader>
                            <CardTitle>Identité de l'Espace de Travail</CardTitle>
                            <CardDescription>Personnalisez l'apparence et les informations de votre application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="space-y-4">
                                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Logo de l'Espace</Label>
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center p-1">
                                            <img
                                                src={appImage || "/images/workspace-icon.png"}
                                                className="h-full w-full object-cover rounded-xl"
                                                alt="Workspace Preview"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">URL de l'image (Logo)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={appImage}
                                                onChange={(e) => setAppImage(e.target.value)}
                                                placeholder="https://votre-logo.com/image.png"
                                                className="bg-white/5 border-white/10"
                                            />
                                            <Button
                                                onClick={handleUpdateImage}
                                                disabled={isUpdatingImage}
                                                className="shrink-0 bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30"
                                            >
                                                {isUpdatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">Laissez vide pour utiliser l'icône 3D par défaut.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Nom commercial</Label>
                                    <Input
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Site Web</Label>
                                    <Input
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://votre-site.com"
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleUpdateDetails}
                                disabled={isUpdatingDetails}
                                className="mt-4 gap-2 bg-primary shadow-lg shadow-primary/20"
                            >
                                {isUpdatingDetails && <Loader2 className="h-4 w-4 animate-spin" />}
                                Sauvegarder les modifications
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl opacity-60 grayscale-[0.5]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe2 className="h-5 w-5 text-muted-foreground" />
                                Informations Légales (Lecture seule)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono text-muted-foreground">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="block mb-1 text-[10px] uppercase font-black">Devise</span>
                                    FCFA (XOF)
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="block mb-1 text-[10px] uppercase font-black">Siège Social</span>
                                    Avenue Cheikh Anta Diop, Dakar
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                    <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-primary/10">
                            <Wallet className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle>Plan Actuel</CardTitle>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-3xl font-black italic text-primary uppercase tracking-tighter">Pro Orchestrator</span>
                                <Badge className="bg-emerald-500 text-white font-bold px-4">ACTIF</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold">Prochaine facture</p>
                                    <p className="text-xs text-muted-foreground">Le 1 Février 2024</p>
                                </div>
                                <p className="text-xl font-black italic underline decoration-primary decoration-4">45,000 FCFA / mois</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1">Voir les factures</Button>
                                <Button className="flex-1 bg-white text-black hover:bg-white/90">Gérer l'abonnement</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Other tabs can be empty placeholders or simple cards for brevity as they are less critical for a demo */}
            </Tabs>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                <div>
                    <p className="font-bold text-red-500">Zone de danger</p>
                    <p className="text-xs text-muted-foreground">Supprimez définitivement votre compte et toutes les données associées.</p>
                </div>
                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 gap-2 border border-red-500/20">
                    <LogOut className="h-4 w-4" /> Fermer le compte
                </Button>
            </div>
        </div>
    );
}
