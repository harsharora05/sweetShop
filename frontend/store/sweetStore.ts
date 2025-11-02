import { create } from "zustand";

interface Sweet {
    _id?: string;
    name: string
    category: string;
    price: number;
    quantity: number;
}

interface SweetState {
    sweets: Sweet[];
    fetchSweets: () => Promise<void>;
    addSweet: (sweet: Sweet) => void;
    updateSweet: (sweet: Sweet) => void;
    removeSweetFromStore: (id: string) => void;
    searchSweets: (filters: {
        query?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    }) => Promise<void>;
}

export const useSweetStore = create<SweetState>((set) => ({
    sweets: [],

    fetchSweets: async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("https://sweetbackend.glitchharsh.com/api/sweets", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            console.log(data);


            if (response.ok) {
                set({ sweets: data.sweets || [] });
            } else {
                console.error("Failed to fetch sweets:", data.message);
            }
        } catch (err) {
            console.error("Error fetching sweets:", err);
        }
    },
    addSweet: (sweet) => set((state) => ({ sweets: [...state.sweets, sweet] })),
    updateSweet: (updatedSweet) =>
        set((state) => ({
            sweets: state.sweets.map((sweet) =>
                sweet._id === updatedSweet._id ? updatedSweet : sweet
            ),
        })),
    removeSweetFromStore: (id) =>
        set((state) => ({
            sweets: state.sweets.filter((s) => s._id !== id),
        })),
    searchSweets: async ({ query, category, minPrice, maxPrice }) => {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (category) params.append("category", category);
        if (minPrice) params.append("minPrice", minPrice.toString());
        if (maxPrice) params.append("maxPrice", maxPrice.toString());

        const res = await fetch(
            `https://sweetbackend.glitchharsh.com/api/sweets/search?${params.toString()}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await res.json();
        if (res.ok) set({ sweets: data.sweets });
        else set({ sweets: [] });
    },

}));