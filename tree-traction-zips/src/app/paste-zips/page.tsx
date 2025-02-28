
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function PasteZips() {
    const [zipCodesInput, setZipCodesInput] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [navOpen, setNavOpen] = useState(false);

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
                            homeownershipRate: data.homeownershipRate || 0,
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
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...results].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setResults(sortedData);
        setSortConfig({ key, direction });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
                <button onClick={() => setNavOpen(true)} className="text-white">
                    <FiMenu size={24} />
                </button>
                <h1 className="text-2xl font-bold">TreeTractionZips</h1>
            </nav>

            {/* Sidebar Navigation */}
            <div className={`fixed inset-0 bg-green-900 text-white w-64 p-4 transform ${navOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                    <button onClick={() => setNavOpen(false)}>
                        <FiX size={24} />
                    </button>
                </div>
                <ul className="space-y-2">
                    <li>
                        <a href="https://www.unitedstateszipcodes.org/zip-code-radius-map.php" target="_blank" className="block p-2 hover:bg-green-700 rounded">
                            Zip Code Radius Map
                        </a>
                    </li>
                    <li>
                        <Link href="/paste-zips" className="block p-2 hover:bg-green-700 rounded">
                            Zip Data Fetch
                        </Link>
                    </li>
                    <li>
                        <Link href="/home" className="block p-2 hover:bg-green-700 rounded">
                            Home
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold">Fetch ZIP Code Data</h1>
                </div>

                <div className="flex flex-col items-center mt-6">
                    <textarea
                        value={zipCodesInput}
                        onChange={(e) => setZipCodesInput(e.target.value)}
                        className="border p-3 w-3/4 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                        placeholder="Paste ZIP codes separated by spaces, commas, or line breaks"
                        rows={3}
                    />
                    <button onClick={fetchZipData} className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition">
                        Fetch Data
                    </button>
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-green-900 text-white">
                                <tr>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("postalCode")}>
                                        ZIP Code {sortConfig?.key === "postalCode" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("city")}>
                                        City {sortConfig?.key === "city" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("state")}>
                                        State {sortConfig?.key === "state" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("population")}>
                                        Population {sortConfig?.key === "population" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("housingUnits")}>
                                        Housing Units {sortConfig?.key === "housingUnits" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHomeValue")}>
                                        Median Home Value ($) {sortConfig?.key === "medianHomeValue" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("homeownershipRate")}>
                                        Homeownership Rate (%) {sortConfig?.key === "homeownershipRate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHouseholdIncome")}>
                                        Median Household Income ($) {sortConfig?.key === "medianHouseholdIncome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer" onClick={() => sortTable("perCapitaIncome")}>
                                        Per Capita Income ($) {sortConfig?.key === "perCapitaIncome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2">{result.postalCode}</td>
                                        <td className="border p-2">{result.city}</td>
                                        <td className="border p-2">{result.state}</td>
                                        <td className="border p-2">{result.population}</td>
                                        <td className="border p-2">{result.housingUnits}</td>
                                        <td className="border p-2">{result.medianHomeValue}</td>
                                        <td className="border p-2">{result.homeownershipRate}%</td>
                                        <td className="border p-2">{result.medianHouseholdIncome}</td>
                                        <td className="border p-2">{result.perCapitaIncome}</td>
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
