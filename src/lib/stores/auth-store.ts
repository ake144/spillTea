import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    signInAnonymously as firebaseSignInAnonymously,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { generateAnonymousName } from "@/lib/utils";

interface AuthState {
    user: User | null;
    anonymousName: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    streak: number;
    lastPostedAt: number | null; // Timestamp
    badges: string[];
    signInAnonymously: () => Promise<void>;
    initializeAuth: () => void;
    updateStreak: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            anonymousName: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            streak: 0,
            lastPostedAt: null,
            badges: [],

            initializeAuth: () => {
                if (typeof window === "undefined" || !auth) return;

                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            isInitialized: true,
                            anonymousName: get().anonymousName || generateAnonymousName(),
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            isInitialized: true,
                        });
                    }
                });
            },

            signInAnonymously: async () => {
                if (!auth) {
                    console.error("Auth not initialized");
                    alert("Firebase Auth not initialized. Check your credentials.");
                    return;
                }

                set({ isLoading: true });

                try {
                    console.log("Calling firebaseSignInAnonymously...");
                    const result = await firebaseSignInAnonymously(auth);
                    console.log("Firebase auth result:", result.user.uid);
                    set({
                        user: result.user,
                        isAuthenticated: true,
                        anonymousName: get().anonymousName || generateAnonymousName(),
                        isLoading: false,
                    });
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            updateStreak: () => {
                const now = Date.now();
                const { lastPostedAt, streak, badges } = get();

                if (!lastPostedAt) {
                    set({ streak: 1, lastPostedAt: now });
                    return;
                }

                const lastDate = new Date(lastPostedAt);
                const currentDate = new Date(now);

                // Check if same day
                if (lastDate.toDateString() === currentDate.toDateString()) {
                    return; // Already posted today
                }

                // Check if consecutive day (yesterday)
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate.toDateString() === yesterday.toDateString()) {
                    const newStreak = streak + 1;
                    const newBadges = [...badges];

                    // Award badges
                    if (newStreak === 3 && !badges.includes("3-day-fire")) newBadges.push("3-day-fire");
                    if (newStreak === 7 && !badges.includes("7-day-fire")) newBadges.push("7-day-fire");

                    set({ streak: newStreak, lastPostedAt: now, badges: newBadges });
                } else {
                    // Streak broken
                    set({ streak: 1, lastPostedAt: now });
                }
            },
        }),
        {
            name: "spilltea-auth",
            partialize: (state) => ({
                anonymousName: state.anonymousName,
                streak: state.streak,
                lastPostedAt: state.lastPostedAt,
                badges: state.badges
            }),
        }
    )
);
