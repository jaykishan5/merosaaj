"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowRight,
    Loader2
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

import { DashboardSkeleton } from "@/components/AdminSkeletons";

export default function AdminDashboardPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("all");

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchStats();
        }
    }, [status, session, range]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/stats?range=${range}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    const { stats, recentOrders } = data;

    const statCards = [
        {
            title: "Total Revenue",
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/admin/orders",
            description: "Total earnings from non-cancelled orders"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/admin/orders",
            description: "Number of orders placed"
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            href: "/admin/products",
            description: "Active items in your inventory"
        },
        {
            title: "Active Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/admin/users",
            description: "Registered customer accounts"
        },
    ];

    const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="p-8 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Command Center</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-muted-foreground">Overview of your business performance and activity.</p>
                        <span className="w-1 h-1 rounded-full bg-border md:block hidden" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary hidden md:block">Last updated: {lastUpdated}</p>
                    </div>
                </div>

                {/* Date Range Filter Placeholder */}
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
                    {[
                        { label: 'Today', value: 'today' },
                        { label: '7D', value: '7d' },
                        { label: '30D', value: '30d' },
                        { label: 'All', value: 'all' }
                    ].map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setRange(period.value)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${range === period.value
                                ? 'bg-card text-primary shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-border scale-105'
                                : 'text-muted-foreground hover:text-primary hover:bg-card/30'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        onClick={() => router.push(card.href)}
                        className="text-left bg-card p-6 md:p-8 rounded-[2.5rem] border border-border hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-500 group relative overflow-hidden cursor-pointer active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <card.icon className="w-7 h-7" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-4">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">{card.title}</p>
                            <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors italic leading-none">{card.value}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-[0.1em]">{card.description}</p>
                        </div>
                        <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 ${card.bg}`} />
                    </div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black uppercase italic">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground">Latest transactions from your customers.</p>
                    </div>
                    <button
                        onClick={() => router.push("/admin/orders")}
                        className="flex items-center text-xs font-black text-primary hover:underline group uppercase tracking-widest"
                    >
                        View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/orders`)}>
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground">#{order._id.substring(0, 8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{order.user?.name || "Guest Customer"}</span>
                                            <span className="text-xs text-muted-foreground">{order.user?.email || "No email"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-sm">{formatPrice(order.totalPrice)}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-sm font-medium text-muted-foreground">{formatDate(order.createdAt)}</span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No recent orders found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
