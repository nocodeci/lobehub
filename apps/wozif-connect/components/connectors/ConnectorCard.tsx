import React, { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Connector } from "../../types/connectors";
import {
    getConnectorColorClasses,
    getConnectorGlowClasses,
    getStatusBadgeConfig
} from "../../utils/connectors";

interface ConnectorCardProps {
    connector: Connector;
    index: number;
}

export const ConnectorCard = memo(({ connector, index }: ConnectorCardProps) => {
    const colorClasses = getConnectorColorClasses(connector.color);
    const glowClasses = getConnectorGlowClasses(connector.color);
    const badgeConfig = getStatusBadgeConfig(connector.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
        >
            <Card className="bg-[#171717] border-white/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorClasses}`}>
                            <connector.icon className="h-7 w-7" />
                        </div>

                        <Badge className={`${badgeConfig.className} border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                            {badgeConfig.showDot && <div className="h-1 w-1 rounded-full bg-emerald-400" />}
                            {badgeConfig.label}
                        </Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black tracking-tight text-white uppercase">
                                {connector.name}
                            </h3>
                            <span className="text-[9px] font-bold text-muted-foreground border border-white/10 px-1.5 py-0.5 rounded uppercase">
                                {connector.type}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {connector.description}
                        </p>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <Button
                            variant="outline"
                            className={`w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${connector.status === "connected"
                                    ? "border-white/10 text-white hover:bg-white/5"
                                    : "border-primary/50 text-white hover:bg-primary/10"
                                }`}
                        >
                            {connector.status === "connected" ? "Gérer la connexion" : "Configurer"}
                        </Button>
                    </div>
                </CardContent>

                {/* Glow Effect on Hover */}
                <div
                    className={`absolute -bottom-12 -right-12 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${glowClasses}`}
                />
            </Card>
        </motion.div>
    );
});

ConnectorCard.displayName = "ConnectorCard";
