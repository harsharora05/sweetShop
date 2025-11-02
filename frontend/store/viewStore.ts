import { create } from "zustand";

type viewType = "login" | "register" | "home";

type viewState = {
    view: viewType;
    changeView: (view: viewType) => void;
}

export const useViewStore = create<viewState>((set) => ({
    view: "login",
    changeView: (view) => set({ view }),
}));
