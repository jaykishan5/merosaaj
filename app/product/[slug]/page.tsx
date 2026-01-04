"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart, useWishlist } from "@/lib/store";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronLeft, Heart, Share2, Star, MapPin, Truck, RotateCcw, ShieldCheck, Smartphone, MessageSquare } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReviewsSection from "@/components/ReviewsSection";
import RelatedProducts from "@/components/RelatedProducts";
import LocationModal from "@/components/LocationModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import BundleSection from "@/components/BundleSection"; // New import
import SocialShare from "@/components/SocialShare";
import { Package as PackageIcon } from "lucide-react";

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const { addItem } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();
    const isWishlisted = product ? isInWishlist(product._id) : false;
    const [quantity, setQuantity] = useState(1);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        address: "Bagmati, Kathmandu Metro 22 - Newroad Area, Newroad",
        city: "Kathmandu",
        region: "Kathmandu Valley" as "Kathmandu Valley" | "Outside Valley",
        shippingPrice: 100
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const p = await res.json();
                setProduct(p);
                if (p?.variants?.length > 0) {
                    setSelectedSize(p.variants[0].size);
                    setSelectedColor(p.variants[0].color);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    const handleQuantityChange = (delta: number) => {
        if (!product) return;
        const variant = product.variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);
        const maxStock = variant?.stock || 0;

        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= maxStock) {
            setQuantity(newQty);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleAddToCart = (quiet = false) => {
        if (!product || !selectedSize || !selectedColor) {
            alert("Please select a size and color");
            return;
        }

        const variant = product.variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);

        addItem({
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.images[activeImage] || product.images[0],
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
            stock: variant?.stock || 0
        });

        if (!quiet) {
            // Reset quantity after adding
            setQuantity(1);
            alert("Added to bag! View your cart to checkout.");
        }
    };

    const handleBuyNow = () => {
        handleAddToCart(true);
        router.push("/cart");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Loading Merchandise</p>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Navbar />
            <div className="text-center">
                <h2 className="text-2xl font-black mb-4 uppercase">Product Not Found</h2>
                <Link href="/shop" className="text-accent font-bold border-b border-accent pb-1">Return to Shop</Link>
            </div>
        </div>
    );

    // Intelligent variant parsing
    const allColors = Array.from(new Set(product.variants.flatMap((v: any) =>
        v.color.split(',').map((c: string) => c.trim())
    )));

    const allSizes = Array.from(new Set(product.variants.flatMap((v: any) =>
        v.size.split(',').map((s: string) => s.trim())
    )));

    const currentVariant = product.variants.find((v: any) =>
        v.size.split(',').map((s: string) => s.trim()).includes(selectedSize) &&
        v.color.split(',').map((c: string) => c.trim()).includes(selectedColor)
    );

    return (
        <div className="min-h-screen bg-muted/40">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <Breadcrumbs />
                <div className="flex flex-col lg:flex-row gap-4 font-sans">

                    {/* Left Column: Visuals */}
                    <div className="lg:w-[40%]">
                        <div className="lg:sticky lg:top-32 space-y-4">
                            {/* Main Image Gallery (Scrollable on Mobile) */}
                            <div className="flex lg:block overflow-x-auto snap-x snap-mandatory lg:overflow-visible scrollbar-none -mx-4 lg:mx-0 px-4 lg:px-0 gap-4">
                                {product.images.map((img: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="relative aspect-square w-[85vw] lg:w-full flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm snap-center lg:mb-4 group"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${i}`}
                                            fill
                                            priority={i === 0}
                                            className="object-contain p-4 lg:p-12 transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {i === 0 && product.discountPrice && (
                                            <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg">
                                                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop Thumbnails (Hidden on Mobile) */}
                            <div className="hidden lg:flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {product.images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const element = document.querySelectorAll('.snap-center')[i];
                                            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                            setActiveImage(i);
                                        }}
                                        className={`relative aspect-square w-20 flex-shrink-0 bg-white rounded-md overflow-hidden border-2 transition-all ${activeImage === i ? "border-accent ring-2 ring-accent/10" : "border-gray-100 hover:border-gray-300"
                                            }`}
                                    >
                                        <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover p-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Info & Variants */}
                    <div className="lg:w-[35%] lg:bg-white lg:p-8 lg:rounded-lg lg:border lg:border-gray-100 lg:shadow-sm h-fit">
                        <div className="space-y-6 md:space-y-8">
                            {/* Header */}
                            <div className="bg-white p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-0 border-gray-100 shadow-sm lg:shadow-none">
                                <div className="flex justify-between items-start gap-4">
                                    <h1 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-4 tracking-tighter uppercase italic flex-1">{product.name}</h1>
                                    <SocialShare title={product.name} url={typeof window !== 'undefined' ? window.location.href : ''} />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < 4 ? "fill-accent text-accent" : "text-gray-200"}`} />
                                            ))}
                                            <span className="text-[10px] font-bold text-muted-foreground ml-2 uppercase tracking-wider">297 Ratings</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nepal's Choice</span>
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">
                                        Brand: <span className="text-accent hover:underline cursor-pointer">merosaaj studios</span> | <span className="text-accent hover:underline cursor-pointer">Official Store</span>
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            {/* Pricing */}
                            <div className="bg-white p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-0 border-gray-100 shadow-sm lg:shadow-none">
                                <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">{formatPrice(product.discountPrice || product.price)}</span>
                                {product.discountPrice && (
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-base md:text-lg text-muted-foreground line-through decoration-muted-foreground/50">{formatPrice(product.price)}</span>
                                        <span className="text-[10px] md:text-sm font-black text-accent bg-accent/10 px-2 py-0.5 rounded tracking-widest uppercase">-{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF</span>
                                    </div>
                                )}
                            </div>

                            {/* Promo Banner - Merosaaj Branded */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-primary p-4 rounded-xl text-primary-foreground flex justify-between items-center text-xs font-black uppercase tracking-[0.15em] border-l-4 border-accent shadow-xl"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                    Season Drop: Culturally Rooted
                                </span>
                                <div className="bg-accent text-white px-4 py-1.5 rounded-lg text-[9px] font-black">MEROSAAJ EXCLUSIVE</div>
                            </motion.div>

                            {/* Variants & Actions Section */}
                            <div className="bg-white p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-0 border-gray-100 shadow-sm lg:shadow-none space-y-8">
                                {/* Variants Selection */}
                                <div className="space-y-8">
                                    {/* Color Selector */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Color Family: <span className="text-primary">{selectedColor}</span></h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {allColors.map((color: any) => (
                                                <motion.button
                                                    key={color}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`min-w-[70px] px-4 py-2 border-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${selectedColor === color
                                                        ? 'border-primary bg-primary text-white shadow-lg'
                                                        : 'border-gray-100 hover:border-primary/30 text-muted-foreground hover:text-primary'
                                                        }`}
                                                >
                                                    {color}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selector */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Size: <span className="text-primary">{selectedSize}</span></h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {allSizes.map((size: any) => (
                                                <motion.button
                                                    key={size}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[50px] h-11 border-2 rounded-xl transition-all text-xs font-black ${selectedSize === size
                                                        ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                                                        : 'border-gray-100 hover:border-accent/30 text-muted-foreground hover:text-accent'
                                                        }`}
                                                >
                                                    {size}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions (Sticky on mobile) */}
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center space-x-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantity</p>
                                        <div className="flex items-center bg-muted/30 rounded-xl border border-gray-100 overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="px-4 py-2 hover:bg-muted text-primary font-bold transition-colors"
                                            >-</button>
                                            <span className="px-5 py-2 text-sm font-black">{quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                className="px-4 py-2 hover:bg-muted text-primary font-bold transition-colors"
                                            >+</button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${currentVariant && currentVariant.stock > 0 ? "bg-accent animate-ping" : "bg-gray-400"}`}></div>
                                            <p className="text-[10px] font-black text-accent uppercase tracking-widest">
                                                {currentVariant && currentVariant.stock > 0 ? "In Stock" : "Out of Stock"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Web Actions */}
                                    <div className="hidden lg:flex flex-col sm:flex-row gap-4">
                                        {currentVariant && currentVariant.stock > 0 ? (
                                            <>
                                                <motion.button
                                                    whileHover={{ scale: 1.02, backgroundColor: "#111111" }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleBuyNow}
                                                    className="flex-1 bg-primary text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20"
                                                >
                                                    Instant Buy
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02, borderColor: "#8B0000", color: "#8B0000" }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAddToCart()}
                                                    className="flex-1 border-2 border-primary text-primary h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                                                >
                                                    Add to Bag
                                                </motion.button>
                                            </>
                                        ) : product.allowPreOrder ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleBuyNow}
                                                className="w-full bg-accent text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-accent/20 flex flex-col items-center justify-center leading-tight"
                                            >
                                                <span>Pre-order Now</span>
                                                {product.releaseDate && (
                                                    <span className="text-[8px] opacity-70">Estimated Drop: {new Date(product.releaseDate).toLocaleDateString()}</span>
                                                )}
                                            </motion.button>
                                        ) : (
                                            <div className="w-full space-y-3">
                                                <p className="text-[10px] font-black uppercase text-rose-500 text-center tracking-widest">Currently Unavailable</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        id="notify_email"
                                                        placeholder="Your email address"
                                                        className="flex-1 bg-muted px-4 py-3 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-accent"
                                                    />
                                                    <button
                                                        onClick={async () => {
                                                            const email = (document.getElementById('notify_email') as HTMLInputElement).value;
                                                            if (!email) return alert("Email required");
                                                            const res = await fetch("/api/products/stock/notify", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({
                                                                    productId: product._id,
                                                                    size: selectedSize,
                                                                    color: selectedColor,
                                                                    email
                                                                }),
                                                            });
                                                            const data = await res.json();
                                                            alert(data.message);
                                                        }}
                                                        className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                                    >
                                                        Notify
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Engagement */}
                                    <div className="space-y-4 pt-2">
                                        <WhatsAppButton
                                            productName={product.name}
                                            productSlug={product.slug}
                                            variant={selectedSize && selectedColor ? `${selectedSize}/${selectedColor}` : undefined}
                                        />

                                        <div className="bg-muted/30 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                                <PackageIcon className="w-5 h-5 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Estimated Delivery</p>
                                                <p className="text-[10px] font-bold text-muted-foreground italic">
                                                    {deliveryInfo.region === 'Kathmandu Valley' ? 'Standard: 1-2 Days' : 'Shipping: 3-5 Days'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Sticky CTA */}
                            <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 p-4 pb-8 lg:hidden flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-area-bottom">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleItem({
                                        _id: product._id,
                                        name: product.name,
                                        slug: product.slug,
                                        price: product.price,
                                        discountPrice: product.discountPrice,
                                        image: product.images[0]
                                    })}
                                    className={`w-14 h-14 border-2 rounded-2xl flex items-center justify-center transition-colors ${isWishlisted ? "border-accent text-accent fill-accent" : "border-gray-100 text-gray-400"}`}
                                >
                                    <Heart className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (currentVariant && currentVariant.stock > 0) {
                                            handleAddToCart();
                                        } else if (product.allowPreOrder) {
                                            handleBuyNow();
                                        } else {
                                            // Trigger modal or notification logic (simplified here)
                                            alert("Sign up for back-in-stock notifications above!");
                                        }
                                    }}
                                    className={`flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg ${currentVariant && currentVariant.stock > 0
                                        ? "bg-primary text-white"
                                        : product.allowPreOrder
                                            ? "bg-accent text-white"
                                            : "bg-muted text-muted-foreground opacity-50"
                                        }`}
                                >
                                    {currentVariant && currentVariant.stock > 0
                                        ? "Add to Bag"
                                        : product.allowPreOrder
                                            ? "Pre-order Now"
                                            : "Sold Out"}
                                </motion.button>
                                {(currentVariant && currentVariant.stock > 0) && (
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20"
                                    >
                                        Instant Buy
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Delivery, Return & Seller */}
                    <div className="lg:w-[25%] space-y-4">
                        {/* Delivery Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Service Options</p>
                                <div className="text-gray-200"><MapPin className="w-4 h-4" /></div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs font-bold text-primary leading-relaxed">{deliveryInfo.address}</p>
                                        <button onClick={() => setIsLocationModalOpen(true)} className="text-[10px] font-black text-accent hover:underline shrink-0 ml-2 tracking-widest">CHANGE</button>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                                    <Truck className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-black text-primary uppercase">Standard Delivery</p>
                                            <p className="text-[10px] text-muted-foreground font-bold italic">Arriving by {new Date(Date.now() + (deliveryInfo.region === 'Kathmandu Valley' ? 2 : 4) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <p className="text-xs font-black text-primary">Rs. {deliveryInfo.shippingPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl">
                                <Smartphone className="w-4 h-4 text-accent" />
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Cash on Delivery</p>
                            </div>
                        </div>

                        {/* Return & Warranty Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Return & Protection</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">14 Day Change of Mind</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Authenticity Guaranteed</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-primary p-6 rounded-xl border border-primary shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10 flex gap-4 items-center">
                                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                                    <Image
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://merosaaj.com/app"
                                        alt="QR Code"
                                        width={80}
                                        height={80}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[10px] text-white font-black leading-tight uppercase tracking-widest">Merosaaj App</p>
                                    <p className="text-[9px] text-primary-foreground/60 font-bold leading-tight">Scan for exclusive mobile drops & discounts.</p>
                                </div>
                            </div>
                        </div>

                        {/* Seller Section */}
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-accent">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest">Storefront</p>
                                        <p className="text-lg font-black text-primary tracking-tighter">merosaaj flagship</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => window.location.href = "mailto:support@merosaaj.com"}
                                        className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-accent text-[9px] font-black uppercase tracking-widest"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Support
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-3 rounded-xl border border-gray-50">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Seller Rating</p>
                                        <p className="text-xl font-black text-primary">81%</p>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-xl border border-gray-50">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">On-Time</p>
                                        <p className="text-xl font-black text-primary">100%</p>
                                    </div>
                                </div>
                            </div>
                            <Link href="/shop" className="block w-full py-4 text-center text-primary text-[10px] font-black hover:bg-muted transition-colors uppercase tracking-[0.3em] border-t border-gray-50">
                                Explore Store
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Product Description */}
                <div className="mt-8 bg-white p-6 md:p-12 rounded-lg border border-gray-100 shadow-sm">
                    <div className="max-w-3xl">
                        <h2 className="text-xl md:text-2xl font-black text-primary mb-6 md:mb-8 uppercase tracking-widest flex items-center gap-4">
                            <div className="w-8 h-1 bg-accent"></div>
                            The Story
                        </h2>
                        <div className="prose prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line font-medium italic">
                            {product.description}
                        </div>
                    </div>
                </div>

                <ReviewsSection productId={product._id} />

                <BundleSection productId={product._id} />

                <RelatedProducts category={product.category} currentProductId={product._id} />
            </main>

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelectLocation={(loc) => setDeliveryInfo(loc)}
                currentLocation={deliveryInfo}
            />
        </div>
    );
}
