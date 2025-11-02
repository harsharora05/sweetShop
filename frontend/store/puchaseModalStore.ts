import { create } from "zustand";

interface PurchaseModalState {
    isOpen: boolean;
    sweetId: string | null;
    openPurModal: (id: string) => void;
    closeModal: () => void;
}

export const usePurchaseModalStore = create<PurchaseModalState>((set) => ({
    isOpen: false,
    sweetId: null,
    openPurModal: (id) => set({ isOpen: true, sweetId: id }),
    closeModal: () => set({ isOpen: false, sweetId: null }),
}));
