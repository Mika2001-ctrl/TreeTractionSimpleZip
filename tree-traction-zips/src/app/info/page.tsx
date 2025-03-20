
"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function InfoPage() {
    const [navOpen, setNavOpen] = useState(true); // State to control sidebar visibility

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Navigation */}
            <div className={`fixed inset-0 bg-green-900 text-white w-64 p-4 transform ${navOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                    <button onClick={() => setNavOpen(false)}>
                        <FiX size={24} />
                    </button>
                </div>
                <ul className="space-y-4">
                    <li>
                        <Link href="/home" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">Home</span>
                        </Link>
                    </li>
                    <li>
                        <a href="https://www.unitedstateszipcodes.org/zip-code-radius-map.php" target="_blank" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">1. Radius Map</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://airtable.com/appwEwVlryjLI3uYi/pagJK79hMTa2snJ2T?myKfS=allRecords" target="_blank" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">2. Reserved Zip Codes</span>
                        </a>
                    </li>
                    <li>
                        <Link href="/house-age" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">3. View ZIP home age </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/pasted-routes" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">4. Paste eddm Routes</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/paste-zips" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                            <span className="ml-2">5. Analyse Zip Stats</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={`flex-1 p-6 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                {/* Top Navigation */}
                <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
                    <button onClick={() => setNavOpen(!navOpen)} className="text-white">
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Tree Equity & App Tutorial</h1>
                </nav>

                {/* Tutorial Video */}
                <div className="flex-1 p-6 mb-6 w-full max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                        🌳 How to Use This App:
                    </h2>
                    <iframe
                        className="w-full h-72 rounded-lg shadow-lg"
                        src="https://www.loom.com/embed/63015bbf22fb4e96961542f93bbe0f50?sid=d3124f4b-36d6-40bb-b7c6-b62cac2df627"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Tree Equity Score Map */}
                <div className="mb-6 w-full max-w-3xl text-center mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                        🌍 Explore the Tree Equity Score Map:
                    </h2>
                    <p className="text-gray-600 mb-3">
                        This tool allows us to visualize tree density across different ZIP codes and pinpoint areas with high or low tree coverage.
                    </p>
                    <Link
                        href="https://www.treeequityscore.org/map#3.38/37.22/-98.75"
                        target="_blank"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                        Open Tree Equity Score Map 🌍
                    </Link>
                </div>

                {/* Why Tree Equity? */}
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">🌲 Why Tree Equity?</h2>
                    <p className="text-gray-600">
                        Understanding tree density within ZIP codes helps us prioritize work more effectively.
                        We can identify areas that need services most, optimize our operations, and ensure resources are used efficiently.
                    </p>
                    <p className="mt-3 text-gray-600">
                        In general Tree Equity Scores allow cities and organizations to improve urban greenery.
                    </p>
                </div>


            </div>
        </div>
    );
}
