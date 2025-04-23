import { NextResponse } from "next/server";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import * as SibApi from "@getbrevo/brevo";
import { GoogleGenAI } from "@google/genai";

// Initialize Google Generative AI
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

// Set up Brevo API client
const apiInstance = new TransactionalEmailsApi();
// Set API key - this should be the correct approach based on Brevo's documentation
apiInstance.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

if (!process.env.BREVO_API_KEY || !process.env.EMAIL_USER || !process.env.FROM_NAME) {
  throw new Error("Missing Brevo or from configuration");
}

const validateFormData = (body: any) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "messageTitle",
    "message",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    throw new Error("Invalid email format");
  }
};

const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
}) => {
  const { to, subject, text, html, headers } = options;
  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  if (text) {
    sendSmtpEmail.textContent = text;
  }
  if (html) {
    sendSmtpEmail.htmlContent = html;
  }
  sendSmtpEmail.sender = { name: process.env.FROM_NAME!, email: process.env.EMAIL_USER! };
  sendSmtpEmail.to = [{ email: to }];
  if (headers) {
    sendSmtpEmail.headers = headers;
  }

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    try {
      validateFormData(body);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      messageTitle,
      message,
    } = body;

    try {
      // Generate AI response
      const prompt = `
      You are Nik, a female customer service representative for US CARTEL, an e-commerce website. 
    you can address the person with their full name or first name that's your choice.

    Generate a helpful, professional response to the following customer inquiry.
    Keep the response concise but thorough.

    The name of the customer is ${firstName} ${lastName}.

    Customer's message: ${message}. You can adderess them with their first name or full name that's your choice.

    Respond in a way that directly addresses their specific concern or query.
    If it's about returns/refunds, include relevant policy information.
    If it's a product inquiry, provide helpful product-related information.
    If it's a complaint, show empathy and provide a solution.
    If it's a business opportunity, handle that response in a way how businessmen handle.

    And tell them that somebody will send them an email with more information soon from the email "support@uscartel.com" or "hello@uscartel.com", and also tell them that they can directly email support@uscartel.com.

    Keep the tone professional but friendly.

    End the mail with 
    "Sincerely,

      Nik
      Customer Service Representative
      US CARTEL

      Best regards,
      The US CARTEL Team"


      To effectively communicate with customers via email, customer service agents should include several key components to ensure clarity, empathy, and professionalism. Here are the essential elements to consider:
        Key Components of Customer Service Emails
        1. Personalized Greeting
        Use the customer's name to create a personal connection. For example, "Dear [Customer's Name],".
        2. Acknowledgment of the Issue
        Clearly restate the customer's concern or question to show understanding. This helps validate their feelings and assures them that their issue is being taken seriously.
        3. Empathy and Apology
        If applicable, express empathy for their situation and apologize for any inconvenience caused. This can help soothe frustrated customers.
        4. Clear and Concise Response
        Provide a direct answer to the customer's inquiry or a solution to their problem. Avoid jargon and keep the language simple and conversational.
        5. Next Steps or Solutions
        Outline what actions will be taken or what the customer can expect next. If a resolution requires time, specify a clear timeframe.
        6. Offer Further Assistance
        Encourage the customer to reach out if they have additional questions or concerns. This shows that you are available to help them further.
        7. Professional Closing
        End with a polite sign-off, such as "Best regards" or "Sincerely," followed by your name and position.
        8. Clear Subject Line
        Ensure the subject line reflects the email's content accurately, making it easy for customers to locate later.
    `;
      
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      let aiResponse = response.text;

      // Send AI response to the user after 3 minutes
      // Note: In serverless environments, setTimeout may not work due to function timeouts.
      // Consider using a queue or scheduled task for delayed emails.
      //setTimeout(async () => {
        try {
          await sendEmail({
            to: email,
            subject: `Response to - ${messageTitle}`,
            text: aiResponse,
            html: `<div style="font-family: Arial, sans-serif;">${aiResponse?.replace(/\n/g, '<br>')}</div>`,
            headers: {
              Precedence: "bulk",
              "X-Auto-Response-Suppress": "OOF, AutoReply",
              "Auto-Submitted": "auto-generated",
            },
          });
        } catch (error) {
          console.error("Error sending email to user:", error);
        }
      //}, 180000);

      // Send email to admin immediately
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission: ${messageTitle}`,
          text: `
            New Contact Form Submission

            Name: ${firstName} ${lastName}
            Email: ${email}
            Phone: ${countryCode}${phone}
            Subject: ${messageTitle}

            Message:
            ${message}`,
        });
      }

      return NextResponse.json(
        { message: "Emails sent successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Operation failed:", error);
      return NextResponse.json(
        { error: "Failed to process request. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}