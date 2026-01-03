import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { name, image, phone } = await req.json();

        await dbConnect();
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { name, image, phone },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully", user });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to update profile" }, { status: 500 });
    }
}
