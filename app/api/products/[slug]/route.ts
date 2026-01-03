import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();
        const { slug } = params;

        // Handle both ID and Slug
        let product;
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(slug).lean();
        } else {
            product = await Product.findOne({ slug }).lean();
        }

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const { slug } = params;
        const data = await req.json();

        let product;
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndUpdate(slug, data, { new: true });
        } else {
            product = await Product.findOneAndUpdate({ slug }, data, { new: true });
        }

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const { slug } = params;

        let product;
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndDelete(slug);
        } else {
            product = await Product.findOneAndDelete({ slug });
        }

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
