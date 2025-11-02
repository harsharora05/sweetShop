import { useRef, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { useViewStore } from "../../store/viewStore";
import { useAuthStore } from "../../store/authStore";

export const Login = () => {
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const { setIsLogin, setIsAdmin } = useAuthStore();
    const { changeView } = useViewStore();

    const loginUser = async () => {
        const response = await fetch("https://sweetbackend.glitchharsh.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.current!.value,
                password: password.current!.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success(data.message || "Login successful!");
            localStorage.setItem("token", data.token);
            username.current!.value = "";
            password.current!.value = "";
            setIsLogin();
            setIsAdmin();
            changeView("home")
        } else {
            toast.warn(data.message || "Invalid credentials");
        }

    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
            <div className="w-full max-w-sm bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
                    Login to SweetShop 🍮
                </h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input placeholder="Enter username" ref={username} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" ref={password} placeholder="Enter password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <button type="button" className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition" onClick={() => loginUser()}
                    > Login  </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <a onClick={() => changeView("register")} className="text-pink-600 hover:underline font-medium">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};