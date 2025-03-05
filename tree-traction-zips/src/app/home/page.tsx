"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

export default function Home() {
    const [navOpen, setNavOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        if (!authStatus) {
            router.push("/password"); // Redirect to password page if not authenticated
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated"); // Remove authentication
        setIsAuthenticated(false);
        router.push("/password"); // Redirect back to the password page
    };

    if (!isAuthenticated) {
        return <h1>Redirecting to password page...</h1>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${navOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out bg-green-900 text-white w-64 shadow-lg`}>
                <div className="flex items-center justify-between p-4 bg-green-800">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                    <button onClick={() => setNavOpen(false)} className="text-white focus:outline-none">
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-4">
                        <li>
                            <a href="https://www.unitedstateszipcodes.org/zip-code-radius-map.php" target="_blank" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                                <span className="ml-2">1. Radius Map</span>
                            </a>
                        </li>
                        <li>
                            <Link href="/paste-zips" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                                <span className="ml-2">2. Data Analysis</span>
                            </Link>
                        </li>
                        <li>
                            <a href="https://airtable.com/appwEwVlryjLI3uYi/pagJK79hMTa2snJ2T?myKfS=allRecords" target="_blank" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                                <span className="ml-2">3. Reserved Zip Codes</span>
                            </a>
                        </li>
                        <li>
                            <Link href="/pasted-routes" className="flex items-center p-2 rounded-lg hover:bg-green-700 transition-colors">
                                <span className="ml-2">4. Paste eddm Routes</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4">
                    <button onClick={handleLogout} className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-white shadow-md">
                    <button onClick={() => setNavOpen(true)} className="text-green-900 focus:outline-none">
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-green-900">TreeTractionZips</h1>
                </header>
                <main className="flex-1 p-6">
                    {/* Hero Section */}
                    <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                        <h1 className="text-4xl font-bold">Welcome to TreeTractionZips</h1>
                        <p className="mt-2 text-gray-200">A simple tool for ZIP code analysis</p>
                    </div>

                    {/* Info Section */}
                    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-700">Terms of Use:</h2>
                        <ul className="list-disc ml-6 mt-3 text-gray-600 space-y-2">
                            <li>Extract zip codes in a specified radius by selecting the tab in the navigation pane labeled: <div></div><b>Zip Code Radius Map</b>.</li>
                            <li>Paste the zip code/s extracted above (or any zip code/s) and fetch detailed demographic data by selecting the tab in the navigation pane labeled: <div></div><b>Zip Data Fetch</b></li>
                            <li>Check if selected zip codes are reserved by selecting the tab in the navigation pane labeled: <div></div><b>Check Reserved Zip Codes</b></li>
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    );
}
