/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { ClipboardIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PastedRoutes() {
    const [clientName, setClientName] = useState("");
    const [routesInput, setRoutesInput] = useState("");
    const [formattedRoutes, setFormattedRoutes] = useState<any[]>([]);
    const [navOpen, setNavOpen] = useState(true);
    const router = useRouter();

    const formatIncome = (income: string) => {
        if (!income || income === "—") return "";
        let num = parseFloat(income.replace(/[^0-9.]/g, ""));
        if (isNaN(num)) return "";
        if (income.toLowerCase().includes("k")) num *= 1000; // Convert K format back to full number
        return num.toLocaleString(); // Format as 70,000 instead of 70K
    };

    const extractZip = (fullRouteName: string) => {
        const match = fullRouteName.match(/^(\d{5})/); // Extract first 5 digits
        return match ? match[1] : "Unknown"; // Default to "Unknown" if no ZIP found
    };

    const formatSize = (size: string) => {
        const num = parseFloat(size.replace(/[^0-9.]/g, ""));
        return isNaN(num) || size === "—" ? "" : num.toFixed(2); // Ensure two decimal places
    };

    const formatAgePercent = (percent: string) => {
        const num = parseFloat(percent.replace(/[^0-9.]/g, "")) / 100;
        return isNaN(num) ? "" : num.toFixed(3);
    };

    const parseRoutes = () => {
        const lines = routesInput.split("\n").map(line => line.trim()).filter(line => line);
        const formatted = [];

        for (let i = 0; i < lines.length; i += 8) {
            if (lines.length - i < 8) break;

            formatted.push({
                fullRouteName: lines[i],
                residential: lines[i + 1] === "—" ? "" : lines[i + 1],
                business: lines[i + 2] === "—" ? "" : lines[i + 2],
                totalMailpieces: lines[i + 3] === "—" ? "" : lines[i + 3],
                agePercent: formatAgePercent(lines[i + 4]),
                size: formatSize(lines[i + 5]), // Fix Size Formatting
                income: formatIncome(lines[i + 6]), // Fix Income Formatting
                cost: lines[i + 7] === "—" ? "" : lines[i + 7],
                clientName: clientName || "N/A",
                column: extractZip(lines[i]), // Extract ZIP and store in the new column
            });
        }

        setFormattedRoutes(formatted);
    };

    const copyRoutesToClipboard = () => {
        const text = formattedRoutes.map(route =>
            `${route.fullRouteName}\t${route.residential}\t${route.business}\t${route.totalMailpieces}\t${route.agePercent}\t${route.size}\t${route.income}\t${route.cost}\t${route.clientName}\t${route.column}`
        ).join("\n");

        navigator.clipboard.writeText(text);
        toast.success("Formatted routes copied to clipboard!", { autoClose: 1000 });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                </ul>
            </div>

            <div className={`flex-1 p-8 ${navOpen ? "ml-64" : "ml-0"} transition-all`}>
                <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
                    <button onClick={() => setNavOpen(!navOpen)} className="text-white">
                        <FiMenu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Route Data Formatter</h1>
                </nav>

                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-bold mb-4">Paste Route Data</h2>
                    <input
                        type="text"
                        placeholder="Client Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="border p-2 w-full mb-4 rounded-lg"
                    />
                    <textarea
                        value={routesInput}
                        onChange={(e) => setRoutesInput(e.target.value)}
                        className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 text-black"
                        placeholder="Paste routes data here..."
                        rows={6}
                    />
                    <button onClick={parseRoutes} className="mt-4 bg-green-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-800 transition">
                        Format Data
                    </button>
                </div>

                {formattedRoutes.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Formatted Routes</h2>
                            <button onClick={copyRoutesToClipboard} className="p-2 rounded-full hover:bg-gray-200 transition">
                                <ClipboardIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-green-900 text-white">
                                <tr>
                                    <th className="border p-3">Full Route Name</th>
                                    <th className="border p-3">Residential</th>
                                    <th className="border p-3">Business</th>
                                    <th className="border p-3">Total Mailpieces</th>
                                    <th className="border p-3">% Age 35-75</th>
                                    <th className="border p-3">Size</th>
                                    <th className="border p-3">Income</th>
                                    <th className="border p-3">Cost</th>
                                    <th className="border p-3">Client Name</th>
                                    <th className="border p-3">Zip Code</th> {/* New column header */}
                                </tr>
                            </thead>
                            <tbody>
                                {formattedRoutes.map((route, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2">{route.fullRouteName}</td>
                                        <td className="border p-2">{route.residential}</td>
                                        <td className="border p-2">{route.business}</td>
                                        <td className="border p-2">{route.totalMailpieces}</td>
                                        <td className="border p-2">{route.agePercent}</td>
                                        <td className="border p-2">{route.size}</td>
                                        <td className="border p-2">{route.income}</td>
                                        <td className="border p-2">{route.cost}</td>
                                        <td className="border p-2">{route.clientName}</td>
                                        <td className="border p-2">{route.column}</td> {/* New column data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
