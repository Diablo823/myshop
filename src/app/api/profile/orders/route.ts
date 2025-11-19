import { wixClientServer } from "@/lib/wixClientServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contactId, cursor } = await request.json();

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    const wixClient = await wixClientServer();

    const orderResponse = await wixClient.orders.searchOrders({
      search: {
        filter: { "buyerInfo.contactId": { $eq: contactId } },
        cursorPaging: {
          limit: 5,
          cursor: cursor || undefined,
        },
      },
    });

    return NextResponse.json({
      orders: orderResponse.orders || [],
      nextCursor: orderResponse.metadata?.cursors?.next || null,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}