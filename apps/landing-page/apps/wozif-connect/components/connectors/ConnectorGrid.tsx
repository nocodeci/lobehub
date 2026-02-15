import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Connector } from "../../types/connectors";
import { ConnectorCard } from "./ConnectorCard";

interface ConnectorGridProps {
    connectors: Connector[];
}

export const ConnectorGrid = ({ connectors }: ConnectorGridProps) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {connectors.map((connector, i) => (
                        <ConnectorCard
                            key={connector.id}
                            connector={connector}
                            index={i}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {connectors.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-4 text-center"
                >
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Layers className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        Aucun connecteur trouvé
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mt-2">
                        Nous n'avons trouvé aucun connecteur correspondant à vos critères de recherche.
                    </p>
                </motion.div>
            )}
        </>
    );
};
