/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FiMenu, FiX } from "react-icons/fi";

export default function PasteZips() {
    const [zipCodesInput, setZipCodesInput] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [navOpen, setNavOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        if (!authStatus) {
            router.push("/password");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const fetchZipData = async () => {
        try {
            const zipCodesArray = zipCodesInput.split(/[\s,;]+/).filter(zip => zip.length > 0);

            const enrichedResults = await Promise.all(
                zipCodesArray.map(async (zip: string) => {
                    try {
                        const response = await axios.get(`/api/zipcodes?zip=${zip}`);

                        if (response.status !== 200) {
                            throw new Error(`Failed to fetch data for ZIP: ${zip}`);
                        }

                        const data = response.data;
                        return {
                            postalCode: zip,
                            city: data.city || "N/A",
                            state: data.state || "N/A",
                            population: data.population || 0,
                            housingUnits: data.housingUnits || 0,
                            medianHomeValue: data.medianHomeValue || 0,
                            homeownershipRate: parseFloat(data.homeownershipRate) || 0,
                            medianHouseholdIncome: data.medianHouseholdIncome || 0,
                            perCapitaIncome: data.perCapitaIncome || 0,
                        };
                    } catch (error) {
                        console.error(`Error fetching data for ZIP ${zip}:`, error);
                        return { postalCode: zip, city: "N/A", state: "N/A", error: "Data not found" };
                    }
                })
            );

            setResults(enrichedResults);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch data. Please try again.");
        }
    };

    const sortTable = (key: string) => {
        setSortConfig((prevSortConfig) => {
            const newDirection = prevSortConfig?.key === key && prevSortConfig.direction === "asc" ? "desc" : "asc";

            const sortedResults = [...results].sort((a, b) => {
                let aValue = a[key];
                let bValue = b[key];

                // Ensure numbers are sorted correctly
                if (!isNaN(parseFloat(aValue))) aValue = parseFloat(aValue);
                if (!isNaN(parseFloat(bValue))) bValue = parseFloat(bValue);

                if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
                if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
                return 0;
            });

            setResults(sortedResults);
            return { key, direction: newDirection };
        });
    };


    const handlePrint = () => {
        window.print();
    };

    const zipWithHighestIncome = results.reduce(
        (max, zip) => (zip.medianHouseholdIncome > max.medianHouseholdIncome ? zip : max),
        results[0] || { postalCode: "N/A", medianHouseholdIncome: 0 }
    );

    const zipWithHighestPopulation = results.reduce(
        (max, zip) => (zip.population > max.population ? zip : max),
        results[0] || { postalCode: "N/A", population: 0 }
    );

    const zipWithHighestHomeownership = results.reduce(
        (max, zip) => (zip.homeownershipRate > max.homeownershipRate ? zip : max),
        results[0] || { postalCode: "N/A", homeownershipRate: 0 }
    );



    if (!isAuthenticated) {
        return <h1>Redirecting to password page...</h1>;
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
                            <span className="ml-2">Terms Of Use</span>
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
                </ul>

            </div>

            {/* Main Content */}
            <div className={`flex-1 p-8 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
                    <button onClick={() => setNavOpen(!navOpen)} className="text-white">
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Tree Traction Dashboard</h1>
                </nav>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-bold">Highest Median Household Income</h2>
                        <p className="text-3xl text-green-700 font-semibold">{zipWithHighestIncome.postalCode}</p>
                    </div>
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-bold">Highest Population</h2>
                        <p className="text-3xl text-green-700 font-semibold">{zipWithHighestPopulation.postalCode}</p>
                    </div>
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-bold">Highest Homeownership Rate</h2>
                        <p className="text-3xl text-green-700 font-semibold">
                            {zipWithHighestHomeownership.postalCode}
                        </p>
                    </div>
                </div>

                {/* Input Area */}
                <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md mt-8">
                    <h1 className="text-4xl font-bold">Fetch ZIP Code Data</h1>
                    <h6 className="text-2xl font-bold">Click on a Zip code to view it on Google Maps!</h6>
                </div>

                <div className="flex flex-col items-center mt-6">
                    <textarea
                        value={zipCodesInput}
                        onChange={(e) => setZipCodesInput(e.target.value)}
                        className="border p-3 w-3/4 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 text-black"
                        placeholder="Paste ZIP codes separated by spaces, commas, or line breaks"
                        rows={3}
                    />
                    <button onClick={fetchZipData} className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition">
                        Fetch Data
                    </button>
                </div>



                {/* Results Table */}
                {/* Results Table */}
                {results.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-green-900 text-white">
                                <tr>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("postalCode")}>Postal Code</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("city")}>City</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("state")}>State</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("population")}>Population</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("housingUnits")}>Housing Units</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHomeValue")}>Median Home Value ($)</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("homeownershipRate")}>Homeownership Rate (%)</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHouseholdIncome")}>Median Household Income ($)</th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("perCapitaIncome")}>Per Capita Income ($)</th>

                                </tr>
                            </thead>
                            <tbody className="text-black">
                                {results.map((result, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2">
                                            {result.city && result.state ? (
                                                <a
                                                    href={`https://www.google.com/maps/place/${encodeURIComponent(result.city)},+${encodeURIComponent(result.state)}+${result.postalCode},+USA`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-700 hover:text-green-900"
                                                >
                                                    {result.postalCode}
                                                </a>
                                            ) : (
                                                result.postalCode
                                            )}
                                        </td>
                                        <td className="border p-2">{result.city || "N/A"}</td>
                                        <td className="border p-2">{result.state || "N/A"}</td>
                                        <td className="border p-2">
                                            {result.population ? result.population.toLocaleString() : "N/A"}
                                        </td>
                                        <td className="border p-2">
                                            {result.housingUnits ? result.housingUnits.toLocaleString() : "N/A"}
                                        </td>
                                        <td className="border p-2">
                                            {result.medianHomeValue ? `$${result.medianHomeValue.toLocaleString()}` : "N/A"}
                                        </td>
                                        <td className="border p-2">
                                            {result.homeownershipRate ? `${result.homeownershipRate.toFixed(2)}%` : "N/A"}
                                        </td>

                                        <td className="border p-2">
                                            {result.medianHouseholdIncome ? `$${result.medianHouseholdIncome.toLocaleString()}` : "N/A"}
                                        </td>
                                        <td className="border p-2">
                                            {result.perCapitaIncome ? `$${result.perCapitaIncome.toLocaleString()}` : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}