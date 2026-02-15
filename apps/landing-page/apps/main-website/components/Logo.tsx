import React from "react";

interface LogoProps {
    className?: string;
    width?: number | string;
    height?: number | string;
    variant?: "full" | "icon";
    theme?: "light" | "dark";
}

export default function Logo({
    className = "",
    width,
    height = 40,
    variant = "full",
    theme = "light"
}: LogoProps) {
    const finalWidth = width || (variant === "icon" ? height : "auto");
    const textColor = theme === "light" ? "#0F172A" : "#FFFFFF";
    const rightPartColor = theme === "light" ? "#0F172A" : "#FFFFFF";

    if (variant === "icon") {
        return (
            <svg
                width={finalWidth}
                height={height}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <path d="M15 35 L35 75 L60 25" stroke="#10B981" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 75 L75 25" stroke={rightPartColor} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M35 75 L50 45" stroke="#10B981" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 320 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="mainGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>

            {/* Partie Gauche du W (Verte) */}
            <path d="M10 30 L35 70 L60 25" stroke="url(#mainGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            {/* Partie Droite du W (Thème dynamique) */}
            <path d="M55 70 L85 15" stroke={rightPartColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            {/* Connecteur visuel */}
            <path d="M35 70 L55 70" stroke="url(#mainGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

            {/* Le Texte */}
            <text x="105" y="65" fontFamily="sans-serif" fontWeight="bold" fontSize="60" fill={textColor} letterSpacing="-1">wozif</text>
        </svg>
    );
}
