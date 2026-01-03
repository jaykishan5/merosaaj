"use client";
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search as SearchIcon, X } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const genderParam = searchParams.get("gender") || "all";
    const categoryParam = searchParams.get("category") || "all";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Advanced Filters State
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedColor, setSelectedColor] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    category: categoryParam,
                    gender: genderParam,
                    search,
                    minPrice,
                    maxPrice,
                    color: selectedColor
                });
                const res = await fetch(`/api/products?${queryParams.toString()}`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [categoryParam, genderParam, search, minPrice, maxPrice, selectedColor]);


    const handleFilterChange = (type: 'category' | 'gender', value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "all") {
            params.delete(type);
        } else {
            params.set(type, value);
        }

        // Contextual logic: if filtering by gender, keep category. 
        // If changing gender to 'all', maybe reset category? No, let's keep it flexible.

        router.push(`/shop?${params.toString()}`);
    };

    const categories = ["all", "Clothing", "Accessories", "Best Sellers", "Limited"];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-32 md:pt-48 pb-24">
                <Breadcrumbs />
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter uppercase">
                            {genderParam !== "all" ? `${genderParam}'s Collection` : "STORE"}
                        </h1>
                        <p className="text-muted-foreground mt-2">Curated streetwear for the modern nomad.</p>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-full outline-none focus:ring-2 focus:ring-primary w-full md:w-64 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-2 border border-border rounded-full hover:bg-muted transition"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Desktop Sidebar (Sticky) */}
                    <aside className="hidden lg:block w-64 space-y-12 sticky top-32 h-fit">


                        {/* Category Filter */}
                        <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-6 border-b border-border pb-2">Collections</h3>
                            <div className="flex flex-col space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleFilterChange('category', cat)}
                                        className={`text-sm text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${categoryParam === cat
                                            ? 'bg-primary text-primary-foreground font-black translate-x-2'
                                            : 'hover:bg-muted hover:translate-x-1 text-muted-foreground hover:text-primary'
                                            }`}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-6 border-b border-border pb-2">Price Range</h3>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Rs.</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-8 pr-2 text-xs focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <span className="text-muted-foreground">-</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Rs.</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-8 pr-2 text-xs focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-6 border-b border-border pb-2">Colors</h3>
                            <div className="flex flex-wrap gap-3">
                                {["Black", "White", "Cream", "Grey", "Olive", "Navy", "Charcoal"].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(selectedColor === color ? "all" : color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${selectedColor === color ? "ring-2 ring-accent ring-offset-2 border-transparent scale-110" : "border-border hover:border-accent/50"
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    >
                                        {/* Tooltip or simple visual */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile/Quick Filters (Visible on small screens if needed, but sidebar is hidden) */}
                        <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                            <h4 className="font-bold text-sm mb-2">Need Help?</h4>
                            <p className="text-xs text-muted-foreground mb-4">Can't find what you're looking for? Contact our support team.</p>
                            <Link href="#" className="text-xs font-black underline">Get Support</Link>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 min-h-[50vh]">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                {products.map((product: any, index: number) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        width="w-full"
                                        priority={index < 4} // Load first 4 images immediately
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                                    <SearchIcon className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No matching pieces found</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                                    Try adjusting your filters or search terms to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        handleFilterChange('category', 'all');
                                        handleFilterChange('gender', 'all');
                                    }}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
