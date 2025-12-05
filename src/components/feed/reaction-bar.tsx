"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REACTION_EMOJIS, useFeedStore, useAuthStore, useUIStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

interface ReactionBarProps {
    confessionId: string;
    reactions: Record<string, number>;
}

export function ReactionBar({ confessionId, reactions }: ReactionBarProps) {
    const [showAll, setShowAll] = useState(false);
    const [recentReaction, setRecentReaction] = useState<string | null>(null);
    const addReaction = useFeedStore((state) => state.addReaction);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setShowAuthPrompt = useUIStore((state) => state.setShowAuthPrompt);

    const displayEmojis = showAll ? REACTION_EMOJIS : REACTION_EMOJIS.slice(0, 8);

    // Get top reactions with counts
    const topReactions = Object.entries(reactions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const handleReaction = (emoji: string) => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        setRecentReaction(emoji);
        addReaction(confessionId, emoji);

        setTimeout(() => setRecentReaction(null), 500);
    };

    return (
        <div className="w-full">
            {/* Top reactions display */}
            {topReactions.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {topReactions.map(([emoji, count]) => (
                        <motion.div
                            key={emoji}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1"
                        >
                            <span className="text-lg">{emoji}</span>
                            <span className="text-xs text-muted-foreground">{count}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Emoji picker */}
            <div className="relative">
                <div
                    className={cn(
                        "flex flex-wrap gap-1 transition-all duration-300",
                        showAll ? "max-h-32" : "max-h-10 overflow-hidden"
                    )}
                >
                    <AnimatePresence>
                        {displayEmojis.map((emoji, index) => (
                            <motion.button
                                key={emoji + index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: index * 0.02 }}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => handleReaction(emoji)}
                                className={cn(
                                    "text-2xl p-1 rounded-lg hover:bg-white/10 transition-colors",
                                    recentReaction === emoji && "reaction-burst bg-white/20"
                                )}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand button */}
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                    {showAll ? "Show less" : `+ ${REACTION_EMOJIS.length - 8} more`}
                </button>
            </div>
        </div>
    );
}
