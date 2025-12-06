"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { useFeedStore, useUIStore } from "@/lib/stores";
import { ConfessionCard } from "./confession-card";
import { DailyPrompt } from "./daily-prompt";
import { Button } from "@/components/ui/button";

export function InfiniteFeed() {
    const {
        confessions,
        isLoading,
        hasMore,
        error,
        fetchConfessions,
        fetchMoreConfessions,
        subscribeToConfessions,
        sortBy
    } = useFeedStore();

    const setCurrentConfessionIndex = useUIStore((state) => state.setCurrentConfessionIndex);
    const feedRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initial fetch and real-time subscription
    useEffect(() => {
        fetchConfessions(sortBy);
        const unsubscribe = subscribeToConfessions();
        return () => unsubscribe();
    }, [fetchConfessions, subscribeToConfessions, sortBy]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    fetchMoreConfessions();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, fetchMoreConfessions]);

    // Track current confession index
    useEffect(() => {
        const feed = feedRef.current;
        if (!feed) return;

        const handleScroll = () => {
            const scrollTop = feed.scrollTop;
            const cardHeight = window.innerHeight;
            const currentIndex = Math.round(scrollTop / cardHeight);
            setCurrentConfessionIndex(currentIndex);

            // Save to history
            const currentConfession = confessions[currentIndex];
            if (currentConfession) {
                const historyItem = {
                    id: currentConfession.id,
                    content: currentConfession.content,
                    createdAt: currentConfession.createdAt
                };

                const existingHistory = localStorage.getItem("spilltea_history");
                let history = existingHistory ? JSON.parse(existingHistory) : [];

                // Remove if exists (to move to top)
                // Remove if exists (to move to top)
                history = history.filter((h: { id: string }) => h.id !== currentConfession.id);
                // Add to top
                history.unshift(historyItem);
                // Keep last 20
                history = history.slice(0, 20);

                localStorage.setItem("spilltea_history", JSON.stringify(history));
            }
        };

        feed.addEventListener("scroll", handleScroll);
        return () => feed.removeEventListener("scroll", handleScroll);
    }, [setCurrentConfessionIndex, confessions]);

    // Error state
    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-muted-foreground text-center">{error}</p>
                <Button
                    variant="neon"
                    onClick={() => fetchConfessions(sortBy)}
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    // Empty state
    if (!isLoading && confessions.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
                <DailyPrompt />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                >
                    🤫
                </motion.div>
                <h2 className="text-2xl font-bold gradient-text">No confessions yet</h2>
                <p className="text-muted-foreground max-w-xs">
                    Be the first to spill the tea! Tap the + button to share your secret.
                </p>
            </div>
        );
    }

    return (
        <div
            ref={feedRef}
            className="snap-feed hide-scrollbar h-screen overflow-y-scroll snap-y snap-mandatory"
        >
            <div className="pt-20 pb-24 px-4 max-w-lg mx-auto min-h-screen">
                <DailyPrompt />

                <AnimatePresence mode="popLayout">
                    {confessions.map((confession, index) => (
                        <div
                            key={confession.id}
                            className="snap-start h-screen flex items-center justify-center py-4"
                        >
                            <ConfessionCard confession={confession} index={index} />
                        </div>
                    ))}
                </AnimatePresence>

                {/* Loading indicator / Sentinel */}
                <div ref={observerTarget} className="h-20 flex items-center justify-center w-full">
                    {isLoading && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="w-8 h-8 text-primary" />
                        </motion.div>
                    )}
                    {!hasMore && confessions.length > 0 && (
                        <p className="text-muted-foreground text-sm">
                            You&apos;ve seen all the tea ☕
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
