export default function Header() {
    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">

                <h1 className="text-2xl font-bold text-pink-600 flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
                    SweetShop 🍮
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
                    <button className="px-4 py-2 rounded-lg border border-pink-500 text-pink-600 hover:bg-pink-50 transition text-sm sm:text-base w-full sm:w-auto">
                        Login
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition text-sm sm:text-base w-full sm:w-auto">
                        Register
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition text-sm sm:text-base w-full sm:w-auto">
                        Add Sweet
                    </button>
                </div>
            </div>
        </header>
    );
}
