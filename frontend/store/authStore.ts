import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { useViewStore } from "./viewStore"

interface AuthState {
    isLogin: boolean;
    isAdmin: boolean;
    setIsLogin: () => void;
    setIsAdmin: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: false,
    isAdmin: false,

    setIsLogin: () => {
        const token = localStorage.getItem("token");
        if (token) {
            set({ isLogin: true })
        } else {
            set({ isLogin: false })
        }
    },
    setIsAdmin: () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: {
                userId: string,
                role: string
            } = jwtDecode(token);
            if (decoded.role === "ADMIN") {

                set({ isAdmin: true });
            } else {
                set({ isAdmin: false });
            }
        } else {
            set({ isAdmin: false });
        }
    },

    logout: () => {
        const { changeView } = useViewStore.getState();
        localStorage.removeItem("token")
        changeView("login");
        set({ isLogin: false, isAdmin: false });
    },
})); 
