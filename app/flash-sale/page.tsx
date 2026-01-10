"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Zap } from "lucide-react";

export default function FlashSalePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const res = await fetch("/api/products?flash_sale=true");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch flash sales", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSales();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-32 pb-20">
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full text-rose-600 font-black uppercase tracking-widest text-xs animate-pulse">
                        <Zap className="w-4 h-4 fill-rose-600" />
                        Live Now
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter">
                        Flash <span className="text-rose-600">Drops</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-wide max-w-lg mx-auto">
                        Limited time offers on exclusive Merosaaj collections. Grab them before the countdown ends.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-xl font-black text-muted-foreground uppercase tracking-widest">No Active Flash Sales</p>
                        <p className="text-sm font-bold text-gray-400 mt-2">Check back later for new drops.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
