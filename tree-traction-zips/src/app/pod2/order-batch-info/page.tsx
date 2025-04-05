/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';

interface OrderRow {
    route: string;
    description: string;
    mailers: string;
    pdf: string;
}

interface Order {
    label: string;
    zip: string;
    shippingCost?: string; // ✅ moved here
    rows: OrderRow[];
}

export default function OrderBatchPage() {
    const [batchDate, setBatchDate] = useState('');
    const [numOrders, setNumOrders] = useState(1);
    const [shippingType, setShippingType] = useState('Standard');
    const [orders, setOrders] = useState<Order[]>([{
        label: 'Order 1',
        zip: '',
        shippingCost: '',
        rows: [{ route: '', description: '', mailers: '', pdf: '' }],
    }]);

    const handleNumOrdersChange = (value: number) => {
        const newOrders: Order[] = [];
        for (let i = 0; i < value; i++) {
            newOrders.push({
                label: orders[i]?.label || `Order ${i + 1}`,
                zip: orders[i]?.zip || '',
                shippingCost: orders[i]?.shippingCost || '',
                rows: orders[i]?.rows || [{ route: '', description: '', mailers: '', pdf: '' }],
            });
        }
        setOrders(newOrders);
        setNumOrders(value);
    };

    const updateOrderField = (index: number, field: keyof Order, value: string) => {
        const updated = [...orders];
        (updated[index] as any)[field] = value;
        setOrders(updated);
    };

    const updateRowField = (
        orderIndex: number,
        rowIndex: number,
        key: keyof OrderRow,
        value: string
    ) => {
        const updated = [...orders];
        updated[orderIndex].rows[rowIndex][key] = value;
        setOrders(updated);
    };

    const addRow = (orderIndex: number) => {
        const updated = [...orders];
        updated[orderIndex].rows.push({ route: '', description: '', mailers: '', pdf: '' });
        setOrders(updated);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Create New Order Batch</h1>

            <div className="flex space-x-2 mb-4">
                <input
                    type="date"
                    className="border p-2"
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 w-20"
                    value={numOrders}
                    onChange={(e) => handleNumOrdersChange(Number(e.target.value))}
                />
                <select
                    className="border p-2"
                    value={shippingType}
                    onChange={(e) => setShippingType(e.target.value)}
                >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                </select>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        const batchData = {
                            batchDate,
                            numOrders,
                            shippingType,
                            orders,
                        };

                        try {
                            const res = await fetch('/api/order-batch', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(batchData),
                            });

                            const result = await res.json();
                            if (result.success) {
                                alert('✅ Order batch saved successfully!');
                            } else {
                                alert('❌ Failed to save: ' + result.error);
                            }
                        } catch (err) {
                            console.error(err);
                            alert('⚠️ Error saving batch.');
                        }
                    }}
                >
                    Save Order Batch
                </button>
            </div>

            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="border p-4 mb-6">
                    <input
                        type="text"
                        className="font-bold text-lg mb-2 w-full border px-2 py-1"
                        value={order.label}
                        onChange={(e) => updateOrderField(orderIndex, 'label', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="ZIP"
                        className="w-full border mb-2 px-2 py-1"
                        value={order.zip}
                        onChange={(e) => updateOrderField(orderIndex, 'zip', e.target.value)}
                    />
                    {shippingType === 'Express' && (
                        <input
                            type="text"
                            placeholder="Shipping Cost"
                            className="w-full border mb-2 px-2 py-1"
                            value={order.shippingCost}
                            onChange={(e) => updateOrderField(orderIndex, 'shippingCost', e.target.value)}
                        />
                    )}

                    <table className="w-full text-left border mt-2">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                <th className="p-2">Route</th>
                                <th className="p-2">Description</th>
                                <th className="p-2">Mailers</th>
                                <th className="p-2">PDF Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="border p-2">
                                        <input
                                            className="w-full border px-2 py-1"
                                            value={row.route}
                                            onChange={(e) => updateRowField(orderIndex, rowIndex, 'route', e.target.value)}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            className="w-full border px-2 py-1"
                                            value={row.description}
                                            onChange={(e) => updateRowField(orderIndex, rowIndex, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            className="w-full border px-2 py-1"
                                            value={row.mailers}
                                            onChange={(e) => updateRowField(orderIndex, rowIndex, 'mailers', e.target.value)}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            className="w-full border px-2 py-1"
                                            value={row.pdf}
                                            onChange={(e) => updateRowField(orderIndex, rowIndex, 'pdf', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        className="bg-blue-600 text-white mt-2 px-4 py-1 rounded"
                        onClick={() => addRow(orderIndex)}
                    >
                        + Add Row
                    </button>
                </div>
            ))}
        </div>
    );
}
