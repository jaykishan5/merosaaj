import crypto from 'crypto';

/**
 * eSewa Payment Integration
 */
export const initiateEsewaPayment = (amount: number, transactionId: string) => {
    const secret = process.env.ESEWA_SECRET_KEY || '8g8M89&pk9B9H698'; // Sandbox default
    const merchantCode = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';

    // Signature logic for eSewa (v2)
    const signatureData = `total_amount=${amount},transaction_uuid=${transactionId},product_code=${merchantCode}`;
    const signature = crypto
        .createHmac('sha256', secret)
        .update(signatureData)
        .digest('base64');

    return {
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid: transactionId,
        product_code: merchantCode,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/esewa/success`,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    };
};

/**
 * Khalti Payment Integration
 */
export const initiateKhaltiPayment = async (amount: number, purchase_order_id: string, purchase_order_name: string) => {
    const url = 'https://a.khalti.com/api/v2/epayment/initiate/';
    const secretKey = process.env.KHALTI_SECRET_KEY;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Key ${secretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/khalti/callback`,
            website_url: process.env.NEXT_PUBLIC_BASE_URL,
            amount: amount * 100, // Khalti expects paisa
            purchase_order_id,
            purchase_order_name,
        }),
    });

    return await res.json();
};
