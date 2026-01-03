import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const users = await User.find().sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { userId, role } = await req.json();

        await dbConnect();

        // Prevent deleting the last admin or self-demotion if necessary
        // For now, simple update
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID required" }, { status: 400 });
        }

        await dbConnect();

        // Prevent deleting self
        if (session.user.id === userId) {
            return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
