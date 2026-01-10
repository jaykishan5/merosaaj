import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";
import Papa from "papaparse";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const products = await Product.find({}).lean();

        // Flatten products for CSV
        const flatProducts = products.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.variants.reduce((acc: number, v: any) => acc + v.stock, 0),
            images: p.images.join(', '),
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : ''
        }));

        const csv = Papa.unparse(flatProducts);

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });

    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
