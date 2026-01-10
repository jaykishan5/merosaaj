"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice, formatDate } from "@/lib/utils";
import { TableSkeleton } from "@/components/AdminSkeletons";
import { Check, X, RefreshCw } from "lucide-react";

export default function AdminReturnsPage() {
    const { data: session, status }: any = useSession();
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchReturns();
        }
    }, [status, session]);

    const fetchReturns = async () => {
        try {
            const res = await fetch("/api/admin/returns");
            if (res.ok) {
                const data = await res.json();
                setReturns(data);
            }
        } catch (error) {
            console.error("Failed to fetch returns", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/returns", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                fetchReturns();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <TableSkeleton />;

    return (
        <div className="p-8 lg:p-12">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Returns Management</h1>
            <p className="text-muted-foreground mb-10">Handle customer return requests and refunds.</p>

            <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Request ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reasons</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {returns.map((req) => (
                                <tr key={req._id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-8 py-6 font-mono text-xs font-bold text-muted-foreground">
                                        #{req._id.substring(0, 8).toUpperCase()}
                                        <div className="text-[10px] font-normal opacity-70 mt-1">{formatDate(req.createdAt)}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-sm">{req.user?.name}</div>
                                        <div className="text-xs text-muted-foreground">{req.user?.email}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-muted px-2 py-1 rounded text-xs font-mono">#{req.order?._id.substring(0, 8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-8 py-6 text-xs max-w-xs truncate">
                                        {req.items.map((item: any, idx: number) => (
                                            <div key={idx} className="mb-1">
                                                <span className="font-bold">{item.product?.name || "Item"}</span>: {item.reason}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                                            ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                                    req.status === 'Refunded' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'}`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {req.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(req._id, 'Approved')}
                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(req._id, 'Rejected')}
                                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {req.status === 'Approved' && (
                                            <button
                                                onClick={() => updateStatus(req._id, 'Refunded')}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                                            >
                                                <RefreshCw className="w-3 h-3" /> Process Refund
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {returns.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center text-muted-foreground font-black text-xs uppercase tracking-widest">
                                        No active return requests
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
