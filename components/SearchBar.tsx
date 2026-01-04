"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/products/suggestions?query=${query}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (query.trim().length > 1) {
                fetchResults();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Fetch search history
    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => {
        const fetchHistory = async () => {
            const res = await fetch("/api/user/search-history");
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        };
        fetchHistory();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSearch = async (e: React.FormEvent, term?: string) => {
        if (e) e.preventDefault();
        const searchTerm = term || query;
        if (searchTerm.trim()) {
            setIsOpen(false);
            router.push(`/shop?search=${searchTerm}`);

            // Save to history
            await fetch("/api/user/search-history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ term: searchTerm }),
            });
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-xl">
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-accent transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!e.target.value) setIsOpen(false);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder="Search for products..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-10 text-sm focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-primary-foreground/30 text-primary-foreground focus:placeholder:text-muted-foreground"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                        }}
                        className="absolute inset-y-0 right-4 flex items-center text-primary/40 hover:text-accent transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                    </button>
                )}
            </form>

            {/* Dropdown Results */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 divide-y divide-gray-50"
                    >
                        {results.length > 0 ? (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="p-2">
                                    {results.some(r => r.type === "category") && (
                                        <div className="mb-2">
                                            <h4 className="text-[10px] uppercase font-black tracking-wider text-muted-foreground px-4 py-2">
                                                Categories
                                            </h4>
                                            {results.filter(r => r.type === "category").map((cat: any) => (
                                                <button
                                                    key={cat.text}
                                                    onClick={() => handleSearch(null as any, cat.text)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-bold text-primary italic"
                                                >
                                                    <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                                                        <Search className="w-3 h-3 text-accent" />
                                                    </div>
                                                    {cat.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {results.some(r => r.type === "product") && (
                                        <div>
                                            <h4 className="text-[10px] uppercase font-black tracking-wider text-muted-foreground px-4 py-2">
                                                Products
                                            </h4>
                                            {results.filter(r => r.type === "product").map((product: any) => (
                                                <Link
                                                    key={product.slug}
                                                    href={`/product/${product.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-4 p-2 hover:bg-muted rounded-xl transition-colors group"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.text}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
                                                            {product.text}
                                                        </h5>
                                                        <p className="text-[10px] font-medium text-muted-foreground uppercase">
                                                            {product.category} • {formatPrice(product.price)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => handleSearch(e)}
                                    className="w-full p-3 text-center text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/5 transition-colors border-t border-gray-50"
                                >
                                    Explore all findings
                                </button>
                            </div>
                        ) : query.trim().length === 0 ? (
                            <div className="p-6">
                                {history.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-[10px] uppercase font-black tracking-wider text-muted-foreground px-1 mb-3 flex items-center justify-between">
                                            Recent Searches
                                            <Search className="w-3 h-3 opacity-20" />
                                        </h4>
                                        <div className="space-y-1">
                                            {history.map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => handleSearch(null as any, term)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-sm font-semibold text-primary/70 hover:text-primary"
                                                >
                                                    <X className="w-3 h-3 opacity-20" />
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h4 className="text-[10px] uppercase font-black tracking-wider text-muted-foreground px-1 mb-3">
                                        Trending Searches
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["Oversized Tee", "Cargo Pants", "Hoodies", "Accessories"].map((trend) => (
                                            <button
                                                key={trend}
                                                onClick={() => handleSearch(null as any, trend)}
                                                className="px-4 py-1.5 rounded-full bg-muted/50 hover:bg-accent hover:text-white transition-all text-xs font-bold"
                                            >
                                                {trend}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-black tracking-wider text-muted-foreground px-1 mb-3">
                                        Quick Categories
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { name: "Men's Core", href: "/shop?gender=Men" },
                                            { name: "Women's Fit", href: "/shop?gender=Women" },
                                            { name: "Limited Drops", href: "/shop?category=Limited" },
                                            { name: "Accessories", href: "/shop?category=Accessories" }
                                        ].map((cat) => (
                                            <Link
                                                key={cat.name}
                                                href={cat.href}
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors text-[10px] font-black uppercase tracking-widest text-center"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                <Search className="w-10 h-10 mx-auto mb-4 opacity-10" />
                                <p className="text-sm font-medium tracking-tight">Zero matches for &quot;{query}&quot;</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-50">Try different keywords or filters</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
