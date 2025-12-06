"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { motion } from "framer-motion";
import { Download, Share2, Loader2 } from "lucide-react";
import { useFeedStore, useUIStore } from "@/lib/stores";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShareModal() {
    const { isShareModalOpen, closeShareModal, shareConfessionId } = useUIStore();
    const { confessions } = useFeedStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const confession = confessions.find((c) => c.id === shareConfessionId);

    if (!confession) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2, // High res
                backgroundColor: "#000", // Ensure black background
            });
            download(dataUrl, `spilltea-${confession.id}.png`);
        } catch (error) {
            console.error("Failed to generate image:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Drawer
            isOpen={isShareModalOpen}
            onClose={closeShareModal}
            title="Share the Tea"
            className="h-[85vh]"
        >
            <div className="flex flex-col items-center gap-6 h-full">
                <p className="text-sm text-muted-foreground text-center">
                    Preview your story card. Perfect for Instagram & TikTok.
                </p>

                {/* Card Preview Area */}
                <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {/* The actual element to capture */}
                    <div
                        ref={cardRef}
                        className={cn(
                            "w-full h-full p-8 flex flex-col justify-between relative",
                            confession.gradient
                        )}
                    >
                        {/* Background overlay for readability */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-3xl">🫖</span>
                                <span className="text-xl font-bold text-white tracking-wider">SpillTea</span>
                            </div>

                            {/* Confession Text */}
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-2xl font-bold text-white leading-relaxed text-center drop-shadow-lg">
                                    &quot;{confession.content}&quot;
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-white">{confession.authorName}</p>
                                    <p className="text-xs text-white/70">Spilled anonymously</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-white/70">Get the app</p>
                                    <p className="text-sm font-bold text-white">spilltea.app</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full max-w-sm space-y-3 mt-auto pb-4">
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full gap-2"
                        onClick={handleDownload}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                        {isGenerating ? "Generating..." : "Save Image"}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={closeShareModal}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
