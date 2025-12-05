"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Flame, TrendingUp, User } from "lucide-react";
import { useUIStore, useAuthStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/lib/stores";

export function Navigation() {
    const { openCreateModal } = useUIStore();
    const { isAuthenticated, anonymousName } = useAuthStore();
    const { fetchConfessions, sortBy } = useFeedStore();

    return (
        <>
            {/* Top header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-4">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-2xl">🫖</span>
                        <span className="text-xl font-bold gradient-text">SpillTea</span>
                    </motion.div>

                    {/* User status */}
                    {isAuthenticated && anonymousName && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => useUIStore.getState().openProfile()}
                            className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-card/80 transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {anonymousName}
                            </span>
                        </motion.button>
                    )}
                </div>
            </header>

            {/* Bottom navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8">
                <div className="max-w-lg mx-auto">
                    <div className="glass-card rounded-2xl p-2 flex items-center justify-around">
                        {/* Hot/Trending */}
                        <NavButton
                            icon={<Flame />}
                            label="Hot"
                            active={sortBy === "hot"}
                            onClick={() => fetchConfessions("hot")}
                        />

                        {/* Create button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="gradient"
                                size="icon"
                                className="w-14 h-14 rounded-full shadow-lg shadow-primary/25"
                                onClick={openCreateModal}
                            >
                                <Plus className="w-6 h-6" />
                            </Button>
                        </motion.div>

                        {/* New/Rising */}
                        <NavButton
                            icon={<TrendingUp />}
                            label="New"
                            active={sortBy === "new"}
                            onClick={() => fetchConfessions("new")}
                        />
                    </div>
                </div>
            </nav>
        </>
    );
}

function NavButton({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <span className="w-6 h-6">{icon}</span>
            <span className="text-xs">{label}</span>
        </button>
    );
}
