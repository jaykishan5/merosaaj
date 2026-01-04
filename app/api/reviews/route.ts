import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Please sign in to write a review" }, { status: 401 });
        }

        await dbConnect();
        const { productId, rating, comment, images } = await req.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const review = await Review.create({
            product: productId,
            user: {
                name: session.user.name,
                email: session.user.email,
            },
            rating,
            comment,
            images: images || [],
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ message: "Product ID required" }, { status: 400 });
        }

        await dbConnect();
        const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
