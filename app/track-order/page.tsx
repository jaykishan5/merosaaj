"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, formatDate } from "@/lib/utils";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            // In a real app, you'd fetch from an API
            // For now, let's simulate a fetch
            const response = await fetch(`/api/orders/${orderId}?email=${email}`);
            const data = await response.json();

            if (response.ok) {
                setOrder(data);
            } else {
                setError(data.message || "Order not found. Please check your credentials.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = order ? steps.indexOf(order.status) : -1;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-3 rounded-2xl bg-accent/10 mb-4"
                    >
                        <Truck className="w-8 h-8 text-accent" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4"
                    >
                        Track Your Order
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground font-medium max-w-md mx-auto"
                    >
                        Enter your order details below to get real-time updates on your shipment status.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden mb-12"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Order ID</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="e.g. 658a..."
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-bold"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Track Order
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Order Summary Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tight">Order #{order._id.substring(0, 8).toUpperCase()}</h2>
                                <p className="text-muted-foreground font-bold text-sm">Placed on {formatDate(order.createdAt)}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
                                <p className="text-2xl font-black text-accent">{formatPrice(order.totalPrice)}</p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-card p-10 rounded-[2.5rem] border border-border relative overflow-hidden">
                            <div className="absolute top-1/2 left-10 right-10 h-1 bg-muted -translate-y-1/2 z-0 hidden md:block"></div>
                            <div
                                className="absolute top-1/2 left-10 h-1 bg-accent -translate-y-1/2 z-0 transition-all duration-1000 hidden md:block"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            ></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isActive = index === currentStepIndex;

                                    return (
                                        <div key={step} className="flex md:flex-col items-center gap-4 md:gap-4 w-full md:w-auto">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'bg-accent border-accent text-white shadow-lg shadow-accent/40 scale-110' :
                                                    isCompleted ? 'bg-primary border-primary text-white' :
                                                        'bg-muted border-muted text-muted-foreground'
                                                }`}>
                                                {index === 0 && <Clock className="w-6 h-6" />}
                                                {index === 1 && <Package className="w-6 h-6" />}
                                                {index === 2 && <Truck className="w-6 h-6" />}
                                                {index === 3 && <MapPin className="w-6 h-6" />}
                                            </div>
                                            <div className="text-left md:text-center flex-1 md:flex-none">
                                                <p className={`text-xs font-black uppercase tracking-[0.2em] mb-0.5 ${isCompleted ? 'text-primary' : 'text-muted-foreground/40'}`}>
                                                    {step}
                                                </p>
                                                {isActive && (
                                                    <p className="text-[10px] text-accent font-bold animate-pulse">In Progress</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-card p-8 rounded-[2.5rem] border border-border">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-accent" />
                                    Order Items
                                </h3>
                                <div className="space-y-4">
                                    {order.orderItems.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                                            <div className="w-16 h-20 bg-muted rounded-xl relative overflow-hidden">
                                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.size} / {item.color} x {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card p-8 rounded-[2.5rem] border border-border">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    Shipping Address
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="font-bold">{order.shippingAddress.fullName}</p>
                                    <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                    <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                    <div className="pt-4 flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></div>
                                        Estimated Delivery: 3-5 Working Days
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <Footer />
        </main>
    );
}

