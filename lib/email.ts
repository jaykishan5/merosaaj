import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    if (!resend || !process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY is missing. Email not sent, logging to console instead:');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('HTML preview:', html.substring(0, 500) + '...');
        return { success: true, message: 'Simulated email sent (Dev Mode)' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'MeroSaaj <onboarding@resend.dev>', // Update this after domain verification
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email caught error:', error);
        return { success: false, error };
    }
};
