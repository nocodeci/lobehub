"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LandingDashboardPreview } from "@/components/landing/dashboard-preview";

export function VisualShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [5, 0]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden bg-[#020202]">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400"
                    >
                        Interconnexion Totale
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tighter"
                    >
                        Contrôle absolu sur<br /> vos opérations.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        Visualisez chaque centime. Pilotez chaque transaction. AfricFlow transforme la complexité en clarté.
                    </motion.p>
                </div>



                {/* Main Dashboard Visual */}
                <div className="relative perspective-1000 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ rotateX }}
                        className="relative rounded-xl border border-white/10 shadow-2xl bg-[#09090B] overflow-hidden"
                    >
                        {/* Header Control Dots (Mac Style) to reinforce 'Window' look */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-[#09090B] border-b border-white/5 flex items-center px-4 z-20">
                            <div className="flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                            </div>
                            <div className="mx-auto text-[10px] text-zinc-600 font-mono">dashboard.afriflow.com</div>
                        </div>

                        {/* Live Component Preview */}
                        <div className="pt-10 h-[600px] md:h-[800px] w-full overflow-hidden">
                            <LandingDashboardPreview />
                        </div>

                        {/* No Overlay - Full Visibility */}
                    </motion.div>
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary/20 blur-[150px] -z-10 rounded-full opacity-30" />
        </section>
    );
}
