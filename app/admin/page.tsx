"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    ArrowRight,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { SalesAreaChart, TopProductsBarChart, CategoryPieChart } from "@/components/admin/AnalyticsCharts";
import { DashboardSkeleton } from "@/components/AdminSkeletons";

export default function AdminDashboardPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("7d");

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchStats();
        }
    }, [status, session, range]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/analytics?range=${range}`);
            const result = await res.json();

            // If API fails or returns error, fallback to empty structure to prevent crash
            if (!res.ok) {
                setData({ stats: {}, salesChart: [], bestSellers: [], categoryData: [] });
            } else {
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
            setData({ stats: {}, salesChart: [], bestSellers: [], categoryData: [] });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    const { stats, salesChart, bestSellers, categoryData } = data || {};
    // Fallback values if stats is undefined
    const totalRevenue = stats?.totalRevenue || 0;
    const totalOrders = stats?.totalOrders || 0;
    const totalProducts = stats?.totalProducts || 0;
    const totalUsers = stats?.totalUsers || 0;


    const statCards = [
        {
            title: "Total Revenue",
            value: formatPrice(totalRevenue),
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/admin/orders",
            description: "Total earnings in period"
        },
        {
            title: "Total Orders",
            value: totalOrders,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/admin/orders",
            description: "Orders placed in period"
        },
        {
            title: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            href: "/admin/products",
            description: "Active items in inventory"
        },
        {
            title: "New Users",
            value: totalUsers,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/admin/users",
            description: "New accounts in period"
        },
    ];

    const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Command Center</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-muted-foreground">Overview of your business performance and activity.</p>
                        <span className="w-1 h-1 rounded-full bg-border md:block hidden" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary hidden md:block">Last updated: {lastUpdated}</p>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm self-start md:self-auto">
                    {[
                        { label: 'Today', value: 'today' },
                        { label: '7D', value: '7d' },
                        { label: '30D', value: '30d' },
                        { label: 'All', value: 'all' }
                    ].map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setRange(period.value)}
                            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${range === period.value
                                ? 'bg-card text-primary shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-primary hover:bg-card/30'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        onClick={() => router.push(card.href)}
                        className="text-left bg-card p-6 md:p-8 rounded-[2rem] border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-500 group relative overflow-hidden cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-4">
                                <ArrowRight className="w-3 h-3 text-primary" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{card.title}</p>
                            <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors italic leading-none">{card.value}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-[0.1em]">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart - Takes up 2 columns */}
                <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-[2rem] border border-border">
                    <SalesAreaChart data={salesChart} />
                </div>

                {/* Category Pie Chart */}
                <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-border">
                    <CategoryPieChart data={categoryData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Products */}
                <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-[2rem] border border-border">
                    <TopProductsBarChart data={bestSellers} />
                </div>

                {/* Quick Actions / Insights Placeholder */}
                <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-border flex flex-col justify-center items-center text-center">
                    <div className="mb-4 text-4xl">💡</div>
                    <h3 className="font-bold text-lg mb-2">Insights</h3>
                    <p className="text-sm text-muted-foreground">
                        {totalOrders > 0
                            ? "Your store is active! specific trends will appear here as more data is collected."
                            : "No orders yet. Start marketing your products to see sales data!"
                        }
                    </p>
                </div>
            </div>

        </div>
    );
}

