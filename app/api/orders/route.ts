import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import User from "@/models/User";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/email";
import { getOrderEmailTemplate } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        console.log("📦 Order API: Starting order creation...");

        const session: any = await getServerSession(authOptions);
        if (!session) {
            console.log("❌ Order API: Not authenticated");
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }
        console.log("✅ Order API: User authenticated:", session.user.email);

        const body = await req.json();
        console.log("📋 Order API: Request body received:", JSON.stringify(body, null, 2));

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            couponCode,
        } = body;

        if (!orderItems || orderItems.length === 0) {
            console.log("❌ Order API: No order items");
            return NextResponse.json({ message: "No order items" }, { status: 400 });
        }
        console.log("✅ Order API: Order items count:", orderItems.length);

        await dbConnect();
        console.log("✅ Order API: DB connected");

        let couponDiscount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            console.log("🎟️ Order API: Looking for coupon:", couponCode);
            appliedCoupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
                expiresAt: { $gt: new Date() }
            });

            if (appliedCoupon) {
                console.log("✅ Order API: Coupon found:", appliedCoupon.code);
                if (itemsPrice >= appliedCoupon.minOrderAmount) {
                    if (appliedCoupon.discountType === 'percentage') {
                        couponDiscount = (itemsPrice * appliedCoupon.discountValue) / 100;
                    } else {
                        couponDiscount = appliedCoupon.discountValue;
                    }
                    console.log("✅ Order API: Coupon discount calculated:", couponDiscount);
                }
            } else {
                console.log("⚠️ Order API: Coupon not found or expired");
            }
        }

        const expectedTotal = itemsPrice + shippingPrice - couponDiscount;
        console.log("💰 Order API: Expected total:", expectedTotal, "(items:", itemsPrice, "+ shipping:", shippingPrice, "- discount:", couponDiscount, ")");

        // Verify stock and price from DB
        for (const item of orderItems) {
            console.log("🔍 Order API: Checking product:", item._id, item.name);
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct) {
                console.log("❌ Order API: Product not found:", item._id);
                return NextResponse.json({ message: `Product ${item.name} not found` }, { status: 404 });
            }

            const variantIndex = dbProduct.variants.findIndex((v: any) => v.size === item.size && v.color === item.color);
            console.log("📦 Order API: Variant index:", variantIndex, "for size:", item.size, "color:", item.color);

            if (variantIndex === -1) {
                console.log("⚠️ Order API: Variant not found, checking allowPreOrder:", dbProduct.allowPreOrder);
                if (!dbProduct.allowPreOrder) {
                    return NextResponse.json({ message: `Variant not found for ${item.name} (${item.size}/${item.color})` }, { status: 400 });
                }
            } else {
                const hasStock = dbProduct.variants[variantIndex].stock >= item.quantity;
                console.log("📦 Order API: Stock check - has:", dbProduct.variants[variantIndex].stock, "needs:", item.quantity, "hasStock:", hasStock);

                if (!hasStock && !dbProduct.allowPreOrder) {
                    return NextResponse.json({ message: `Insufficient stock for ${item.name} (${item.size}/${item.color})` }, { status: 400 });
                }

                // Reduce Stock
                if (dbProduct.variants[variantIndex].stock > 0) {
                    const reduceBy = Math.min(dbProduct.variants[variantIndex].stock, item.quantity);
                    dbProduct.variants[variantIndex].stock -= reduceBy;
                    await dbProduct.save();
                    console.log("✅ Order API: Stock reduced by", reduceBy);
                }

                // Stock Alert
                if (dbProduct.variants[variantIndex].stock <= 5) {
                    try {
                        await createNotification({
                            title: "Low Stock Alert",
                            message: `${dbProduct.name} (${item.size}/${item.color}) is running low. Only ${dbProduct.variants[variantIndex].stock} left.`,
                            type: "alert",
                            link: `/admin/products`
                        });
                    } catch (notifyErr) {
                        console.error("⚠️ Stock notification error:", notifyErr);
                    }
                }
            }
        }

        // Map order items
        const mappedOrderItems = orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.discountPrice || item.price,
            product: item._id,
            size: item.size || 'One Size',
            color: item.color || 'Default',
        }));
        console.log("✅ Order API: Mapped order items:", JSON.stringify(mappedOrderItems, null, 2));

        console.log("📝 Order API: Creating order document...");
        const order = await Order.create({
            user: session?.user?.id,
            orderItems: mappedOrderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            couponCode: appliedCoupon?.code,
            couponDiscount: couponDiscount,
            totalPrice: expectedTotal,
            status: "Pending",
        });
        console.log("✅ Order API: Order created with ID:", order._id);

        // Increment coupon usage
        if (appliedCoupon) {
            appliedCoupon.usedCount += 1;
            await appliedCoupon.save();
            console.log("✅ Order API: Coupon usage incremented");
        }

        // Notify Admin (non-blocking)
        try {
            await createNotification({
                title: `New Order #${order._id.toString().substring(0, 8).toUpperCase()}`,
                message: `${session.user.name} placed a new order for NPR ${expectedTotal.toLocaleString()}`,
                type: "order",
                link: `/admin/orders`
            });
            console.log("✅ Order API: Admin notification sent");
        } catch (notifyErr) {
            console.error("⚠️ Order notification error:", notifyErr);
        }

        // Email (non-blocking)
        try {
            await sendEmail({
                to: session.user.email,
                subject: `Order Confirmed - #${order._id.toString().substring(0, 8).toUpperCase()}`,
                html: getOrderEmailTemplate(order),
            });
            console.log("✅ Order API: Email sent");
        } catch (emailErr) {
            console.error("⚠️ Order email error:", emailErr);
        }

        // Loyalty (non-blocking)
        try {
            const pointsEarned = Math.floor(expectedTotal / 100);
            await User.findByIdAndUpdate(session.user.id, {
                $inc: {
                    loyaltyPoints: pointsEarned,
                    lifetimeSpent: expectedTotal
                }
            });
            console.log(`✅ Loyalty: Awarded ${pointsEarned} points`);
        } catch (loyaltyErr) {
            console.error("⚠️ Loyalty update error:", loyaltyErr);
        }

        console.log("🎉 Order API: Order creation complete!");
        return NextResponse.json({ message: "Order created successfully", orderId: order._id }, { status: 201 });
    } catch (error: any) {
        console.error("❌ Order creation error:", error);
        console.error("❌ Error stack:", error.stack);
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
