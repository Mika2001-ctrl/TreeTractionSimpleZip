'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface OrderRow {
    route: string;
    description: string;
    mailers: string;
    pdf: string;
}

interface Order {
    label: string;
    zip: string;
    shippingCost?: string;
    rows: OrderRow[];
}

interface Batch {
    id: string;
    batch_date: string;
    shipping_type: string;
    orders: Order[];
}

export default function BatchDetailsPage() {
    const { id } = useParams();
    const [batch, setBatch] = useState<Batch | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            const res = await fetch(`/api/order-batch/${id}`);
            const data = await res.json();
            setBatch(data);
        };

        if (id) fetchBatch();
    }, [id]);

    if (!batch) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2 text-green-800">📦 Batch: {batch.batch_date}</h1>
            <p className="mb-6 text-gray-600">Shipping Type: <b>{batch.shipping_type}</b></p>

            {batch.orders.map((order, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-lg font-semibold text-green-700 mb-1">
                        🧾 {order.label} (ZIP: {order.zip})
                    </h2>

                    {batch.shipping_type === 'Express' && order.shippingCost && (
                        <p className="text-sm text-green-600 font-medium mb-2">
                            🚚 Express Shipping Cost: ${order.shippingCost}
                        </p>
                    )}

                    <table className="w-full text-sm border mt-2">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                <th className="p-2">Route</th>
                                <th className="p-2">Description</th>
                                <th className="p-2">Mailers</th>
                                <th className="p-2">PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.rows.map((row, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-2">{row.route}</td>
                                    <td className="p-2">{row.description}</td>
                                    <td className="p-2">{row.mailers}</td>
                                    <td className="p-2">{row.pdf}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
