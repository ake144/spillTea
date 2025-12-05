"use client";

import { useEffect } from "react";
import { InfiniteFeed, ReplyModal } from "@/components/feed";
import { ConfessionForm } from "@/components/create";
import { Navigation, AuthPrompt, ProfileDrawer } from "@/components/shared";
import { useAuthStore, useUIStore } from "@/lib/stores";

export default function Home() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const { isProfileOpen, closeProfile } = useUIStore();

    // Initialize auth listener on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="relative min-h-screen bg-background">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

            {/* Navigation */}
            <Navigation />

            {/* Main feed */}
            <InfiniteFeed />

            {/* Modals */}
            <ConfessionForm />
            <ReplyModal />
            <ProfileDrawer isOpen={isProfileOpen} onClose={closeProfile} />
            <AuthPrompt />
        </div>
    );
}
