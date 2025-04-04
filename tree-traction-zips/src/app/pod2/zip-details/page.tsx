/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function ZipDetails() {
    const [zipCodesInput, setZipCodesInput] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [navOpen, setNavOpen] = useState(true);

    const fetchZipData = async () => {
        const zips = zipCodesInput.split(/[\s,]+/).filter(Boolean);
        const newResults = await Promise.all(zips.map(async (zip) => {
            try {
                const res = await axios.get(`/api/zip-details?zip=${zip}`);
                return res.data;
            } catch {
                return { zip, error: "Failed" };
            }
        }));
        setResults(newResults);
    };

    const headers = [
        "ZIP", "City", "State", "County", "Households",
        "Avg Personal Income", "Avg Household Income",
        "Avg Rent", "Avg Home Value",
        "% High School Grad", "% Bachelors", "% Graduate Degree"
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-0 bg-green-900 text-white w-64 p-4 transform ${navOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                    <button onClick={() => setNavOpen(false)}><FiX size={24} /></button>
                </div>
                <ul className="space-y-4">
                    <li><Link href="/home" className="block hover:bg-green-700 p-2 rounded">Home</Link></li>
                    <li><Link href="/pod2/menu" className="block hover:bg-green-700 p-2 rounded">Back to Menu</Link></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={`flex-1 p-8 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                <nav className="bg-green-900 text-white p-4 shadow-md flex justify-between items-center">
                    <button onClick={() => setNavOpen(!navOpen)}><FiMenu size={24} /></button>
                    <h1 className="text-2xl font-bold">ZIP Details Lookup</h1>
                </nav>

                <div className="mt-8">
                    <textarea
                        value={zipCodesInput}
                        onChange={(e) => setZipCodesInput(e.target.value)}
                        className="w-full p-4 border rounded-lg mb-4 text-black"
                        placeholder="Enter ZIP codes separated by commas or spaces..."
                        rows={3}
                    />
                    <button onClick={fetchZipData} className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition">Fetch Data</button>
                </div>

                {/* Table */}
                {results.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-green-800 text-white">
                                <tr>{headers.map((h, i) => <th key={i} className="p-3 border">{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {results.map((zip, i) => (
                                    <tr key={i} className="text-center hover:bg-gray-100">
                                        <td className="border p-2">{zip.zip}</td>
                                        <td className="border p-2">{zip.city}</td>
                                        <td className="border p-2">{zip.state}</td>
                                        <td className="border p-2">{zip.county}</td>
                                        <td className="border p-2">{zip.households}</td>
                                        <td className="border p-2">${zip.avgPersonalIncome?.toLocaleString()}</td>
                                        <td className="border p-2">${zip.avgHouseholdIncome?.toLocaleString()}</td>
                                        <td className="border p-2">${zip.avgRent?.toLocaleString()}</td>
                                        <td className="border p-2">${zip.avgHomeValue?.toLocaleString()}</td>
                                        <td className="border p-2">{zip.highSchoolGrad}%</td>
                                        <td className="border p-2">{zip.bachelors}%</td>
                                        <td className="border p-2">{zip.graduateDegree}%</td>
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
