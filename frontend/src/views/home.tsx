import { useEffect } from "react";
import { AddSweetModal } from "../components/addSweetModal"
import Header from "../components/header"
import { useSweetStore } from "../../store/sweetStore";
import { useAuthStore } from "../../store/authStore";
import { useEditModalStore } from "../../store/editModalStore";
import { EditSweetModal } from "../components/editSweetModal";
import { toast } from "react-toastify";
import { useRestockModalStore } from "../../store/restockModalStore";
import { RestockSweetModal } from "../components/restockModal";
import { usePurchaseModalStore } from "../../store/puchaseModalStore";
import { PurchaseModal } from "../components/purchaseSweetModal";
import { SearchFilterBar } from "../components/searchBar";


export const Home = () => {
    const { sweets, fetchSweets, removeSweetFromStore } = useSweetStore();
    const { isLogin, isAdmin } = useAuthStore();
    const { openModal } = useEditModalStore();
    const { openRetockModal } = useRestockModalStore();
    const { openPurModal } = usePurchaseModalStore();
    const deleteSweet = async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://sweetbackend.glitchharsh.com/api/sweets/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json()
        if (res.ok) {
            toast.success(data.message);
            removeSweetFromStore(id);
        }

    };



    useEffect(() => {
        fetchSweets();
    }, []);

    return <>
        <Header />
        <AddSweetModal />
        <EditSweetModal />
        <RestockSweetModal />
        <PurchaseModal />
        <SearchFilterBar />
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center sm:text-left">
                Available Sweets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                    <div
                        key={sweet._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{sweet.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{sweet.category}</p>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-pink-600 text-lg">₹{sweet.price}</span>
                            <span
                                className={`text-xs px-3 py-1 rounded-full ${sweet.quantity > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {sweet.quantity > 0 ? `${sweet.quantity} left` : "Out of stock"}
                            </span>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-2">
                            {/* User button */}
                            {isLogin && !isAdmin && (
                                <button onClick={() => openPurModal(sweet._id!)}
                                    disabled={sweet.quantity === 0}
                                    className={`w-full sm:w-auto flex-1 px-4 py-2 rounded-lg text-white transition text-sm ${sweet.quantity > 0
                                        ? "bg-pink-500 hover:bg-pink-600"
                                        : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                >
                                    Purchase
                                </button>
                            )}

                            {isAdmin && (
                                <>
                                    <button
                                        className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition text-sm"
                                        onClick={() => openModal(sweet._id!)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteSweet(sweet._id!)}
                                        className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm"
                                    >
                                        Delete
                                    </button>

                                    <button className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition text-sm" onClick={() => openRetockModal(sweet._id!)}>
                                        Restock
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>



    </>
}