"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, Search, Heart, ChevronDown, X } from "lucide-react";
import { useCart } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const totalItems = useCart((state) => state.totalItems());
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categories = [
        { name: "Men", href: "/shop?gender=Men" },
        { name: "Women", href: "/shop?gender=Women" },
        { name: "Accessories", href: "/shop?category=Accessories" },
        { name: "Limited Drops", href: "/shop?category=Limited" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            {/* Top Bar - Branding and Search (Commercial Focus) */}
            <div className={`bg-primary text-primary-foreground border-b border-white/10 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="shrink-0 flex items-center gap-2 sm:gap-3 group relative">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="w-10 h-10 bg-gradient-to-br from-accent to-red-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shadow-xl shadow-accent/20 border border-white/10 relative z-10">
                                <span className="text-white font-black text-xl italic tracking-tighter font-serif">M</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-lg sm:text-3xl font-black tracking-tighter leading-none flex items-center gap-0.5 font-serif italic">
                                Merosaaj<span className="w-1.5 h-1.5 rounded-full bg-accent inline-block mb-1 animate-pulse"></span>
                            </h1>
                            <span className="text-[8px] font-bold tracking-[0.3em] text-primary-foreground/40 uppercase pl-0.5 group-hover:text-accent transition-colors font-outfit">Est. 2026</span>
                        </div>
                    </Link>

                    {/* Search Bar (Smart) */}
                    <div className="hidden md:flex flex-1 max-w-xl justify-center">
                        <SearchBar />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-primary-foreground/70 hover:text-white"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/wishlist" className="p-2 hover:bg-white/10 rounded-full transition-colors text-primary-foreground/70 hover:text-white relative group">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 group-hover:block transition-all bg-accent text-white text-[8px] px-1 rounded-full border border-primary">NEW</span>
                        </Link>

                        <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-all relative text-primary-foreground/70 hover:text-white">
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-accent text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black border border-primary"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </Link>

                        <Link href={session ? "/profile" : "/login"} className="hidden sm:flex items-center gap-2 p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-all text-primary-foreground/70 hover:text-white group">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-accent">
                                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Account</span>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-Header - Categories (Tier 2) */}
            <div className={`hidden md:block bg-background/90 backdrop-blur-xl border-b border-border transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`}>
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                    <ul className="flex items-center h-full space-x-8">
                        {categories.map((cat) => (
                            <li key={cat.name} className="h-full">
                                <Link
                                    href={cat.href}
                                    className="h-full flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent border-b-2 border-transparent hover:border-accent transition-all relative group"
                                >
                                    {cat.name}
                                    {cat.name === "Men" && <span className="ml-1 text-[8px] bg-accent/10 text-accent px-1 rounded animate-pulse">Hot</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-8 text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                        <Link href="/track-order" className="hover:text-primary transition-colors flex items-center gap-2">
                            Track Order
                        </Link>
                        <Link href="/help" className="hover:text-primary transition-colors">
                            Help Center
                        </Link>
                        <span className="text-accent/50 font-black">STREETWEAR CORE // SEASON 26</span>
                    </div>
                </div>
            </div>

            {/* Search Overlay (Mobile) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-primary p-4 md:hidden"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setIsSearchOpen(false)} className="text-white">
                                <ChevronDown className="w-6 h-6 rotate-90" />
                            </button>
                            <div className="flex-1">
                                <SearchBar />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Popular Searches</p>
                            <div className="flex flex-wrap gap-2">
                                {["Oversized Tee", "Cargo Pants", "Hoodies", "Limited Drop"].map(term => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            // Handle search term click if needed
                                            setIsSearchOpen(false);
                                        }}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white hover:bg-white/10"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0a0a0a] md:hidden overflow-y-auto"
                    >
                        <div className="p-8 pb-20">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-12">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                                        <span className="text-white font-black text-lg italic tracking-tighter font-serif">M</span>
                                    </div>
                                    <span className="text-white text-2xl font-black italic tracking-tighter font-serif">Merosaaj</span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Main Navigation */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent px-1">Curated Collections</p>
                                    <nav className="flex flex-col">
                                        {categories.map((cat, i) => (
                                            <motion.div
                                                key={cat.name}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Link
                                                    href={cat.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center justify-between group py-4 border-b border-white/5"
                                                >
                                                    <span className="text-3xl font-black text-white group-active:text-accent transition-colors italic tracking-tight uppercase">
                                                        {cat.name}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                                        <ShoppingBag className="w-4 h-4 text-accent" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: categories.length * 0.1 }}
                                        >
                                            <Link
                                                href="/shop"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center justify-between py-6 group"
                                            >
                                                <span className="text-4xl font-black text-accent group-active:text-white transition-colors italic tracking-tighter uppercase relative">
                                                    Shop All
                                                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-accent rounded-full transition-all group-hover:w-full"></span>
                                                </span>
                                            </Link>
                                        </motion.div>
                                    </nav>
                                </div>

                                {/* Utilities */}
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: (categories.length + 1) * 0.1 }}
                                    >
                                        <Link
                                            href={session ? "/profile" : "/login"}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all active:scale-95 h-full group"
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                                                <User className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <span className="font-black uppercase tracking-widest text-[10px] text-white block">
                                                    {session ? "Profile" : "Account"}
                                                </span>
                                                <span className="text-[8px] text-white/40 uppercase font-bold tracking-tight">Access Dashboard</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: (categories.length + 2) * 0.1 }}
                                    >
                                        <Link
                                            href="/wishlist"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all active:scale-95 h-full group"
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                                                <Heart className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <span className="font-black uppercase tracking-widest text-[10px] text-white block">Wishlist</span>
                                                <span className="text-[8px] text-white/40 uppercase font-bold tracking-tight">Saved Items</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Bottom Links */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: (categories.length + 3) * 0.1 }}
                                    className="space-y-8 pt-8 border-t border-white/5"
                                >
                                    <div className="flex items-center gap-8">
                                        <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-colors">Track Order</Link>
                                        <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-colors">Help Center</Link>
                                    </div>
                                    <div className="bg-gradient-to-r from-accent/10 to-transparent p-4 rounded-2xl border border-accent/20 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Streetwear Core</p>
                                            <p className="text-[8px] text-accent/60 font-bold uppercase tracking-widest mt-0.5">Vol. 26 // Release Archive</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-accent animate-ping"></div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
