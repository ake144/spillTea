"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MessageSquare, Clock } from "lucide-react";

interface SidebarItem {
    id: string;
    content: string;
    createdAt: Date;
}

export function AppSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mySpills, setMySpills] = useState<SidebarItem[]>([]);
    const [recentSpills, setRecentSpills] = useState<SidebarItem[]>([]);
    const { user } = useAuthStore();

    // Handle responsiveness
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile); // Default open on desktop, closed on mobile
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch My Spills
    useEffect(() => {
        const fetchMySpills = async () => {
            if (!user || !db) return;
            try {
                const q = query(
                    collection(db, "confessions"),
                    where("authorId", "==", user.uid),
                    orderBy("createdAt", "desc"),
                    limit(10)
                );
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    content: doc.data().content,
                    createdAt: doc.data().createdAt?.toDate()
                }));
                setMySpills(items);
            } catch (error) {
                console.error("Error fetching my spills:", error);
            }
        };

        fetchMySpills();
    }, [user]);

    // Load Recently Viewed
    useEffect(() => {
        const stored = localStorage.getItem("spilltea_history");
        if (stored) {
            try {
                setRecentSpills(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const handleView = (id: string) => {
        // Logic to view the confession, e.g., navigate or open modal
        console.log("View confession:", id);
    }   

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={cn(
                    "fixed cursor-pointer top-4 z-50 p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 shadow-lg",
                    isOpen ? "left-[260px]" : "left-4"
                )}
            >
                {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            <motion.div
                initial={false}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-screen w-64 bg-black/80 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col pt-20 pb-6 shadow-2xl"
            >
                <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    {/* My Spills Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 px-2">
                            <MessageSquare className="w-3 h-3" />
                            My Spills
                        </h3>
                        {user ? (
                            <div className="space-y-1">
                                {mySpills.length > 0 ? (
                                    mySpills.map((item: SidebarItem) => (
                                        <button
                                            key={item.id}
                                            className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                        >
                                            <p className="text-sm text-white/80 truncate group-hover:text-white font-medium">
                                                {item.content}
                                            </p>
                                            <p className="text-[10px] text-white/30 mt-1 group-hover:text-white/50">
                                                {item.createdAt?.toLocaleDateString()}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-white/30 italic px-2">
                                        You haven&apos;t spilled any tea yet.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-white/30 px-2">
                                Sign in to see your history.
                            </p>
                        )}
                    </div>

                    {/* History Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 px-2">
                            <Clock className="w-3 h-3" />
                            Recently Viewed
                        </h3>
                        <div className="space-y-1">
                            {recentSpills.length > 0 ? (
                                recentSpills.map((item: SidebarItem) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleView(item.id)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                    >
                                        <p className="text-sm text-white/80 truncate group-hover:text-white font-medium">
                                            {item.content}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-white/30 italic px-2">
                                    No history yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-center text-white/20 font-medium tracking-widest uppercase">
                        SpillTea v0.1.0
                    </p>
                </div>
            </motion.div>

        </>
    );
}
