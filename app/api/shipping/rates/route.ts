import { NextRequest, NextResponse } from "next/server";
import { getShippingRates } from "@/lib/shipping";

export async function POST(req: NextRequest) {
    try {
        const { address, items } = await req.json();

        if (!address || !items) {
            return NextResponse.json({ error: "Missing address or items" }, { status: 400 });
        }

        const rates = await getShippingRates(address, items);
        return NextResponse.json(rates);
    } catch (error) {
        console.error("Shipping rates error:", error);
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
