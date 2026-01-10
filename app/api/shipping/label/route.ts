import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import dbConnect from "@/lib/mongodb";
import { generateShippingLabel } from "@/lib/shipping";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { orderId } = await req.json();

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const labelData = await generateShippingLabel(order);

        order.trackingNumber = labelData.trackingNumber;
        order.carrier = labelData.carrier;
        order.shippingLabelUrl = labelData.labelUrl;
        order.status = 'Shipped'; // Auto update status?
        await order.save();

        return NextResponse.json({ message: "Label generated", ...labelData });

    } catch (error) {
        console.error("Label generation error:", error);
        return NextResponse.json({ error: "Failed to generate label" }, { status: 500 });
    }
}
