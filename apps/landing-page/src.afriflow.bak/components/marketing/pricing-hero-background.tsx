"use client";

import { motion } from "framer-motion";
import { WorldGlobe } from "@/components/ui/world-globe";

export function PricingHeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Background Gradients */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            {/* Central Orb & Map */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] flex items-center justify-center">
                {/* 1. The solid orb base (User's circular path) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-60">
                    <svg width="800" height="800" viewBox="-600 -600 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse duration-[10s]">
                        <path fill="rgb(198,198,198)" fillOpacity="1" d="M0,-587.302978515625 C324.13250732421875,-587.302978515625 587.302978515625,-324.13250732421875 587.302978515625,0 C587.302978515625,324.13250732421875 324.13250732421875,587.302978515625 0,587.302978515625 C-324.13250732421875,587.302978515625 -587.302978515625,324.13250732421875 -587.302978515625,0 C-587.302978515625,-324.13250732421875 -324.13250732421875,-587.302978515625 0,-587.302978515625z"></path>
                    </svg>
                </div>

                {/* 2. Cobe Interactive 3D Globe */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen">
                    <WorldGlobe />
                </div>

                {/* Floating Payment Methods Badges */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {[
                        { icon: "/logos/orange-money.svg", label: "Orange Money", top: "20%", left: "20%", delay: 0 },
                        { icon: "/logos/mtn-momo.svg", label: "MTN Shop", top: "25%", left: "75%", delay: 1.5 },
                        { icon: "/logos/wave.svg", label: "Wave", top: "70%", left: "15%", delay: 0.5 },
                        { icon: "/logos/moov-money.svg", label: "Moov", top: "65%", left: "80%", delay: 2 },
                        { icon: "/logos/m-pesa.svg", label: "M-Pesa", top: "10%", left: "50%", delay: 1 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                delay: item.delay,
                                y: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatDelay: 0
                                }
                            }}
                            className="absolute flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 pr-3 p-1.5 rounded-full shadow-2xl"
                            style={{ top: item.top, left: item.left }}
                        >
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center p-1">
                                <img src={item.icon} alt={item.label} className="h-full w-full object-contain" />
                            </div>
                            <span className="text-xs font-bold text-white/90 hidden md:inline-block">{item.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* 3. Shine/Glow Effect */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#020202]/80 z-10" />
            </div>
        </div>
    );
}
