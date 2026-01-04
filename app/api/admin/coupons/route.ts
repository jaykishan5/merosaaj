import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch coupons" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const coupon = await Coupon.create(body);
        return NextResponse.json(coupon, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to create coupon" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { id, ...updateData } = await req.json();
        await dbConnect();

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        if (!coupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to update coupon" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await dbConnect();
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Coupon deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to delete coupon" }, { status: 500 });
    }
}
