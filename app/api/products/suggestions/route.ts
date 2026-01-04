import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        await dbConnect();

        const searchRegex = { $regex: query, $options: "i" };

        // 1. Get unique categories that match
        const categories = await Product.distinct("category", {
            category: searchRegex
        });

        // 2. Get top 3 products that match (prioritize name)
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { category: searchRegex }
            ]
        })
            .select("name slug images price discountPrice category")
            .limit(3);

        const suggestions = [
            ...categories.map(cat => ({ type: "category", text: cat })),
            ...products.map(p => ({
                type: "product",
                text: p.name,
                slug: p.slug,
                image: p.images[0],
                price: p.discountPrice || p.price,
                category: p.category
            }))
        ];

        return NextResponse.json(suggestions);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
