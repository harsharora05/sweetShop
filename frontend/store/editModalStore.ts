import { create } from "zustand";

interface EditModalState {
    isOpen: boolean;
    sweetId: string | null;
    openModal: (id: string) => void;
    closeModal: () => void;
}

export const useEditModalStore = create<EditModalState>((set) => ({
    isOpen: false,
    sweetId: null,
    openModal: (id) => set({ isOpen: true, sweetId: id }),
    closeModal: () => set({ isOpen: false, sweetId: null }),
}));