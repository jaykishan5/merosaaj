"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 pb-32 pt-32 md:pt-48 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">YOUR BAG IS EMPTY</h1>
                    <p className="text-muted-foreground mb-12">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/shop" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition">
                        CONTINUE SHOPPING
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pb-24 pt-32 md:pt-48">
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">SHOPPING BAG ({items.length})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={`${item._id}-${item.size}-${item.color}`}
                                className="flex gap-6 pb-8 border-b border-border"
                            >
                                <div className="relative w-24 h-32 md:w-32 md:h-40 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg uppercase tracking-tight">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item._id, item.size, item.color)}
                                                className="p-2 text-muted-foreground hover:text-destructive transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 space-x-4">
                                            <span>SIZE: <strong className="text-primary">{item.size}</strong></span>
                                            <span>COLOR: <strong className="text-primary">{item.color}</strong></span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-border rounded-full p-1 bg-muted">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                className="p-1 hover:bg-background rounded-full transition"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.size, item.color, Math.min(item.stock, item.quantity + 1))}
                                                className="p-1 hover:bg-background rounded-full transition"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="text-lg font-bold">
                                            {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-muted p-8 rounded-3xl sticky top-24">
                            <h3 className="text-lg font-bold mb-6 uppercase tracking-tight">ORDER SUMMARY</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">SUBTOTAL</span>
                                    <span className="font-bold">{formatPrice(totalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">SHIPPING</span>
                                    <span className="text-accent font-bold">CALCULATED AT CHECKOUT</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between">
                                    <span className="font-bold text-lg">TOTAL</span>
                                    <span className="font-bold text-lg">{formatPrice(totalPrice())}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-primary/90 transition shadow-xl"
                            >
                                <span>PROCEED TO CHECKOUT</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                    Safe & Secure Payments via
                                </div>
                                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition cursor-pointer">
                                    <span className="text-xs font-black">eSewa</span>
                                    <span className="text-xs font-black">Khalti</span>
                                    <span className="text-xs font-black">COD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
