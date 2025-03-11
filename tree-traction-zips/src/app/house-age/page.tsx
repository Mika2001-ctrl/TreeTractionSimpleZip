/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

// ✅ Register required Chart.js scales
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HousingData {
    "2020 or later": number;
    "2010-2019": number;
    "2000-2009": number;
    "1990-1999": number;
    "1980-1989": number;
    "1970-1979": number;
    "1960-1969": number;
    "1950-1959": number;
    "Before 1950": number;
}

export default function HouseAge() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [housingData, setHousingData] = useState<HousingData | null>(null);
    const [averageAge, setAverageAge] = useState<number | null>(null);
    const [zipCode, setZipCode] = useState<string>("90210"); // Default ZIP code
    const [inputZip, setInputZip] = useState<string>(""); // User input for ZIP
    const [navOpen, setNavOpen] = useState(true); // Sidebar state
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        if (!authStatus) {
            router.push("/password");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated || !zipCode) return;

        async function fetchHousingData() {
            try {
                const response = await axios.get(`/api/housing?zip=${zipCode}`);
                console.log("✅ Housing Data Response:", response.data);

                if (!response.data || !response.data.housingData) {
                    throw new Error("Invalid housing data received");
                }

                const data: HousingData = response.data.housingData;
                setHousingData(data);

                // **Calculate Estimated Average Home Age**
                const currentYear = new Date().getFullYear();
                const ageGroups = [
                    { year: 2022, count: data["2020 or later"] },
                    { year: 2015, count: data["2010-2019"] },
                    { year: 2005, count: data["2000-2009"] },
                    { year: 1995, count: data["1990-1999"] },
                    { year: 1985, count: data["1980-1989"] },
                    { year: 1975, count: data["1970-1979"] },
                    { year: 1965, count: data["1960-1969"] },
                    { year: 1955, count: data["1950-1959"] },
                    { year: 1940, count: data["Before 1950"] },
                ];

                let totalWeightedAge = 0;
                let totalHouses = 0;

                ageGroups.forEach(group => {
                    const houseAge = currentYear - group.year;
                    totalWeightedAge += houseAge * group.count;
                    totalHouses += group.count;
                });

                if (totalHouses > 0) {
                    setAverageAge(parseFloat((totalWeightedAge / totalHouses).toFixed(1)));
                }

            } catch (error) {
                console.error("❌ Error fetching housing data:", error);
                setHousingData(null);
                setAverageAge(null);
            }
        }

        fetchHousingData();
    }, [isAuthenticated, zipCode]);

    if (!isAuthenticated) {
        return <h1 className="text-center text-xl">Redirecting to password page...</h1>;
    }

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
            </div>

            {/* Main Content */}
            <div className={`flex-1 p-8 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
                    <button onClick={() => setNavOpen(!navOpen)} className="text-white">
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Tree Traction Housing Analysis</h1>
                </nav>

                <h1 className="text-3xl font-bold text-green-900 mt-6">Housing Age Analysis</h1>

                {/* ZIP Code Input */}
                <div className="mb-6 flex items-center gap-4">
                    <input
                        type="text"
                        value={inputZip}
                        onChange={(e) => setInputZip(e.target.value)}
                        placeholder="Enter ZIP Code"
                        className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 text-black"
                    />
                    <button
                        onClick={() => setZipCode(inputZip)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
                    >
                        Fetch Data
                    </button>
                </div>

                {/* Display the Selected ZIP Code */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">ZIP Code: <span className="text-green-600">{zipCode}</span></h2>

                {/* Display Average Home Age */}
                {averageAge !== null && (
                    <div className="text-lg font-semibold text-gray-700 mb-4">
                        📊 Estimated **Average Home Age:** <span className="text-green-600">{averageAge} years</span>
                    </div>
                )}

                {/* Bar Chart */}
                {housingData ? (
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        {/* Graph Heading */}
                        <h3 className="text-center text-xl font-semibold mb-4">📊 Number of Homes Built Per Time Period</h3>

                        <Bar
                            data={{
                                labels: Object.keys(housingData),
                                datasets: [{
                                    label: "Number of Homes",
                                    data: Object.values(housingData),
                                    backgroundColor: "rgba(34, 197, 94, 0.6)",
                                }],
                            }}
                            options={{
                                responsive: true,
                                scales: {
                                    x: { type: "category" },
                                    y: { beginAtZero: true },
                                },
                            }}
                        />
                    </div>
                ) : (
                    <p className="text-gray-600">Enter a ZIP code and click "Fetch Data" to view housing age statistics.</p>
                )}
            </div>
        </div>
    );
}
