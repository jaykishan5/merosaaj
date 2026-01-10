import { NextRequest, NextResponse } from "next/server";
import ReturnRequest from "@/models/ReturnRequest";
import Order from "@/models/Order";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { orderId, items } = await req.json();

        const order = await Order.findOne({ _id: orderId, user: session.user.id });
        if (!order) {
            return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
        }

        if (order.status !== 'Delivered') {
            return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
        }

        // Calculate potential refund amount (simple logic for now)
        // In real app, check if item exists in order and calc price
        let refundAmount = 0;
        // Verify items are in order (omitted for brevity, assume valid for now or add logic)

        // Check if return request already exists
        const existingReturn = await ReturnRequest.findOne({ order: orderId });
        if (existingReturn) {
            return NextResponse.json({ error: "Return request already exists for this order" }, { status: 400 });
        }

        const returnRequest = await ReturnRequest.create({
            user: session.user.id,
            order: orderId,
            items,
            refundAmount: 0, // Admin calculates or auto-calc based on items
            status: 'Pending'
        });

        return NextResponse.json(returnRequest, { status: 201 });

    } catch (error) {
        console.error("Return request error:", error);
        return NextResponse.json({ error: "Failed to create return request" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');

        const query: any = { user: session.user.id };
        if (orderId) {
            query.order = orderId;
        }

        const returns = await ReturnRequest.find(query);
        return NextResponse.json(returns);

    } catch (error) {
        console.error("Fetch returns error:", error);
        return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 });
    }
}
