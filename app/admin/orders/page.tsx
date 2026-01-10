"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

import { TableSkeleton } from "@/components/AdminSkeletons";
import OrderDetailsModal from "@/components/OrderDetailsModal";

export default function AdminOrdersPage() {
    const { data: session, status }: any = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchOrders();
        }
    }, [status, session]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status }),
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const filteredOrders = Array.isArray(orders)
        ? (orders as any[]).filter(o => filterStatus === "All" || o.status === filterStatus)
        : [];

    const statusCounts = orders.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return <TableSkeleton />;
    }

    const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    return (
        <div className="p-8 lg:p-12">
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isDetailsOpen}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setSelectedOrder(null);
                }}
                onOrderUpdated={fetchOrders}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Order Management</h1>
                    <p className="text-muted-foreground mt-1">Review and manage customer orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchOrders}
                        className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
                        title="Refresh Data"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <div className="text-[10px] font-black bg-primary/10 text-primary px-4 py-3 rounded-2xl border border-primary/20 uppercase tracking-widest">
                        {orders.length} Total Orders
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => {
                    const count = tab === "All" ? orders.length : (statusCounts[tab] || 0);
                    const isActive = filterStatus === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setFilterStatus(tab)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${isActive
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                }`}
                        >
                            {tab}
                            <span className={`px-2 py-0.5 rounded-full text-[8px] ${isActive ? "bg-primary-foreground/20" : "bg-muted"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Payment</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground">
                                            #{order._id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{order.user?.name || "Guest Customer"}</span>
                                            <span className="text-xs text-muted-foreground">{order.user?.email || "No email"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-medium text-muted-foreground">{formatDate(order.createdAt)}</td>
                                    <td className="px-8 py-6 text-sm font-black">{formatPrice(order.totalPrice)}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block w-fit ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {order.isPaid ? 'PAID' : 'PENDING'}
                                            </span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{order.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className={`text-[10px] font-black uppercase tracking-widest border rounded-xl px-3 py-2 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setIsDetailsOpen(true);
                                                }}
                                                className="px-4 py-2 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No orders found for "{filterStatus}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
