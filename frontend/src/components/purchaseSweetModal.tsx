import { useState } from "react";
import { usePurchaseModalStore } from "../../store/puchaseModalStore";
import { useSweetStore } from "../../store/sweetStore";
import { toast } from "react-toastify";

export const PurchaseModal = () => {
    const { isOpen, closeModal, sweetId } = usePurchaseModalStore();
    const { fetchSweets } = useSweetStore();
    const [quantity, setQuantity] = useState<number>(1);

    if (!isOpen) return null;

    const handlePurchase = async () => {
        if (!sweetId) return;
        const token = localStorage.getItem("token");


        const response = await fetch(
            `https://sweetbackend.glitchharsh.com/api/sweets/${sweetId}/purchase`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            fetchSweets();
            toast.success(data.message);
            closeModal();
        } else {
            alert(data.message);
        }
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4 text-center text-pink-600">
                    Purchase Sweet 🍭
                </h2>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-pink-500 outline-none"
                />

                <div className="flex justify-between">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handlePurchase()}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                    >
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};
