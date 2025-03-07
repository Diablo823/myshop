// src/app/api/cancellation-request/route.ts

import { NextRequest, NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { orderId, orderNumber, message } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order Id Required" }, { status: 400 });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Cancellation Request for Order #${orderNumber}`,
      text: `Cancellation request for Order ID: ${orderId}\nOrder Number: ${orderNumber}\nMessage: ${message || "No message provided"}`,
      html: `
        <h2>Order Cancellation Request</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer Message:</strong> ${message || "No message provided"}</p>
      `
    });

    // You can still try to update the order status in Wix if needed
    const wixClient = await wixClientServer();
    
    // Note: Instead of using createOrderComment which doesn't exist,
    // you might want to look into updating the order status if applicable
    // Check Wix API documentation for available methods
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Cancellation request submitted successfully" 
    });
  } catch (error) {
    console.error("Error processing cancellation request", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit cancellation request";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}