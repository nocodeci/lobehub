import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#6366f1", // Indigo 500
                    dark: "#4f46e5",    // Indigo 600
                    light: "#818cf8",   // Indigo 400
                },
                secondary: {
                    DEFAULT: "#10b981", // Emerald 500
                },
                accent: {
                    DEFAULT: "#f59e0b", // Amber 500
                },
                slate: {
                    850: "#1e293b", // Custom dark surface
                    950: "#020617", // Custom dark background
                }
            },
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
