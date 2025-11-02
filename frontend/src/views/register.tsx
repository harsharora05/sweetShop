import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useViewStore } from "../../store/viewStore";

export const Register = () => {
    const { changeView } = useViewStore();
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const confirmPass = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const verifyInputs = () => {
        const err: string[] = []
        const uname = username.current?.value;
        const pass = password.current?.value;
        const cpass = confirmPass.current?.value;

        if (uname!.length < 3) {
            err.push("username should have length gt 3 ")
        }
        if (pass!.length < 6) {
            err.push("password should have length gt 6 ")
        }

        if (!(pass!.match(/[^a-zA-Z0-9_]/))) {
            err.push("should contains special character")
        }

        if (pass !== cpass) {
            err.push("passwords don't match")
        }

        if (err.length > 0) {
            setErrors(err);
            return;
        } else {
            setErrors([]);
            registerUser(uname!, pass!, pass!);
        }
    }

    const registerUser = async (uname: string, pass: string, cpass: string) => {

        const response = await fetch("https://sweetbackend.glitchharsh.com/api/auth/register", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: uname,
                password: pass,
                confirmPassword: cpass
            })
        });

        const data = await response.json()
        if (response.ok) {
            toast.success(data.message);
            changeView("login");
            username.current!.value = "";
            password.current!.value = "";
            confirmPass.current!.value = "";
        } else {
            toast.warn(data.message)
        }




    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
            <div className="w-full max-w-sm bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
                    Register to SweetShop 🍮
                </h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="username" placeholder="Enter username" ref={username} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" placeholder="Enter password" ref={password} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input type="password" placeholder="Confirm password" ref={confirmPass} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <ul>
                            {errors.map((err) => <li key={err} className="text-red-400">{err}</li>)}
                        </ul>
                    </div>

                    <button type="button" className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition" onClick={() => verifyInputs()}>Register</button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don’t have an account?{" "} <a onClick={() => changeView("login")} className="text-pink-600 hover:underline font-medium"> Login
                    </a>
                </p>
            </div >
        </div >
    );
};