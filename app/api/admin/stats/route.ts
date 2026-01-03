import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
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
        const range = searchParams.get("range") || "all";

        let dateFilter: any = {};
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));

        if (range === "today") {
            dateFilter = { createdAt: { $gte: startOfDay } };
        } else if (range === "7d") {
            const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
            dateFilter = { createdAt: { $gte: sevenDaysAgo } };
        } else if (range === "30d") {
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
        }

        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments(); // Keeping total users for now, typically "Total Customers"
        const totalOrders = await Order.countDocuments(dateFilter);

        // Sum total revenue from all orders in range
        const orders = await Order.find({ ...dateFilter, status: { $ne: "Cancelled" } });
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        // Get recent orders (top 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        return NextResponse.json({
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue,
            },
            recentOrders,
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
