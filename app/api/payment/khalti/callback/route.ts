import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get("pidx");
    const purchase_order_id = searchParams.get("purchase_order_id");
    const status = searchParams.get("status");

    if (!pidx || !purchase_order_id) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=missing_data`);
    }

    if (status !== 'Completed') {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=payment_not_completed`);
    }

    try {
        // Verify with Khalti API
        const verifyRes = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pidx }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status === 'Completed') {
            await dbConnect();
            const order = await Order.findById(purchase_order_id);

            if (order) {
                // Update order status if not already updated by the server-side verify endpoint
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    order.status = 'Processing';
                    order.paymentResult = {
                        id: verifyData.transaction_id || pidx,
                        status: 'Completed',
                        update_time: new Date().toISOString(),
                        email_address: verifyData.user?.email || '',
                    };
                    await order.save();

                    // Notify Admin
                    await createNotification({
                        title: "Payment Confirmed",
                        message: `Order #${order._id.toString().substring(0, 8).toUpperCase()} has been paid via Khalti.`,
                        type: "order",
                        link: "/admin/orders"
                    });
                }

                // Redirect to success page
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${order._id}?success=true`);
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=verification_failed`);
    } catch (error: any) {
        console.error("Khalti Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=server_error`);
    }
}
