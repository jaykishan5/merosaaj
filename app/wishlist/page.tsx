"use client";

import Navbar from "@/components/Navbar";
import { useWishlist, useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import QuickViewModal from "@/components/QuickViewModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function WishlistPage() {
    const { items, toggleItem } = useWishlist();
    const addItem = useCart((state) => state.addItem);
    const [mounted, setMounted] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <div className="h-[110px] md:h-[135px]"></div>

            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-16">
                    <div className="p-4 bg-accent/10 rounded-2xl">
                        <Heart className="w-8 h-8 text-accent fill-accent" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">My Wishlist</h1>
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mt-2">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="py-32 text-center border-4 border-dashed border-muted rounded-[3rem] space-y-8">
                        <div className="relative inline-block">
                            <Heart className="w-24 h-24 text-muted/20 mx-auto" />
                            <X className="w-8 h-8 text-accent absolute top-0 right-0" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic">YOUR WISHLIST IS EMPTY</h2>
                            <p className="text-muted-foreground font-medium">Seems like you haven't saved anything yet.</p>
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-4 px-12 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-xl"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {items.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-[2rem] mb-6 shadow-xl shadow-primary/5">
                                        <Link href={`/product/${product.slug}`}>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => toggleItem(product)}
                                            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-xl text-accent hover:bg-accent hover:text-white transition-all shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="px-2 space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-primary truncate">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black">{formatPrice(product.discountPrice || product.price)}</span>
                                                {product.discountPrice && (
                                                    <span className="text-xs text-muted-foreground line-through font-bold">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    // Fetch full details
                                                    const res = await fetch(`/api/products?id=${product._id}`);
                                                    if (res.ok) {
                                                        const fullProduct = await res.json();
                                                        setSelectedProduct(fullProduct);
                                                    } else {
                                                        toast.error("Failed to load product details");
                                                    }
                                                } catch (error) {
                                                    toast.error("Something went wrong");
                                                }
                                            }}
                                            className="w-full py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-all flex items-center justify-center gap-3"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Move To Bag
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {selectedProduct && (
                <QuickViewModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </main>
    );
}
