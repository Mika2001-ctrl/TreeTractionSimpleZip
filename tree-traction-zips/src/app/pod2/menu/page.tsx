"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function POD2Menu() {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("pod2-auth");
        if (stored !== "true") {
            router.push("/pod2");
        } else {
            setAuthenticated(true);
        }
    }, [router]);

    if (!authenticated) {
        return <div className="p-10 text-center">Redirecting...</div>;
    }

    const menuItems = [
        { title: "Zip Details", href: "/pod2/zip-details" },
        { title: "Blake's Zip Menu", href: "/pod2/blakes-zip-menu" },
        { title: "Mailers", href: "/pod2/mailers" },
        { title: "Order Batch Info", href: "/pod2/order-batch-info" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
                POD2 - Data Management for Blake
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="bg-white shadow-md p-6 rounded-lg hover:shadow-xl hover:bg-green-100 transition text-center text-xl font-semibold text-green-800"
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
