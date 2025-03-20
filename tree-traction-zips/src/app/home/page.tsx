"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
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
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="p-4 bg-white shadow-md text-center">
                <h1 className="text-2xl font-bold text-green-900">TreeTractionZips</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Hero Section */}
                <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold">Welcome to TreeTractionZips</h1>
                    <p className="mt-2 text-gray-200">A simple tool for ZIP code analysis</p>
                </div>

                {/* Blocks Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                    {/* Radius Map */}
                    <Link href="https://www.unitedstateszipcodes.org/zip-code-radius-map.php" target="_blank" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">📍 Radius Map</h3>
                        <p className="mt-2 text-gray-600">Extract zip codes in a specified radius.</p>
                    </Link>

                    {/* Data Analysis */}
                    <Link href="/paste-zips" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">📊 Data Analysis</h3>
                        <p className="mt-2 text-gray-600">Fetch detailed demographic data.</p>
                    </Link>

                    {/* Reserved Zip Codes */}
                    <Link href="https://airtable.com/appwEwVlryjLI3uYi/pagJK79hMTa2snJ2T?myKfS=allRecords" target="_blank" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">✅ Reserved Zip Codes</h3>
                        <p className="mt-2 text-gray-600">Check if selected ZIP codes are reserved.</p>
                    </Link>

                    {/* Paste EDDM Routes */}
                    <Link href="/pasted-routes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">📌 Paste EDDM Routes</h3>
                        <p className="mt-2 text-gray-600">Manage and format USPS EDDM routes.</p>
                    </Link>

                    {/* House Age Analysis */}
                    <Link href="/house-age" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">🏠 House Age Analysis</h3>
                        <p className="mt-2 text-gray-600">View housing age distribution by ZIP code.</p>
                    </Link>
                    {/* Info */}
                    <Link href="/info" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold text-green-900">🌳Tree density Visualisation</h3>
                        <p className="mt-2 text-gray-600">View tree density on a map per zip code.</p>
                    </Link>

                    {/* Logout Block - Now Light Green */}
                    <div onClick={handleLogout} className="cursor-pointer bg-green-300 text-green-900 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 hover:bg-green-400 text-center">
                        <h3 className="text-xl font-semibold">🚪 Logout</h3>
                        <p className="mt-2">Sign out of your session.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
