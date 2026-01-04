import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();

        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(notifications);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();

        await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });

        return NextResponse.json({ message: "All notifications marked as read" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
