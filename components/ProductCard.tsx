"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        price: number;
        discountPrice?: number;
        images: string[];
        createdAt: string;
        variants?: { stock: number }[];
        isBestseller?: boolean;
    };
    priority?: boolean;
    width?: string;
}

export default function ProductCard({ product, width = "w-full md:w-[320px]", priority = false }: ProductCardProps) {
    const { toggleItem, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);

    const [showQuickView, setShowQuickView] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    return (
        <>
            <div className={`${width} shrink-0 snap-start group`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-2xl md:rounded-[2rem] mb-4 md:mb-6 shadow-xl shadow-primary/5">
                    <Link href={`/product/${product.slug}`}>
                        <Image
                            src={imgSrc || product.images[0] || "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80"}
                            alt={product.name}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            onError={() => setImgSrc("https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80")}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>

                    {/* Status Badges (New / Low Stock) */}
                    <div className="absolute top-3 left-3 md:top-6 md:left-6 flex flex-col gap-1.5 items-start pointer-events-none z-10">
                        {product.discountPrice && (
                            <div className="bg-accent text-white font-black text-[8px] md:text-[10px] px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                            </div>
                        )}
                        {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000 && (
                            <div className="bg-blue-600 text-white font-black text-[8px] md:text-[9px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                                NEW DROP
                            </div>
                        )}
                        {product.isBestseller && (
                            <div className="bg-amber-500 text-white font-black text-[8px] md:text-[9px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                                BESTSELLER
                            </div>
                        )}
                        {product.variants && product.variants.length > 0 && product.variants.reduce((acc, v) => acc + v.stock, 0) < 5 && product.variants.reduce((acc, v) => acc + v.stock, 0) > 0 && (
                            <div className="bg-rose-500 text-white font-black text-[8px] md:text-[9px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                                LIMITED: {product.variants.reduce((acc, v) => acc + v.stock, 0)} LEFT
                            </div>
                        )}
                    </div>

                    <div className="absolute top-3 right-3 md:top-6 md:right-6 flex flex-col gap-2 z-10">
                        <button
                            onClick={() => toggleItem({
                                _id: product._id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                discountPrice: product.discountPrice,
                                image: product.images[0]
                            })}
                            className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl text-primary hover:text-accent transition-all shadow-lg"
                        >
                            <Heart
                                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${isWishlisted ? "fill-accent text-accent" : "text-primary hover:text-accent"}`}
                            />
                        </button>
                        <button
                            onClick={() => setShowQuickView(true)}
                            className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl text-primary hover:text-accent transition-all shadow-lg md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 hidden md:flex"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity pointer-events-none"></div>
                </div>

                <div className="px-1 md:px-2 space-y-1 md:space-y-2">
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-primary truncate group-hover:text-accent transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-sm md:text-lg font-black">{formatPrice(product.discountPrice || product.price)}</span>
                        {product.discountPrice && (
                            <span className="text-[10px] md:text-xs text-muted-foreground line-through font-bold">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showQuickView && (
                <QuickViewModal
                    product={product}
                    isOpen={showQuickView}
                    onClose={() => setShowQuickView(false)}
                />
            )}
        </>
    );
}
