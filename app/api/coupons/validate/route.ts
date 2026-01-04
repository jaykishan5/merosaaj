import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { code, amount } = await req.json();

        if (!code) {
            return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
        }

        await dbConnect();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) {
            return NextResponse.json({ message: "Invalid or expired coupon" }, { status: 404 });
        }

        // Check minimum order amount
        if (amount < coupon.minOrderAmount) {
            return NextResponse.json({
                message: `Minimum order amount for this coupon is NPR ${coupon.minOrderAmount.toLocaleString()}`
            }, { status: 400 });
        }

        // Check total usage limit
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ message: "This coupon has reached its usage limit" }, { status: 400 });
        }

        // Check usage per user
        const userUsageCount = await Order.countDocuments({
            user: session.user.id,
            couponCode: coupon.code,
            isPaid: true // Assuming we only count paid orders or successfully placed ones
        });

        if (userUsageCount >= coupon.usesPerUser) {
            return NextResponse.json({ message: "You have already used this coupon" }, { status: 400 });
        }

        return NextResponse.json({
            message: "Coupon applied successfully",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}
