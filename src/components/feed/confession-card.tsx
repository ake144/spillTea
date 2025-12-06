"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Eye, Clock, Share2 } from "lucide-react";
import { Confession, useFeedStore, useUIStore } from "@/lib/stores";
import { ReactionBar } from "./reaction-bar";
import { cn, formatTimeAgo } from "@/lib/utils";

interface ConfessionCardProps {
    confession: Confession;
    index: number;
}

export function ConfessionCard({ confession, index }: ConfessionCardProps) {
    const totalReactions = Object.values(confession.reactions).reduce((a, b) => a + b, 0);

    return (
        <div className="snap-item flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                    "relative w-full max-w-lg h-[80vh] md:h-[70vh] rounded-3xl overflow-hidden",
                    "glass-card animated-border",
                    confession.gradient
                )}
            >
                {/* Burn indicator */}
                {confession.isBurnAfterReading && (
                    <div className="absolute top-4 right-4 z-10">
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex items-center gap-1 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/50"
                        >
                            <Flame className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-300">
                                {confession.burnViewLimit ? `${confession.burnViewLimit - confession.viewCount} views left` : "Burning"}
                            </span>
                        </motion.div>
                    </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center">
                                <span className="text-lg">🤫</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground/80">
                                    {confession.authorName}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(confession.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main confession text */}
                    <div className="flex-1 flex items-center justify-center py-6">
                        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-center leading-relaxed text-foreground/95">
                            {confession.content}
                        </p>
                    </div>

                    {/* Footer with reactions */}
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{confession.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>💬</span>
                                <span>{totalReactions}</span>
                            </div>
                        </div>

                        {/* Reactions */}
                        <ReactionBar
                            confessionId={confession.id}
                            reactions={confession.reactions}
                        />

                        {/* Actions */}
                        <div className="flex gap-3">
                            {/* Reply Button */}
                            <button
                                onClick={() => useFeedStore.getState().setActiveConfessionId(confession.id)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground/80"
                            >
                                <span>💬</span>
                                <span>
                                    {confession.replyCount ?
                                        `${confession.replyCount}` :
                                        "Reply"
                                    }
                                </span>
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={() => useUIStore.getState().openShareModal(confession.id)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground/80"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
