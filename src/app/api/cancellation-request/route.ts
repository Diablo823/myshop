import { NextRequest, NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import * as SibApi from "@getbrevo/brevo";

export async function POST(req: NextRequest) {
  try {
    const { orderId, orderNumber, message } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order Id Required" }, { status: 400 });
    }

    // Set up Brevo API client
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    if (!process.env.BREVO_API_KEY || !process.env.EMAIL_USER || !process.env.FROM_NAME) {
      throw new Error("Missing Brevo or sender configuration");
    }

    // Create and configure the email
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `Cancellation Request for Order #${orderNumber}`;
    sendSmtpEmail.htmlContent = `
      <h2>Order Cancellation Request</h2>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer Message:</strong> ${message || "No message provided"}</p>
    `;
    sendSmtpEmail.textContent = `Cancellation request for Order ID: ${orderId}\nOrder Number: ${orderNumber}\nMessage: ${message || "No message provided"}`;
    sendSmtpEmail.sender = { name: process.env.FROM_NAME!, email: process.env.EMAIL_USER! };
    
    // Add recipient (admin email)
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("Admin email not configured");
    }
    
    sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL }];

    // Send email
    await apiInstance.sendTransacEmail(sendSmtpEmail);

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