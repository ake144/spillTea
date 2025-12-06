"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useUIStore } from "@/lib/stores";

const PROMPTS = [
    "What's a secret you've never told your parents?",
    "What's the pettiest thing you've ever done?",
    "Who is your secret crush right now?",
    "What's a lie you tell everyone?",
    "What's your most embarrassing moment from high school?",
    "What's the worst date you've ever been on?",
    "What's a rumor you started that turned out to be true?",
    "What's your biggest regret from last year?",
    "What's something illegal you've done but never got caught?",
    "What's the weirdest dream you've ever had?",
];

export function DailyPrompt() {
    const [isVisible, setIsVisible] = useState(true);
    const [prompt, setPrompt] = useState("");
    const { openCreateModal } = useUIStore();

    useEffect(() => {
        // Seeded random based on date to ensure same prompt for everyone on same day
        const today = new Date();
        const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
        const index = seed % PROMPTS.length;
        setPrompt(PROMPTS[index]);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-white/10 p-1"
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

            <div className="relative p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-neon-pink">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Tea</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-muted-foreground hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">
                    {prompt}
                </h3>

                <button
                    onClick={openCreateModal}
                    className="self-start text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
                >
                    Spill It →
                </button>
            </div>
        </motion.div>
    );
}
