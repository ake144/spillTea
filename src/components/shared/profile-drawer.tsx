"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Calendar, User } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
    const { anonymousName, streak, badges, isAuthenticated } = useAuthStore();

    const allBadges = [
        { id: "3-day-fire", icon: "🔥", label: "3 Day Streak", description: "Posted 3 days in a row" },
        { id: "7-day-fire", icon: "😈", label: "Week Warrior", description: "Posted 7 days in a row" },
        { id: "top-spiller", icon: "👑", label: "Tea Master", description: "Top 1% contributor" },
    ];

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Your Identity"
            className="h-[60vh]"
        >
            {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <p className="text-muted-foreground mb-4">
                        Join the tea party to track your streaks and earn badges.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Identity Card */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center shadow-lg shadow-neon-cyan/20">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Posting as</p>
                            <h3 className="text-xl font-bold gradient-text">{anonymousName}</h3>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
                            <div className="p-2 rounded-full bg-orange-500/20">
                                <Flame className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{streak}</p>
                                <p className="text-xs text-muted-foreground">Day Streak</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
                            <div className="p-2 rounded-full bg-purple-500/20">
                                <Trophy className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{badges.length}</p>
                                <p className="text-xs text-muted-foreground">Badges Earned</p>
                            </div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Achievements
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            {allBadges.map((badge) => {
                                const isUnlocked = badges.includes(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-xl border transition-all",
                                            isUnlocked
                                                ? "bg-white/10 border-neon-cyan/30 shadow-lg shadow-neon-cyan/10"
                                                : "bg-white/5 border-white/5 opacity-50 grayscale"
                                        )}
                                    >
                                        <div className="text-2xl">{badge.icon}</div>
                                        <div>
                                            <p className={cn("font-medium", isUnlocked ? "text-white" : "text-muted-foreground")}>
                                                {badge.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {badge.description}
                                            </p>
                                        </div>
                                        {isUnlocked && (
                                            <div className="ml-auto text-xs font-bold text-neon-cyan px-2 py-1 rounded-full bg-neon-cyan/10">
                                                UNLOCKED
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
