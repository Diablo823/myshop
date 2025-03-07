import { NextResponse } from 'next/server';
import { orders } from '@wix/ecom';
import { wixClientServer } from '@/lib/wixClientServer';

export async function POST(request: Request) {
  try {
    const { orderId, ...options } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    const wixClient = await wixClientServer();
    const response = await wixClient.orders.cancelOrder(orderId, options);
    
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to cancel order",
        details: error.details 
      },
      { status: 500 }
    );
  }
}