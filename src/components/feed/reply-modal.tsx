"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import { useAuthStore, useFeedStore, useUIStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer } from "@/components/ui/drawer";
import { formatTimeAgo } from "@/lib/utils";

export function ReplyModal() {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { activeConfessionId, setActiveConfessionId, replies, fetchReplies, addReply } = useFeedStore();
    const { user, anonymousName, isAuthenticated } = useAuthStore();
    const { setShowAuthPrompt } = useUIStore();

    const isOpen = !!activeConfessionId;
    const currentReplies = activeConfessionId ? replies[activeConfessionId] || [] : [];

    useEffect(() => {
        if (activeConfessionId) {
            fetchReplies(activeConfessionId);
        }
    }, [activeConfessionId, fetchReplies]);

    const handleClose = () => {
        setActiveConfessionId(null);
        setContent("");
    };

    const handleSubmit = async () => {
        if (!content.trim() || !activeConfessionId) return;

        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        setIsSubmitting(true);

        try {
            await addReply(
                activeConfessionId,
                content.trim(),
                user?.uid || "anonymous",
                anonymousName || "Anonymous"
            );
            setContent("");
        } catch (error) {
            console.error("Failed to reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title={`Whispers (${currentReplies.length})`}
            className="h-[75vh]"
        >
            <div className="flex flex-col h-full">
                {/* Replies List */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-[200px]">
                    {currentReplies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <p>No whispers yet...</p>
                            <p className="text-sm">Be the first to reply!</p>
                        </div>
                    ) : (
                        currentReplies.map((reply) => (
                            <motion.div
                                key={reply.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 rounded-xl p-4 border border-white/5"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                                        <User className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-neon-cyan">
                                        {reply.authorName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        • {formatTimeAgo(reply.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                    {reply.content}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Whisper a reply..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[50px] max-h-[100px]"
                        />
                        <Button
                            variant="gradient"
                            size="icon"
                            className="h-auto w-12 shrink-0 rounded-xl"
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting}
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
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
