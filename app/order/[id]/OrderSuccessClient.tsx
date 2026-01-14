"use client";
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CheckCircle2, Package, MapPin, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import { useCart } from "@/lib/store";
import { motion } from "framer-motion";


export default function OrderSuccessPage({ initialOrder }: { initialOrder: any }) {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const success = searchParams.get("success");

    const [order] = useState<any>(initialOrder);
    const { clearCart } = useCart();

    useEffect(() => {
        if (success === "true") {
            clearCart();
        }
    }, [success, clearCart]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    if (!order) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Order Not Found</h1>
                <p className="text-muted-foreground text-sm font-medium">You might not have permission to view this order <br /> or it doesn't exist.</p>
            </div>
            <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
                Return to Shop
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 pt-40 pb-24">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {success && (
                        <motion.div variants={itemVariants} className="text-center mb-16">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                            <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Order Confirmed</h1>
                            <p className="text-muted-foreground">Thank you, {order.shippingAddress.fullName}. Your order #{order._id.substring(0, 8)} is being processed.</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-8">
                            <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-8 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Order Status</h3>
                                    <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{order.status}</span>
                                </div>

                                <div className="space-y-6">
                                    {order.orderItems.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="relative w-16 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex justify-between items-center">
                                                <div>
                                                    <h4 className="text-sm font-bold uppercase">{item.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground">SIZE: {item.size} | QTY: {item.quantity}</p>
                                                </div>
                                                <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-border space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">SUBTOTAL</span>
                                        <span className="font-bold">{formatPrice(order.itemsPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">SHIPPING</span>
                                        <span className="font-bold">{formatPrice(order.shippingPrice)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-primary/10 flex justify-between items-end">
                                        <span className="font-bold text-lg">TOTAL</span>
                                        <span className="font-black text-xl">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Link href="/shop" className="w-full border border-border py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-muted transition">
                                    <span>CONTINUE SHOPPING</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Details Sidebar */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-muted rounded-2xl"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Shipping To</h4>
                                        <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-muted rounded-2xl"><CreditCard className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Payment</h4>
                                        <p className="text-sm font-medium">METHOD: {order.paymentMethod}</p>
                                        <p className="text-sm text-muted-foreground text-[10px] uppercase font-bold">{order.isPaid ? 'PAID ✓' : 'PAYMENT PENDING'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-muted rounded-2xl"><Truck className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Delivery</h4>
                                        <p className="text-sm font-bold text-accent uppercase">EST. 3-5 DAYS</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

// Simple internal helper component
function CreditCard({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    );
}
