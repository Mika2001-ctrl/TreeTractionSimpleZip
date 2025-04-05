'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderRow {
    route: string;
    description: string;
    mailers: string;
    shippingCost?: string;
    pdf: string;
}

interface Order {
    label: string;
    zip: string;
    rows: OrderRow[];
}

interface Batch {
    id: string;
    batch_date: string;
    orders: Order[];
}

export default function BatchListPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBatches = async () => {
            const res = await fetch('/api/order-batch/list');
            const data = await res.json();
            setBatches(data);
        };

        fetchBatches();
    }, []);

    const filtered = batches.filter((batch) => {
        return (
            batch.batch_date.includes(search) ||
            batch.orders.some((order) => order.label.toLowerCase().includes(search.toLowerCase()))
        );
    });

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">All Order Batches</h1>

            <input
                type="text"
                className="border px-3 py-2 mb-4 w-full"
                placeholder="Search by date or order ID (e.g. Order 345)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((batch) => (
                    <Link
                        href={`/pod2/batch/${batch.id}`}
                        key={batch.id}
                        className="border p-4 rounded-lg shadow hover:bg-green-100 transition"
                    >
                        <p className="font-bold text-green-800 mb-2">Batch Date: {batch.batch_date}</p>
                        {batch.orders.map((order, i) => (
                            <div key={i} className="text-sm text-gray-700">• {order.label}</div>
                        ))}
                    </Link>
                ))}
            </div>
        </div>
    );
}
