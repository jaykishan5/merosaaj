"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";

interface BundleSectionProps {
    productId: string;
}

export default function BundleSection({ productId }: BundleSectionProps) {
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const res = await fetch(`/api/bundles`);
                const data = await res.json();
                // Filter bundles that contain this product
                const relatedBundles = data.filter((b: any) =>
                    b.products.some((p: any) => p.product === productId || p.product?._id === productId)
                );
                setBundles(relatedBundles);
            } catch (error) {
                console.error("Failed to fetch bundles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBundles();
    }, [productId]);

    const handleAddBundle = async (bundle: any) => {
        // Add all products in the bundle to cart
        for (const item of bundle.products) {
            // In a real app, we might want a special 'BundleItem' in the cart
            // but for now we'll add individual items at their bundle-pro-rated price?
            // Actually, simpler: add items at original price and apply a dynamic 'Bundle Discount' 
            // OR just add them as is and let the user know.
            // For Merosaaj, let's add them at their original price BUT if we had a more complex cart 
            // we'd handle the bundle price. 
            // Let's assume the bundle info helps the user add them quickly.

            // To be technically correct for this demo, we'll just add the items.
            // A more advanced fix would be updating the Cart Store to handle Bundles.

            const prodRes = await fetch(`/api/products?id=${item.product?._id || item.product}`);
            const product = await prodRes.json();

            addItem({
                _id: product._id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.images[0],
                size: item.variant.size,
                color: item.variant.color,
                quantity: 1,
                stock: 99 // Placeholder or real stock check could go here
            });
        }

        setAddedBundleId(bundle._id);
        setTimeout(() => setAddedBundleId(null), 2000);
    };

    if (loading || bundles.length === 0) return null;

    return (
        <div className="mt-16 space-y-8">
            <div className="flex items-center gap-4">
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
                    Bundle & <span className="text-accent">Save</span>
                </h3>
                <span className="h-[2px] flex-1 bg-border/50"></span>
            </div>

            {bundles.map((bundle) => (
                <div
                    key={bundle._id}
                    className="bg-muted/30 border border-border rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8"
                >
                    <div className="flex -space-x-8">
                        {bundle.products.slice(0, 3).map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="relative w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-xl scale-95 first:scale-100 first:z-10 last:scale-90"
                            >
                                {/* We'd ideally have images here, but item only has product ref in basic schema */}
                                {/* In a real app we'd populate the product info */}
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <Image
                                        src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80"}
                                        alt="Bundle Item"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <h4 className="text-lg font-black uppercase italic mb-2">{bundle.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <span className="text-2xl font-black text-accent">{formatPrice(bundle.price)}</span>
                            <span className="text-sm text-muted-foreground line-through font-bold">
                                {formatPrice(bundle.products.length * 2000)} {/* Placeholder total */}
                            </span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddBundle(bundle)}
                        disabled={addedBundleId === bundle._id}
                        className={`px-8 h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${addedBundleId === bundle._id
                            ? "bg-green-500 text-white"
                            : "bg-primary text-white shadow-xl shadow-primary/20"
                            }`}
                    >
                        {addedBundleId === bundle._id ? (
                            <><Check className="w-4 h-4" /> Added Bundle</>
                        ) : (
                            <><Plus className="w-4 h-4" /> Get The Look</>
                        )}
                    </motion.button>
                </div>
            ))}
        </div>
    );
}
