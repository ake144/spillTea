"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
    id: string;
    anonymousName: string;
    streak: number;
    karma: number;
}

export function Leaderboard() {
    const [activeTab, setActiveTab] = useState<"streak" | "karma">("streak");
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!db) return;
            setIsLoading(true);
            try {
                const q = query(
                    collection(db, "users"),
                    orderBy(activeTab, "desc"),
                    limit(10)
                );

                const snapshot = await getDocs(q);
                const leaderboardUsers = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as LeaderboardUser[];

                setUsers(leaderboardUsers);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [activeTab]);

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl">
                <button
                    onClick={() => setActiveTab("streak")}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === "streak" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <Flame className="w-4 h-4 text-orange-500" />
                    Top Streaks
                </button>
                <button
                    onClick={() => setActiveTab("karma")}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === "karma" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Top Karma
                </button>
            </div>

            {/* List */}
            <div className="space-y-2 min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No data yet. Be the first!
                    </div>
                ) : (
                    users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                        >
                            <div className="w-8 flex justify-center font-bold text-lg text-muted-foreground">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                            </div>

                            <div className="flex-1">
                                <p className="font-bold text-white">{user.anonymousName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {activeTab === "streak" ? `${user.streak} day streak` : `${user.karma || 0} karma`}
                                </p>
                            </div>

                            <div className="text-xl">
                                {activeTab === "streak" ? "🔥" : "✨"}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
