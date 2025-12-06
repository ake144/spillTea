"use client";

import { useEffect } from "react";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { ReplyModal } from "@/components/feed/reply-modal";
import { ShareModal } from "@/components/feed/share-modal";
import { ConfessionForm } from "@/components/create";
import { Navigation } from "@/components/shared/navigation";
import { AuthPrompt } from "@/components/shared/auth-prompt";
import { ProfileDrawer } from "@/components/shared/profile-drawer";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { useAuthStore, useUIStore } from "@/lib/stores";

export default function Home() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const { isProfileOpen, closeProfile } = useUIStore();

    // Initialize auth listener on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

            {/* Sidebar */}
            <AppSidebar />

            {/* Navigation */}
            <Navigation />

            {/* Main feed */}
            <InfiniteFeed />

            {/* Modals */}
            <ConfessionForm />
            <ReplyModal />
            <ShareModal />
            <ProfileDrawer isOpen={isProfileOpen} onClose={closeProfile} />
            <AuthPrompt />
        </div>
    );
}
