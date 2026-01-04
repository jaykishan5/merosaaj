import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import StockNotification from "@/models/StockNotification";
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

        // Get old product for stock comparison
        const oldProduct = await Product.findById(slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null) ||
            await Product.findOne({ slug });

        let product;
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndUpdate(slug, data, { new: true });
        } else {
            product = await Product.findOneAndUpdate({ slug }, data, { new: true });
        }

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Replenishment Trigger
        if (oldProduct && product.variants) {
            for (const variant of product.variants) {
                const oldVariant = oldProduct.variants.find((v: any) => v.size === variant.size && v.color === variant.color);
                const oldStock = oldVariant ? oldVariant.stock : 0;

                if (variant.stock > 0 && oldStock === 0) {
                    // Stock replenished! Find interested users
                    const notifications = await StockNotification.find({
                        product: product._id,
                        'variant.size': variant.size,
                        'variant.color': variant.color,
                        isNotified: false
                    });

                    if (notifications.length > 0) {
                        // In a real app, we'd loop and send emails. 
                        // For now, we'll log it and mark as notified.
                        console.log(`📣 Notifying ${notifications.length} users about ${product.name} replenishment.`);
                        await StockNotification.updateMany(
                            { _id: { $in: notifications.map((n: any) => n._id) } },
                            { isNotified: true }
                        );
                    }
                }
            }
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
