"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Globe, MoreVertical, Smartphone, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getGateways } from "@/lib/actions/gateways";

export function GatewayList() {
    const [gateways, setGateways] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGateways = async () => {
            const data = await getGateways();
            setGateways(data);
            setIsLoading(false);
        };
        fetchGateways();
    }, []);

    if (isLoading) {
        return (
            <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg overflow-hidden h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }
    return (
        <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Passerelles Africaines Connectées</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Statut en temps réel des intégrations régionales.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="h-8 rounded-lg gap-1">
                        <Globe className="h-3 w-3" /> 12 Pays
                    </Badge>
                    <Badge variant="outline" className="h-8 rounded-lg gap-1">
                        <Smartphone className="h-3 w-3" /> Mobile Money
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="pl-6 w-[200px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Passerelle</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Régions</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Statut</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Uptime</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Succès</TableHead>
                            <TableHead className="text-right pr-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gateways.map((gateway) => (
                            <TableRow key={gateway.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group/row">
                                <TableCell className="pl-6 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs overflow-hidden p-1.5 flex-shrink-0">
                                            {gateway.logo ? (
                                                <img src={gateway.logo} alt={gateway.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-primary">{gateway.name.substring(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="truncate">{gateway.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {gateway.countries.map((c: string) => (
                                            <Badge key={c} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal bg-white/5 border-white/5">
                                                {c}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${gateway.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                            gateway.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                        <span className="capitalize text-xs font-medium">{gateway.status === 'active' ? 'Opérationnel' : gateway.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground">{gateway.uptime}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${parseFloat(gateway.successRate) > 95 ? 'bg-emerald-500' :
                                                    parseFloat(gateway.successRate) > 85 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: gateway.successRate }}
                                            />
                                        </div>
                                        <span className="text-[11px] font-bold font-mono">{gateway.successRate}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
