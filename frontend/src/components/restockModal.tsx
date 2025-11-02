// src/components/restockSweetModal.tsx
import { useRef } from "react";
import { toast } from "react-toastify";
import { useRestockModalStore } from "../../store/restockModalStore";
import { useSweetStore } from "../../store/sweetStore";

export const RestockSweetModal = () => {
    const { isOpen, sweetId, closeModal } = useRestockModalStore();
    const { fetchSweets } = useSweetStore();
    const quantityRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const restockSweet = async () => {
        const quantity = quantityRef.current?.value;

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            toast.warn("Please enter a valid quantity");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://sweetbackend.glitchharsh.com/api/sweets/${sweetId}/restock`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: Number(quantity) }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            toast.success(data.message || "Sweet restocked successfully!");
            await fetchSweets();
            closeModal();
        } else {
            toast.error(data.message || "Failed to restock sweet");
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-pink-600">Restock Sweet </h2>

                <input
                    ref={quantityRef}
                    placeholder="Enter quantity to add"
                    type="number"
                    className="border p-2 rounded w-full mb-3"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={restockSweet}
                        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                    >
                        Restock
                    </button>
                </div>
            </div>
        </div>
    );
};
