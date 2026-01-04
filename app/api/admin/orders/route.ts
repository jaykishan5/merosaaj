import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendEmail } from "@/lib/email";
import { getShippingUpdateTemplate } from "@/lib/email-templates";

export async function GET(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { orderId, status, isPaid, isDelivered } = await req.json();

        await dbConnect();
        const order = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const oldStatus = order.status;
        if (status) order.status = status;
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            if (isPaid) order.paidAt = new Date();
        }
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            if (isDelivered) order.deliveredAt = new Date();
        }

        await order.save();

        // Send Email if status changed
        if (status && status !== oldStatus && order.user?.email) {
            await sendEmail({
                to: order.user.email,
                subject: `Order ${status} - MeroSaaj`,
                html: getShippingUpdateTemplate(order),
            });
        }

        return NextResponse.json({ message: "Order updated successfully", order });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
