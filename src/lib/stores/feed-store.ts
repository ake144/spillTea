import { create } from "zustand";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    increment,
    Timestamp,
    startAfter,
    QueryDocumentSnapshot,
    DocumentData,
    setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface Confession {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    reactions: Record<string, number>;
    reactionCount: number;
    replyCount: number;
    isBurnMode?: boolean;
    gradient: string;
    viewCount: number;
}

export interface Reply {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    likes: number;
}

interface FeedState {
    confessions: Confession[];
    activeConfessionId: string | null; // For reply modal
    replies: Record<string, Reply[]>; // Map confessionId -> replies
    sortBy: "new" | "hot";
    isLoading: boolean;
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    error: string | null;

    // Actions
    fetchConfessions: (sortBy?: "new" | "hot") => Promise<void>;
    fetchMoreConfessions: () => Promise<void>;
    addConfession: (content: string, authorId: string, authorName: string, isBurn?: boolean) => Promise<void>;
    addReaction: (confessionId: string, emoji: string) => Promise<void>;
    subscribeToConfessions: () => () => void;

    // Reply Actions
    setActiveConfessionId: (id: string | null) => void;
    fetchReplies: (confessionId: string) => Promise<void>;
    addReply: (confessionId: string, content: string, authorId: string, authorName: string) => Promise<void>;
}

const CONFESSIONS_PER_PAGE = 10;

export const useFeedStore = create<FeedState>()((set, get) => ({
    confessions: [],
    activeConfessionId: null,
    replies: {},
    sortBy: "new",
    isLoading: false,
    hasMore: true,
    lastDoc: null,
    error: null,

    setActiveConfessionId: (id) => set({ activeConfessionId: id }),

    fetchReplies: async (confessionId) => {
        if (!db) return;

        try {
            const q = query(
                collection(db, "confessions", confessionId, "replies"),
                orderBy("createdAt", "asc")
            );

            const snapshot = await getDocs(q);
            const replies = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Reply[];

            set((state) => ({
                replies: {
                    ...state.replies,
                    [confessionId]: replies
                }
            }));
        } catch (error) {
            console.error("Error fetching replies:", error);
        }
    },

    addReply: async (confessionId, content, authorId, authorName) => {
        if (!db) return;

        const newReply = {
            content,
            authorId,
            authorName,
            createdAt: Timestamp.now(),
            likes: 0,
        };

        try {
            // Add reply to subcollection
            await addDoc(collection(db, "confessions", confessionId, "replies"), newReply);

            // Update reply count on parent confession
            const confessionRef = doc(db, "confessions", confessionId);
            await updateDoc(confessionRef, {
                replyCount: increment(1)
            });

            // Refresh replies
            get().fetchReplies(confessionId);

            // Optimistically update reply count in feed
            set((state) => ({
                confessions: state.confessions.map((c) => {
                    if (c.id === confessionId) {
                        return { ...c, replyCount: (c.replyCount || 0) + 1 };
                    }
                    return c;
                })
            }));
        } catch (error) {
            console.error("Error adding reply:", error);
            throw error;
        }
    },

    fetchConfessions: async (sortBy = "new") => {
        if (!db) return;

        set({ isLoading: true, error: null, sortBy, confessions: [], lastDoc: null, hasMore: true });

        try {
            let q;
            if (sortBy === "hot") {
                q = query(
                    collection(db, "confessions"),
                    orderBy("viewCount", "desc"),
                    limit(CONFESSIONS_PER_PAGE)
                );
            } else {
                q = query(
                    collection(db, "confessions"),
                    orderBy("createdAt", "desc"),
                    limit(CONFESSIONS_PER_PAGE)
                );
            }

            const snapshot = await getDocs(q);
            const confessions: Confession[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Confession[];

            set({
                confessions,
                isLoading: false,
                hasMore: snapshot.docs.length === CONFESSIONS_PER_PAGE,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
            });
        } catch (error) {
            console.error("Error fetching confessions:", error);
            set({ isLoading: false, error: "Failed to load confessions" });
        }
    },

    fetchMoreConfessions: async () => {
        const { lastDoc, hasMore, isLoading, sortBy } = get();
        if (!db || !hasMore || isLoading || !lastDoc) return;

        set({ isLoading: true });

        try {
            let q;
            if (sortBy === "hot") {
                q = query(
                    collection(db, "confessions"),
                    orderBy("viewCount", "desc"),
                    startAfter(lastDoc),
                    limit(CONFESSIONS_PER_PAGE)
                );
            } else {
                q = query(
                    collection(db, "confessions"),
                    orderBy("createdAt", "desc"),
                    startAfter(lastDoc),
                    limit(CONFESSIONS_PER_PAGE)
                );
            }

            const snapshot = await getDocs(q);
            const newConfessions: Confession[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Confession[];

            set((state) => ({
                confessions: [...state.confessions, ...newConfessions],
                isLoading: false,
                hasMore: snapshot.docs.length === CONFESSIONS_PER_PAGE,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
            }));
        } catch (error) {
            console.error("Error fetching more confessions:", error);
            set({ isLoading: false });
        }
    },

    addConfession: async (content, authorId, authorName, isBurn = false) => {
        if (!db) return;

        const newConfession = {
            content,
            authorId,
            authorName,
            createdAt: Timestamp.now(),
            reactions: {},
            reactionCount: 0,
            replyCount: 0,
            isBurnMode: isBurn,
            viewCount: 0,
            gradient: "from-neon-purple to-neon-pink", // Default, should be random
        };

        try {
            await addDoc(collection(db, "confessions"), newConfession);
            get().fetchConfessions();
        } catch (error) {
            console.error("Error adding confession:", error);
            throw error;
        }
    },

    addReaction: async (confessionId, emoji) => {
        if (!db) return;

        try {
            // Update reaction count on confession
            const confessionRef = doc(db, "confessions", confessionId);
            await updateDoc(confessionRef, {
                [`reactions.${emoji}`]: increment(1),
                reactionCount: increment(1)
            });

            // Increment karma for the author
            const confession = get().confessions.find(c => c.id === confessionId);
            if (confession?.authorId) {
                const authorRef = doc(db, "users", confession.authorId);
                await setDoc(authorRef, {
                    karma: increment(1),
                    updatedAt: Timestamp.now()
                }, { merge: true });
            }

            // Optimistically update UI
            set((state) => ({
                confessions: state.confessions.map((c) => {
                    if (c.id === confessionId) {
                        return {
                            ...c,
                            reactions: {
                                ...c.reactions,
                                [emoji]: (c.reactions[emoji] || 0) + 1
                            },
                            reactionCount: (c.reactionCount || 0) + 1
                        };
                    }
                    return c;
                })
            }));
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    },

    subscribeToConfessions: () => {
        // Placeholder for real-time subscription if needed
        // Currently using fetch-based approach for simplicity with infinite scroll
        return () => { };
    }
}));
