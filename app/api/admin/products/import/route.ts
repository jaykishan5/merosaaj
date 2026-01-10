import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const csvText = await file.text();

        const parseResult = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (parseResult.errors.length > 0) {
            return NextResponse.json({ error: "CSV parsing error", details: parseResult.errors }, { status: 400 });
        }

        const records = parseResult.data as any[];
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const record of records) {
            try {
                // strict validation or mapping
                if (!record.name || !record.price || !record.category) {
                    results.failed++;
                    results.errors.push(`Missing required fields for row: ${JSON.stringify(record)}`);
                    continue;
                }

                // Basic mapping - assume CSV headers match model or we map them
                // For simplicity, we assume headers: name, slug, description, price, category, stock, images (comma sep)

                const productData = {
                    name: record.name,
                    slug: record.slug || record.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    description: record.description || "",
                    price: parseFloat(record.price),
                    category: record.category,
                    images: record.images ? record.images.split(',').map((s: string) => s.trim()) : [],
                    variants: [
                        {
                            size: 'Standard',
                            color: 'Default',
                            stock: parseInt(record.stock || '0')
                        }
                    ]
                };

                // Upsert based on slug
                await Product.findOneAndUpdate(
                    { slug: productData.slug },
                    productData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );

                results.success++;
            } catch (error: any) {
                results.failed++;
                results.errors.push(`Error saving ${record.name}: ${error.message}`);
            }
        }

        return NextResponse.json({ message: "Import completed", results });

    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
