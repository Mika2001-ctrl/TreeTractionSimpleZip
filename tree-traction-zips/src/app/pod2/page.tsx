/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function POD2Page() {
    const [code, setCode] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("pod2-auth");
        if (stored === "true") {
            setAuthenticated(true);
            router.push("/pod2/menu"); // redirect if already logged in
        }
    }, [router]);

    const handleLogin = () => {
        if (code === process.env.NEXT_PUBLIC_POD2_CODE) {
            localStorage.setItem("pod2-auth", "true");
            setAuthenticated(true);
            router.push("/pod2/menu");
        } else {
            alert("Incorrect code. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-6">Enter Access Code</h1>
            <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Access Code"
                className="px-4 py-2 border rounded-lg shadow-sm mb-4 w-80 text-black"
            />
            <button
                onClick={handleLogin}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
                Submit
            </button>
        </div>
    );
}
