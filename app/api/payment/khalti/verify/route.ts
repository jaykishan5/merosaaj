import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const { pidx, status, purchase_order_id, transaction_id } = await req.json();

        if (status !== 'Completed') {
            return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
        }

        // Verify pidx with Khalti API
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
                order.isPaid = true;
                order.paidAt = new Date();
                order.status = 'Processing';
                order.paymentResult = {
                    id: transaction_id,
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

                return NextResponse.json({ message: "Payment verified successfully" });
            }
        }

        return NextResponse.json({ message: "Verification failed" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
