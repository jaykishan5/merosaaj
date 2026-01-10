import { NextRequest, NextResponse } from "next/server";
import ReturnRequest from "@/models/ReturnRequest";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const returns = await ReturnRequest.find({})
            .populate('user', 'name email')
            .populate('order', '_id createdAt totalPrice')
            .populate('items.product', 'name price image') // content projection if product model allows
            .sort({ createdAt: -1 });

        return NextResponse.json(returns);

    } catch (error) {
        console.error("Fetch returns error:", error);
        return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id, status, refundAmount, adminComment } = await req.json();

        const returnRequest = await ReturnRequest.findByIdAndUpdate(
            id,
            { status, refundAmount, adminComment },
            { new: true }
        );

        if (!returnRequest) {
            return NextResponse.json({ error: "Return request not found" }, { status: 404 });
        }

        return NextResponse.json(returnRequest);

    } catch (error) {
        console.error("Update return error:", error);
        return NextResponse.json({ error: "Failed to update return request" }, { status: 500 });
    }
}
