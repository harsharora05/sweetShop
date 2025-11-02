import { create } from "zustand";

interface RestockModalState {
    isOpen: boolean;
    sweetId: string | null;
    openRetockModal: (id: string) => void;
    closeModal: () => void;
}

export const useRestockModalStore = create<RestockModalState>((set) => ({
    isOpen: false,
    sweetId: null,
    openRetockModal: (id) => set({ isOpen: true, sweetId: id }),
    closeModal: () => set({ isOpen: false, sweetId: null }),
}));