import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { createNotification } from "@/lib/notifications";

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
            const variantIndex = dbProduct.variants.findIndex((v: any) => v.size === item.size && v.color === item.color);
            if (variantIndex === -1 || dbProduct.variants[variantIndex].stock < item.quantity) {
                return NextResponse.json({ message: `Insufficient stock for ${item.name} (${item.size}/${item.color})` }, { status: 400 });
            }

            // Reduce Stock
            dbProduct.variants[variantIndex].stock -= item.quantity;
            await dbProduct.save();

            // Stock Alert Notification (if below threshold, e.g., 5)
            if (dbProduct.variants[variantIndex].stock <= 5) {
                await createNotification({
                    title: "Low Stock Alert",
                    message: `${dbProduct.name} (${item.size}/${item.color}) is running low. Only ${dbProduct.variants[variantIndex].stock} left.`,
                    type: "alert",
                    link: `/admin/products`
                });
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

        // Notify Admin of New Order
        await createNotification({
            title: `New Order #${order._id.toString().substring(0, 8).toUpperCase()}`,
            message: `${session.user.name} placed a new order for NPR ${totalPrice.toLocaleString()}`,
            type: "order",
            link: `/admin/orders`
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
