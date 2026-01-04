import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "7d";

        // Calculate date range
        const now = new Date();
        const past = new Date();

        if (range === 'today') {
            past.setHours(0, 0, 0, 0);
        } else if (range === '7d') {
            past.setDate(now.getDate() - 7);
        } else if (range === '30d') {
            past.setDate(now.getDate() - 30);
        } else {
            // All time - set to thorough past
            past.setFullYear(2000);
        }

        const dateFilter = { createdAt: { $gte: past } };
        const paidOrderFilter = { ...dateFilter, status: { $ne: 'Cancelled' } };

        // 1. Sales Overview (Chart Data)
        // Group by day for the chart
        const salesData = await Order.aggregate([
            { $match: paidOrderFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Best Selling Products
        // Unwind order items and aggregate
        const bestSellers = await Order.aggregate([
            { $match: paidOrderFilter },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    sold: { $sum: "$orderItems.quantity" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            },
            { $sort: { sold: -1 } },
            { $limit: 5 }
        ]);

        // 3. Category Performance
        // This requires joining with products. 
        // Note: In a real large-scale app, we might denormalize category onto order items.
        // For now, we'll do a lookup.
        const categoryData = await Order.aggregate([
            { $match: paidOrderFilter },
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    value: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            }
        ]);

        // 4. Quick Stats
        const totalRevenueResult = await Order.aggregate([
            { $match: paidOrderFilter },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const totalOrders = await Order.countDocuments(dateFilter);
        const totalUsers = await User.countDocuments(dateFilter);
        const totalProducts = await Product.countDocuments(dateFilter); // Products added in this range? Or total active?
        // Usually stats cards show current total active state, regardless of date range, OR new items in range.
        // Let's do: Revenue/Orders/Users = in range. Products = Total active (always).

        const totalActiveProducts = await Product.countDocuments({});

        return NextResponse.json({
            stats: {
                totalRevenue: totalRevenueResult[0]?.total || 0,
                totalOrders,
                totalUsers,
                totalProducts: totalActiveProducts
            },
            salesChart: salesData.map(item => ({
                date: item._id,
                sales: item.sales,
                orders: item.orders
            })),
            bestSellers,
            categoryData: categoryData.map(item => ({
                name: item._id || "Uncategorized", // Handle missing categories
                value: item.value
            }))
        });

    } catch (error: any) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
