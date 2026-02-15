import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export const ConnectorsHeader = memo(() => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
                    Connecteurs <span className="text-primary">& API</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                    Reliez votre écosystème à WhatsApp et automatisez vos flux de données.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                    <RefreshCw className="h-4 w-4" /> Actualiser
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-black gap-2 h-11 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                    <Plus className="h-4.5 w-4.5" /> Créer une Clé API
                </Button>
            </div>
        </div>
    );
});

ConnectorsHeader.displayName = "ConnectorsHeader";
