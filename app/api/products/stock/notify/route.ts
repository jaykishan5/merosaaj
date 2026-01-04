import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import StockNotification from "@/models/StockNotification";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        const { productId, size, color, email } = await req.json();

        if (!productId || !size || !color || !email) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Check if already exists
        const existing = await StockNotification.findOne({
            email,
            product: productId,
            'variant.size': size,
            'variant.color': color,
            isNotified: false
        });

        if (existing) {
            return NextResponse.json({ message: "You are already on the notification list!" });
        }

        await StockNotification.create({
            user: session?.user?.id,
            email,
            product: productId,
            variant: { size, color },
        });

        return NextResponse.json({ message: "Notification request saved. We will email you when it's back!" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
