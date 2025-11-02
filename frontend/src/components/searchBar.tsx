import { useState } from "react";
import { useSweetStore } from "../../store/sweetStore";

export const SearchFilterBar = () => {
    const { searchSweets, fetchSweets } = useSweetStore();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query && !category && !minPrice && !maxPrice) {
            fetchSweets(); // reset sweets list
            return;
        }

        await searchSweets({
            query,
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        });
    };

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 py-3">
            <div className="max-w-6xl mx-auto px-4">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-3"
                >
                    <input
                        type="text"
                        placeholder="Search sweets..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="px-3 py-2 w-full sm:w-48 text-gray-700 outline-none border border-gray-300 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 w-full sm:w-40 text-gray-700 outline-none border border-gray-300 rounded-lg"
                    />

                    <input
                        type="number"
                        placeholder="Min ₹"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="px-3 py-2 w-24 text-gray-700 outline-none border border-gray-300 rounded-lg"
                    />

                    <input
                        type="number"
                        placeholder="Max ₹"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="px-3 py-2 w-24 text-gray-700 outline-none border border-gray-300 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg transition text-sm"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setCategory("");
                            setMinPrice("");
                            setMaxPrice("");
                            fetchSweets();
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition text-sm"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};
