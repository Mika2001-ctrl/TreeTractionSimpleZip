/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { batchDate, numOrders, shippingType, orders } = await request.json();

        const { error } = await supabase.from('order_batches').insert([
            {
                batch_date: batchDate,
                num_orders: numOrders,
                shipping_type: shippingType,
                orders,
            },
        ]);

        if (error) {
            console.error('Supabase error:', error.message);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Unexpected error:', err.message);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
