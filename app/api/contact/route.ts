import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, message } = await req.json();

        // Validate required fields
        if (!firstName || !email || !message) {
            return NextResponse.json(
                { message: "First name, email, and message are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Send notification email to admin
        const adminEmail = process.env.ADMIN_EMAIL || "support@merosaaj.com";

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Message:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #000;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    This message was sent from the MeroSaaj contact form.
                </p>
            </div>
        `;

        await sendEmail({
            to: adminEmail,
            subject: `Contact Form: Message from ${firstName} ${lastName || ''}`,
            html: emailHtml,
        });

        // Send confirmation email to user
        const confirmationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Thank You for Contacting Us!</h2>
                <p>Hi ${firstName},</p>
                <p>We've received your message and will get back to you within 24-48 hours.</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Your message:</strong></p>
                    <p style="color: #666;">${message.replace(/\n/g, '<br>')}</p>
                </div>
                <p>Best regards,<br><strong>Team MeroSaaj</strong></p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "We received your message - MeroSaaj",
            html: confirmationHtml,
        });

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { message: "Failed to send message. Please try again." },
            { status: 500 }
        );
    }
}
