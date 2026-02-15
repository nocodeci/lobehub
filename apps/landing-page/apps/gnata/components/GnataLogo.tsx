import React from "react";

export const GnataLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* A G made of a perfect circle and a square block, using purple #A855F7 as requested */}
            <path
                d="M115 75 L 75 75 L 75 115 A 40 40 0 1 1 115 75 Z"
                fill="none"
                stroke="#A855F7"
                strokeWidth="14"
            />
            <path
                d="M115 75 L 115 110"
                stroke="#A855F7"
                strokeWidth="14"
                strokeLinecap="butt"
            />
            <circle cx="75" cy="75" r="7" fill="#A855F7" />
        </svg>
    );
};
