"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ShimmerProps {
    children: React.ReactNode
    className?: string
    duration?: number
}

export function Shimmer({ children, className, duration = 2 }: ShimmerProps) {
    return (
        <div className={cn("relative overflow-hidden", className)}>
            <div className="relative z-10">{children}</div>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: duration,
                    ease: "linear",
                }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
        </div>
    )
}
