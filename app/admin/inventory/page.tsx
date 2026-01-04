"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Package, AlertTriangle, Clock, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function InventoryReportPage() {
    const { data: session, status }: any = useSession();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetch("/api/products")
                .then(res => res.json())
                .then(data => {
                    setProducts(data);
                    setLoading(false);
                });
        }
    }, [status, session]);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );

    const stats = {
        totalItems: products.reduce((acc, p) => acc + p.variants.reduce((vAcc: number, v: any) => vAcc + v.stock, 0), 0),
        outOfStock: products.filter(p => p.variants.every((v: any) => v.stock === 0)).length,
        lowStock: products.filter(p => {
            const total = p.variants.reduce((vAcc: number, v: any) => vAcc + v.stock, 0);
            return total > 0 && total < 10;
        }).length,
        preOrders: products.filter(p => p.allowPreOrder).length,
        totalValue: products.reduce((acc, p) => acc + (p.price * p.variants.reduce((vAcc: number, v: any) => vAcc + v.stock, 0)), 0)
    };

    return (
        <div className="p-8 lg:p-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Inventory Report</h1>
                <p className="text-muted-foreground mt-1">Strategic overview of your stock health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Total Asset Value", value: formatPrice(stats.totalValue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Critical Stock", value: stats.outOfStock, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", sub: "Out of Stock" },
                    { label: "Low Stock Items", value: stats.lowStock, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", sub: "Below 10 units" },
                    { label: "Active Pre-orders", value: stats.preOrders, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", sub: "Growth Items" }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-[2.5rem] shadow-sm">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black italic">{stat.value}</h3>
                        {stat.sub && <p className="text-[10px] font-bold text-muted-foreground mt-1">{stat.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Critical Items */}
                <div className="bg-card border border-border p-8 rounded-[3rem]">
                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        Critical Inventory
                    </h3>
                    <div className="space-y-4">
                        {products.filter(p => p.variants.reduce((acc: number, v: any) => acc + v.stock, 0) < 10).slice(0, 5).map(p => (
                            <Link key={p._id} href={`/admin/products/edit/${p._id}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-transparent hover:border-rose-500/20 hover:bg-muted transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted border border-border overflow-hidden">
                                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black italic">{p.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {p.variants.reduce((acc: number, v: any) => acc + v.stock, 0)} Units Left
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Pre-order Overview */}
                <div className="bg-card border border-border p-8 rounded-[3rem]">
                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Pre-order Strategy
                    </h3>
                    <div className="space-y-4">
                        {products.filter(p => p.allowPreOrder).slice(0, 5).map(p => (
                            <div key={p._id} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted border border-border overflow-hidden">
                                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black italic">{p.name}</p>
                                        {p.releaseDate && (
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                                                Drops: {new Date(p.releaseDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[8px] font-black px-2 py-1 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 uppercase tracking-widest">Active</span>
                            </div>
                        ))}
                        {stats.preOrders === 0 && (
                            <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-[2rem]">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">No pre-orders active</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
