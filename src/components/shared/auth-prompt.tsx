"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function AuthPrompt() {
    const { showAuthPrompt, setShowAuthPrompt } = useUIStore();
    const { signInAnonymously, isLoading, anonymousName } = useAuthStore();

    const handleSignIn = async () => {
        try {
            await signInAnonymously();
            setShowAuthPrompt(false);
        } catch (error) {
            console.error("Auth failed:", error);
        }
    };

    return (
        <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
            <DialogContent className="sm:max-w-sm text-center">
                <DialogHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center mb-4"
                    >
                        <span className="text-3xl">🤫</span>
                    </motion.div>
                    <DialogTitle className="text-xl">Join the Tea Party</DialogTitle>
                    <DialogDescription className="text-base">
                        Create an anonymous identity to react and post. No email, no phone — just vibes.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {anonymousName && (
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">Your identity</p>
                            <p className="text-lg font-bold gradient-text">{anonymousName}</p>
                        </div>
                    )}

                    <Button
                        variant="gradient"
                        size="xl"
                        className="w-full gap-2"
                        onClick={handleSignIn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        {isLoading ? "Creating identity..." : "Join Anonymously"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        By joining, you agree to keep things respectful.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
