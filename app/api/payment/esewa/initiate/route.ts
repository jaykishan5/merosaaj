import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initiateEsewaPayment } from "@/lib/payment";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { amount, transactionId } = await req.json();

        if (!amount || !transactionId) {
            return NextResponse.json({ message: "Amount and Transaction ID are required" }, { status: 400 });
        }

        const esewaData = initiateEsewaPayment(amount, transactionId);

        return NextResponse.json(esewaData);
    } catch (error: any) {
        console.error("eSewa Initiation Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
