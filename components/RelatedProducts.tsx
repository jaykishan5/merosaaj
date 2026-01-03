"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Fetch products by category
                const res = await fetch(`/api/products?category=${category}`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter out the current product and limit to 4 items
                    const related = data
                        .filter((p: any) => p._id !== currentProductId)
                        .slice(0, 4);
                    setProducts(related);
                }
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelated();
        }
    }, [category, currentProductId]);

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100 mt-12">
            <h2 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest flex items-center gap-4">
                <div className="w-8 h-1 bg-accent"></div>
                You Might Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)
                ) : (
                    products.map((product: any) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            width="w-full"
                        />
                    ))
                )}
            </div>
        </section>
    );
}
