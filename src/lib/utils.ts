import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Generate random gradient class for confession cards
export function getRandomGradient(): string {
    const gradients = [
        "confession-gradient-1",
        "confession-gradient-2",
        "confession-gradient-3",
        "confession-gradient-4",
        "confession-gradient-5",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Format relative time (e.g., "2h ago")
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
}

// Generate anonymous username
export function generateAnonymousName(): string {
    const adjectives = [
        "Shadow", "Midnight", "Ghost", "Dark", "Silent",
        "Neon", "Cyber", "Void", "Mystic", "Phantom"
    ];
    const nouns = [
        "Whisper", "Spirit", "Echo", "Flame", "Storm",
        "Raven", "Wolf", "Fox", "Star", "Moon"
    ];
    const number = Math.floor(Math.random() * 999) + 1;

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj}${noun}${number}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

// Calculate trending score
export function calculateTrendingScore(reactions: number, views: number, createdAt: Date): number {
    const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    const gravity = 1.8;
    // Score = (Reactions + Views * 0.1) / (Time + 2)^Gravity
    return (reactions + (views * 0.1)) / Math.pow(hoursOld + 2, gravity);
}
