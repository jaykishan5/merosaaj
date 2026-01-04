import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        await dbConnect();

        // Find order by ID and verify email matches the shipping address
        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Security check: Only return order if email matches
        if (order.shippingAddress.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json({ message: "Order not found for this email" }, { status: 404 });
        }

        // Return the order data (we can filter fields if needed for privacy, 
        // but since they have the ID and Email, they are authorized to see this specific order)
        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to track order" }, { status: 500 });
    }
}
