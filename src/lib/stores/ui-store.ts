import { create } from "zustand";

interface UIState {
    isCreateModalOpen: boolean;
    isProfileOpen: boolean;
    currentConfessionIndex: number;
    showAuthPrompt: boolean;

    // Actions
    openCreateModal: () => void;
    closeCreateModal: () => void;
    openProfile: () => void;
    closeProfile: () => void;
    setCurrentConfessionIndex: (index: number) => void;
    setShowAuthPrompt: (show: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
    isCreateModalOpen: false,
    isProfileOpen: false,
    currentConfessionIndex: 0,
    showAuthPrompt: false,

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    openProfile: () => set({ isProfileOpen: true }),
    closeProfile: () => set({ isProfileOpen: false }),
    setCurrentConfessionIndex: (index) => set({ currentConfessionIndex: index }),
    setShowAuthPrompt: (show) => set({ showAuthPrompt: show }),
}));
