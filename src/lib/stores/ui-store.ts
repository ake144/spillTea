import { create } from "zustand";

interface UIState {
    isCreateModalOpen: boolean;
    isProfileOpen: boolean;
    isShareModalOpen: boolean;
    shareConfessionId: string | null;
    currentConfessionIndex: number;
    showAuthPrompt: boolean;

    // Actions
    openCreateModal: () => void;
    closeCreateModal: () => void;
    openProfile: () => void;
    closeProfile: () => void;
    openShareModal: (confessionId: string) => void;
    closeShareModal: () => void;
    setCurrentConfessionIndex: (index: number) => void;
    setShowAuthPrompt: (show: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
    isCreateModalOpen: false,
    isProfileOpen: false,
    isShareModalOpen: false,
    shareConfessionId: null,
    currentConfessionIndex: 0,
    showAuthPrompt: false,

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    openProfile: () => set({ isProfileOpen: true }),
    closeProfile: () => set({ isProfileOpen: false }),
    openShareModal: (confessionId) => set({ isShareModalOpen: true, shareConfessionId: confessionId }),
    closeShareModal: () => set({ isShareModalOpen: false, shareConfessionId: null }),
    setCurrentConfessionIndex: (index) => set({ currentConfessionIndex: index }),
    setShowAuthPrompt: (show) => set({ showAuthPrompt: show }),
}));
