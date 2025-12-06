"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Send, Sparkles } from "lucide-react";
import { useAuthStore, useFeedStore, useUIStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Drawer } from "@/components/ui/drawer";

export function ConfessionForm() {
    const [content, setContent] = useState("");
    const [isBurnMode, setIsBurnMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isCreateModalOpen, closeCreateModal, setShowAuthPrompt } = useUIStore();
    const { user, anonymousName, isAuthenticated, signInAnonymously, isLoading: authLoading } = useAuthStore();
    const addConfession = useFeedStore((state) => state.addConfession);

    const submitConfession = async (uid: string, name: string) => {
        setIsSubmitting(true);

        try {
            await addConfession(
                content.trim(),
                uid,
                name,
                isBurnMode
            );

            // Update streak
            useAuthStore.getState().updateStreak();

            setContent("");
            setIsBurnMode(false);
            closeCreateModal();
        } catch (error) {
            console.error("Failed to post confession:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        if (user && anonymousName) {
            await submitConfession(user.uid, anonymousName);
        }
    };

    const handleAuthAndSubmit = async () => {
        try {
            await signInAnonymously();

            // Get fresh state directly from store
            const { user: freshUser, anonymousName: freshName } = useAuthStore.getState();

            if (freshUser && freshName) {
                await submitConfession(freshUser.uid, freshName);
            }
        } catch (error) {
            console.error("Auth failed:", error);
            alert("Authentication failed. Check console for details.");
        }
    };

    const charLimit = 500;
    const charCount = content.length;
    const isOverLimit = charCount > charLimit;

    return (
        <Drawer
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            title="Spill the Tea"
        >
            <div className="space-y-6">
                <p className="text-muted-foreground">
                    Share your secret anonymously. No judgment, just vibes.
                </p>

                {/* Text input */}
                <div className="relative">
                    <Textarea
                        placeholder="What's on your mind? Spill it..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[150px] text-base bg-white/5 border-white/10 focus:border-primary/50"
                        disabled={isSubmitting}
                    />
                    <div className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {charCount}/{charLimit}
                    </div>
                </div>

                {/* Burn mode toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-500/20">
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Burn After Reading</p>
                            <p className="text-xs text-muted-foreground">
                                Disappears after 100 views
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={isBurnMode}
                        onCheckedChange={setIsBurnMode}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Anonymous name display */}
                {anonymousName && (
                    <p className="text-xs text-muted-foreground text-center">
                        Posting as <span className="text-primary font-medium">{anonymousName}</span>
                    </p>
                )}

                {/* Submit button */}
                {isAuthenticated ? (
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full gap-2 text-lg h-14"
                        onClick={handleSubmit}
                        disabled={!content.trim() || isOverLimit || isSubmitting}
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        {isSubmitting ? "Posting..." : "Spill It"}
                    </Button>
                ) : (
                    <Button
                        variant="neon"
                        size="lg"
                        className="w-full gap-2 text-lg h-14"
                        onClick={handleAuthAndSubmit}
                        disabled={!content.trim() || isOverLimit || authLoading}
                    >
                        {authLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        {authLoading ? "Connecting..." : "Sign In & Post Anonymously"}
                    </Button>
                )}
            </div>
        </Drawer>
    );
}
