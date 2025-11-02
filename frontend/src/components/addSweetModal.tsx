import { useRef } from "react";
import { useModalStore } from "../../store/modalStore";
import { toast } from "react-toastify";
import { useSweetStore } from "../../store/sweetStore";
export const AddSweetModal = () => {
    const { isModalOpen, closeModal } = useModalStore();


    const nameRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);

    const addSweet = async () => {
        const name = nameRef.current?.value.trim();
        const category = categoryRef.current?.value.trim();
        const price = priceRef.current?.value;
        const quantity = quantityRef.current?.value;

        const errors: string[] = [];

        if (!name) errors.push("name is required ");
        if (!category) errors.push("category is required");
        if (!price || isNaN(Number(price)) || Number(price) <= 0)
            errors.push("invalid price");
        if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0)
            errors.push("invalid quantity");

        if (errors.length > 0) {
            toast.warn(errors.join(", "));
            return;
        }


        const token = localStorage.getItem("token");

        const response = await fetch("https://sweetbackend.glitchharsh.com/api/sweets/", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                category: category,
                price: Number(price),
                quantity: Number(quantity),
            }),
        });

        const data = await response.json();
        const { addSweet } = useSweetStore.getState();
        if (response.ok) {
            addSweet({
                _id: data.sweet._id,
                name: name as string,
                category: category as string,
                price: Number(price),
                quantity: Number(quantity),
            });

            toast.success(data.message);
            nameRef.current!.value = "";
            categoryRef.current!.value = "";
            priceRef.current!.value = "";
            quantityRef.current!.value = "";
            closeModal();
        } else {
            toast.error(data.message || "Failed to add sweet!");
        }

    };
    if (!isModalOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-11/12 sm:w-[400px] p-6 relative animate-fadeIn">

                <button
                    onClick={() => closeModal()}
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold mb-5 text-center text-pink-600">
                    Add Sweet
                </h2>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input

                            type="text"
                            ref={nameRef}
                            placeholder="Enter sweet name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            ref={categoryRef}
                            placeholder="Enter category"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            ref={priceRef}
                            placeholder="Enter price"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            ref={quantityRef}
                            placeholder="Enter quantity"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <button
                        type="button"
                        className="bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
                        onClick={() => addSweet()}
                    >

                        Add Sweet
                    </button>
                </form>
            </div>
        </div>
    );
};
