import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ message: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json(notification);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
