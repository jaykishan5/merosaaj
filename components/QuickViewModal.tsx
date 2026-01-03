"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useWishlist, useCart } from "@/lib/store";
import { useState } from "react";

interface QuickViewModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { toggleItem, isInWishlist } = useWishlist();
    const { addItem } = useCart();
    const isWishlisted = isInWishlist(product._id);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // Initial variant selection
    if (!selectedSize && product.variants?.length > 0) {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
    }

    const handleAddToCart = () => {
        const variant = product.variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);
        addItem({
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.images[0],
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
            stock: variant?.stock || 0
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-[95vw] md:w-[90vw] max-w-4xl h-fit max-h-[95vh] md:max-h-[90vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white transition-colors z-20"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>

                        {/* Image */}
                        <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:min-h-[500px] bg-muted">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto">
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 italic leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex text-accent">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-current" />)}
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Rated</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-2xl md:text-3xl font-black">{formatPrice(product.discountPrice || product.price)}</span>
                                    {product.discountPrice && (
                                        <span className="text-xs md:text-sm line-through text-muted-foreground font-bold">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                                    {product.description}
                                </p>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-primary text-white h-12 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-transform hover:scale-105"
                                    >
                                        Add to Bag
                                    </button>
                                    <button
                                        onClick={() => toggleItem({ ...product, image: product.images[0] })}
                                        className={`h-12 w-12 flex items-center justify-center rounded-xl border-2 transition-colors ${isWishlisted ? "border-accent text-accent" : "border-gray-100 text-gray-400 hover:border-accent hover:text-accent"
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                                    </button>
                                </div>

                                <Link
                                    href={`/product/${product.slug}`}
                                    onClick={onClose}
                                    className="block text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors pt-2 md:pt-4 border-t border-gray-50"
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
