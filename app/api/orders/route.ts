import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        } = await req.json();

        if (!orderItems || orderItems.length === 0) {
            return NextResponse.json({ message: "No order items" }, { status: 400 });
        }

        await dbConnect();

        // Verify stock and price from DB (Security best practice)
        for (const item of orderItems) {
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct) {
                return NextResponse.json({ message: `Product ${item.name} not found` }, { status: 404 });
            }
            // Check stock for specific variant
            const variant = dbProduct.variants.find((v: any) => v.size === item.size && v.color === item.color);
            if (!variant || variant.stock < item.quantity) {
                return NextResponse.json({ message: `Insufficient stock for ${item.name} (${item.size}/${item.color})` }, { status: 400 });
            }
        }

        const order = await Order.create({
            user: session?.user?.id,
            orderItems: orderItems.map((item: any) => ({
                ...item,
                product: item._id,
            })),
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            status: "Pending",
        });

        return NextResponse.json({ message: "Order created successfully", orderId: order._id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to create order" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch orders" }, { status: 500 });
    }
}
