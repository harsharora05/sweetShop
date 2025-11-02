import { useRef } from "react";
import { toast } from "react-toastify";
import { useEditModalStore } from "../../store/editModalStore";
import { useSweetStore } from "../../store/sweetStore";

export const EditSweetModal = () => {
    const { isOpen, sweetId, closeModal } = useEditModalStore();
    const { updateSweet } = useSweetStore();

    const nameRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const updateSweetHandle = async () => {
        const name = nameRef.current?.value.trim();
        const category = categoryRef.current?.value.trim();
        const price = priceRef.current?.value;

        const errors: string[] = [];
        if (!name) errors.push("name required");
        if (!category) errors.push("category required");
        if (!price || isNaN(Number(price)) || Number(price) <= 0)
            errors.push("invalid price");

        if (errors.length > 0) {
            toast.warn(errors.join(", "));
            return;
        }

        const token = localStorage.getItem("token");
        const response = await fetch(
            `https://sweetbackend.glitchharsh.com/api/sweets/${sweetId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    category,
                    price: Number(price),
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            toast.success(data.message || "Sweet updated successfully!");
            updateSweet(data.sweet);
            closeModal();
        } else {
            toast.error(data.message || "Failed to update sweet!");
        }
    };

    return <div className="fixed inset-0 flex items-center justify-center  z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-center text-pink-600 mb-5">
                Edit Sweet 🍬
            </h2>

            <div className="flex flex-col gap-3">
                <input
                    ref={nameRef}
                    placeholder="Sweet Name"
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                    ref={categoryRef}
                    placeholder="Category"
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                    ref={priceRef}
                    placeholder="price"
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />


                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={updateSweetHandle}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>

};
