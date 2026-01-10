import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();

        // Find order by ID and populate user info
        const order = await Order.findById(params.id).populate("user", "name email");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Security check: Only return order if user is owner or an ADMIN
        const isOwner = order.user?._id.toString() === session.user.id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Fetch Order Error:", error);
        return NextResponse.json({ message: "Failed to fetch order details" }, { status: 500 });
    }
}
