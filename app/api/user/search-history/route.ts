import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return NextResponse.json([]);

        await dbConnect();
        const user = await User.findById(session.user.id);
        return NextResponse.json(user?.searchHistory || []);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        const { term } = await req.json();
        if (!term) return NextResponse.json({ message: "Term required" }, { status: 400 });

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        // Update history: newer items at front, limit to 10, ensure uniqueness
        let history = user.searchHistory || [];
        history = [term, ...history.filter((h: string) => h !== term)].slice(0, 10);

        user.searchHistory = history;
        await user.save();

        return NextResponse.json(history);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
