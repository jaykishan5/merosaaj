"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Tag, Calendar, Users, DollarSign, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, formatDate } from "@/lib/utils";

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxUses?: number;
    usedCount: number;
    usesPerUser: number;
    expiresAt: string;
    isActive: boolean;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState<Partial<Coupon>>({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: 0,
        usesPerUser: 1,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/admin/coupons");
            const data = await res.json();
            if (res.ok) setCoupons(data);
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = currentCoupon._id ? "PUT" : "POST";
            const body = currentCoupon._id
                ? { id: currentCoupon._id, ...currentCoupon }
                : currentCoupon;

            const res = await fetch("/api/admin/coupons", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(currentCoupon._id ? "Coupon updated" : "Coupon created");
                setIsModalOpen(false);
                fetchCoupons();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to save coupon");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Coupon deleted");
                fetchCoupons();
            }
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    const toggleStatus = async (coupon: Coupon) => {
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: coupon._id, isActive: !coupon.isActive }),
            });
            if (res.ok) fetchCoupons();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading && coupons.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Coupons</h1>
                        <p className="text-muted-foreground text-sm font-medium">Manage promotional discount codes for your customers.</p>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentCoupon({
                                code: "",
                                discountType: "percentage",
                                discountValue: 0,
                                minOrderAmount: 0,
                                usesPerUser: 1,
                                isActive: true,
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Coupon
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                            <div key={coupon._id} className="bg-card border border-border p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-black/5">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${coupon.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Tag className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-2xl tracking-tighter uppercase group-hover:text-primary transition-colors">{coupon.code}</h3>
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <span className="flex items-center gap-2 border-r border-border pr-6 last:border-0 last:pr-0">
                                                <DollarSign className="w-3.5 h-3.5 text-primary" />
                                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `${formatPrice(coupon.discountValue)} OFF`}
                                            </span>
                                            <span className="flex items-center gap-2 border-r border-border pr-6 last:border-0 last:pr-0">
                                                <Users className="w-3.5 h-3.5 text-primary" /> {coupon.usedCount} / {coupon.maxUses || '∞'} Uses
                                            </span>
                                            <span className="flex items-center gap-2 border-r border-border pr-6 last:border-0 last:pr-0">
                                                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Exp: {formatDate(coupon.expiresAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-6 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-0 md:translate-x-4">
                                    <button
                                        onClick={() => toggleStatus(coupon)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${coupon.isActive ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                        title={coupon.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {coupon.isActive ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentCoupon({
                                                ...coupon,
                                                expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0]
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="w-12 h-12 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="w-12 h-12 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-card border border-border/50 rounded-[3rem] p-24 text-center">
                            <Tag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">No coupons found</h3>
                            <p className="text-xs text-muted-foreground/60 mt-2">Create your first promotion to boost sales.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-zinc-900">{currentCoupon._id ? "Edit" : "New"} Coupon</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Coupon Code - Full Width */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Coupon Code</label>
                                <input
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase font-semibold text-zinc-900 placeholder:text-zinc-300 placeholder:normal-case"
                                    placeholder="e.g. NEWYEAR20"
                                    value={currentCoupon.code}
                                    onChange={e => setCurrentCoupon({ ...currentCoupon, code: e.target.value })}
                                />
                            </div>

                            {/* Discount Type & Value - Side by Side */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Type</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900 cursor-pointer"
                                        value={currentCoupon.discountType}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value as any })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (Rs.)</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900"
                                        value={currentCoupon.discountValue}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Min Order & Expiry Date - Side by Side */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Min Order (Rs.)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900"
                                        value={currentCoupon.minOrderAmount}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, minOrderAmount: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900"
                                        value={currentCoupon.expiresAt}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Max Uses & Uses Per User - Side by Side */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Max Uses</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Unlimited"
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900 placeholder:text-zinc-300"
                                        value={currentCoupon.maxUses || ""}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, maxUses: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Per User Limit</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-zinc-900"
                                        value={currentCoupon.usesPerUser}
                                        onChange={e => setCurrentCoupon({ ...currentCoupon, usesPerUser: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3.5 rounded-lg font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
                            >
                                {loading ? "Saving..." : (currentCoupon._id ? "Update Coupon" : "Create Coupon")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
