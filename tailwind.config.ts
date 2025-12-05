import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                neon: {
                    cyan: "#00f0ff",
                    pink: "#ff00aa",
                    purple: "#a855f7",
                    green: "#00ff88",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "slide-up": "slide-up 0.3s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "bounce-in": "bounce-in 0.5s ease-out",
            },
            keyframes: {
                "glow-pulse": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)" },
                    "50%": { boxShadow: "0 0 40px rgba(0, 240, 255, 0.8)" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "bounce-in": {
                    "0%": { transform: "scale(0)", opacity: "0" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "neon-glow": "linear-gradient(135deg, #00f0ff 0%, #ff00aa 50%, #a855f7 100%)",
            },
        },
    },
    plugins: [],
};

export default config;
