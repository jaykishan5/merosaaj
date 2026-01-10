import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initiateKhaltiPayment } from "@/lib/payment";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { amount, transactionId, orderName } = await req.json();

        if (!amount || !transactionId) {
            return NextResponse.json({ message: "Amount and Transaction ID are required" }, { status: 400 });
        }

        const khaltiData = await initiateKhaltiPayment(
            amount,
            transactionId,
            orderName || `Order #${transactionId.substring(0, 8)}`
        );

        if (khaltiData.payment_url) {
            return NextResponse.json(khaltiData);
        } else {
            return NextResponse.json({ message: khaltiData.detail || "Failed to initiate Khalti payment" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Khalti Initiation Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
