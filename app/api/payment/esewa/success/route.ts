import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from "crypto";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get('data');

    if (!data) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=no_data`);
    }

    // eSewa sends base64 encoded JSON
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    const { transaction_uuid, total_amount, status, transaction_code } = decodedData;

    await dbConnect();
    const order = await Order.findById(transaction_uuid);

    if (!order) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=order_not_found`);
    }

    if (status === 'COMPLETE') {
        // In production, verify with eSewa verification API here
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'Processing';
        order.paymentResult = {
            id: transaction_code,
            status: status,
            update_time: new Date().toISOString(),
            email_address: '', // eSewa doesn't provide this directly in v2 success data
        };
        await order.save();

        // Notify Admin
        await createNotification({
            title: "Payment Confirmed",
            message: `Order #${order._id.toString().substring(0, 8).toUpperCase()} has been paid via eSewa.`,
            type: "order",
            link: "/admin/orders"
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${order._id}?success=true`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=failed`);
}
