import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Bundle from "@/models/Bundle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (slug) {
            const bundle = await Bundle.findOne({ slug }).populate("products.product");
            if (!bundle) return NextResponse.json({ message: "Bundle not found" }, { status: 404 });
            return NextResponse.json(bundle);
        }

        const bundles = await Bundle.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json(bundles);
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

        const bundle = await Bundle.create({
            ...data,
            slug: data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        });

        return NextResponse.json(bundle, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
