import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (slug) {
            const collection = await Collection.findOne({ slug }).populate("products");
            if (!collection) return NextResponse.json({ message: "Collection not found" }, { status: 404 });
            return NextResponse.json(collection);
        }

        const collections = await Collection.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json(collections);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        const collection = await Collection.create({
            ...data,
            slug: data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        });

        return NextResponse.json(collection, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
