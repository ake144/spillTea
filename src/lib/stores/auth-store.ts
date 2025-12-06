import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { generateAnonymousName } from '@/lib/utils';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    anonymousName: string | null;
    streak: number;
    lastPostedAt: string | null;
    badges: string[];
    signInAnonymously: () => Promise<void>;
    initializeAuth: () => void;
    updateStreak: () => Promise<void>;
    syncUserToFirestore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            anonymousName: null,
            streak: 1,
            lastPostedAt: null,
            badges: [],

            initializeAuth: () => {
                const unsubscribe = auth.onAuthStateChanged((user) => {
                    if (user) {
                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            anonymousName: get().anonymousName || generateAnonymousName(),
                        });
                        // Sync on load
                        get().syncUserToFirestore();
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                });
                return unsubscribe;
            },

            signInAnonymously: async () => {
                if (!auth) {
                    console.error("Auth not initialized");
                    alert("Firebase Auth not initialized. Check your credentials.");
                    return;
                }

                set({ isLoading: true });

                try {
                    const result = await firebaseSignInAnonymously(auth);

                    console.log("Anonymous sign-in result:", result);


                    set({
                        user: result.user,
                        isAuthenticated: true,
                        anonymousName: get().anonymousName || generateAnonymousName(),
                        isLoading: false,
                    });
                    // Sync on sign in
                    get().syncUserToFirestore();
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            updateStreak: async () => {
                const { lastPostedAt, streak, user, anonymousName } = get();
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                let newStreak = streak;
                const newBadges = [...get().badges];

                if (lastPostedAt) {
                    const lastPost = new Date(lastPostedAt);
                    const lastPostDate = new Date(lastPost.getFullYear(), lastPost.getMonth(), lastPost.getDate());

                    const diffTime = Math.abs(today.getTime() - lastPostDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        newStreak = 1;
                    }
                } else {
                    newStreak = 1;
                }

                // Check for badges
                if (newStreak === 3 && !newBadges.includes("3-day-fire")) newBadges.push("3-day-fire");
                if (newStreak === 7 && !newBadges.includes("7-day-fire")) newBadges.push("7-day-fire");

                set({
                    streak: newStreak,
                    lastPostedAt: now.toISOString(),
                    badges: newBadges
                });

                // Sync to Firestore
                if (user && db) {
                    try {
                        const userRef = doc(db, "users", user.uid);
                        await setDoc(userRef, {
                            anonymousName,
                            streak: newStreak,
                            badges: newBadges,
                            lastPostedAt: now,
                            updatedAt: Timestamp.now()
                        }, { merge: true });
                    } catch (error) {
                        console.error("Failed to sync user stats:", error);
                    }
                }
            },

            syncUserToFirestore: async () => {
                const { user, anonymousName, streak, badges } = get();
                if (!user || !db) return;

                try {
                    const userRef = doc(db, "users", user.uid);
                    await setDoc(userRef, {
                        anonymousName,
                        streak,
                        badges,
                        updatedAt: Timestamp.now()
                    }, { merge: true });
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                anonymousName: state.anonymousName,
                streak: state.streak,
                lastPostedAt: state.lastPostedAt,
                badges: state.badges
            }),
        }
    )
);
