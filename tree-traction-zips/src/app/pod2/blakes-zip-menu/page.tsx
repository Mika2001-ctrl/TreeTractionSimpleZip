"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

export default function BlakesZipMenu() {
    const [navOpen, setNavOpen] = useState(true);
    const [search, setSearch] = useState("");

    const states = [
        { name: "Oregon", code: "OR" },
        { name: "Washington", code: "WA" },
        { name: "Colorado", code: "CO" },
    ];

    const filteredStates = states.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-0 bg-green-900 text-white w-64 p-4 transform ${navOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                    <button onClick={() => setNavOpen(false)}>✖</button>
                </div>
                <ul className="space-y-4">
                    <li><Link href="/pod2/menu" className="hover:underline">← Back to Menu</Link></li>
                </ul>
            </div>

            {/* Main */}
            <div className={`flex-1 p-8 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                <nav className="bg-green-900 text-white p-4 flex justify-between items-center">
                    <button onClick={() => setNavOpen(!navOpen)}>
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Blakes Zip Menu</h1>
                </nav>

                {/* Search & Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center my-6">
                    <input
                        type="text"
                        placeholder="Search state..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-3 rounded-md border w-full sm:w-1/2 mb-3 sm:mb-0"
                    />
                    <button className="ml-0 sm:ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
                        ➕ Add State
                    </button>
                </div>

                {/* State Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredStates.map((state, idx) => (
                        <div key={idx} className="p-6 bg-white shadow-md rounded-lg text-center">
                            <h2 className="text-2xl font-semibold text-green-800">{state.name}</h2>
                            <p className="text-gray-600 mt-2">State Code: {state.code}</p>
                            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                View ZIPs
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
