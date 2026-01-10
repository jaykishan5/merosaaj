"use client";

import { useRecentlyViewed } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export default function RecentlyViewed() {
    const { items } = useRecentlyViewed();

    if (items.length === 0) return null;

    return (
        <section className="mt-16 border-t border-gray-100 pt-16">
            <h2 className="text-xl md:text-2xl font-black text-primary mb-8 uppercase tracking-widest flex items-center gap-4">
                <div className="w-8 h-1 bg-gray-200"></div>
                Recently Viewed
            </h2>

            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {items.map((product) => (
                    <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                        className="min-w-[160px] md:min-w-[200px] group"
                    >
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all"
                        >
                            <div className="relative aspect-[3/4] bg-muted/20">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {product.discountPrice && (
                                    <div className="absolute top-2 right-2 bg-accent text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                                        Sale
                                    </div>
                                )}
                            </div>
                            <div className="p-3 space-y-1">
                                <h3 className="text-xs font-bold text-primary truncate uppercase tracking-wide">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-primary">{formatPrice(product.discountPrice || product.price)}</span>
                                    {product.discountPrice && (
                                        <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.price)}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
