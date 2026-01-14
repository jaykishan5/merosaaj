import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

async function getFeaturedProducts() {
    await dbConnect();
    return await Product.find({ isFeatured: true }).limit(10).lean();
}

const categories = [
    { name: "Best Sellers", icon: "🔥", href: "/shop?category=Best Sellers" },
    { name: "New Drops", icon: "✨", href: "/shop?sort=newest" },
    { name: "T-Shirts", icon: "👕", href: "/shop?search=Tee" },
    { name: "Hoodies", icon: "🧥", href: "/shop?search=Hoodie" },
    { name: "ACCESSORIES", icon: "🎒", href: "/shop?category=Accessories" },
    { name: "LIMITED", icon: "💎", href: "/shop?category=Limited" },
];

export default async function Home() {
    const products: any = await getFeaturedProducts();

    return (
        <main className="min-h-screen bg-[#FDFDFD]">
            <Navbar />

            {/* Standard Spacer for tiered Navbar */}
            <div className="h-[110px] md:h-[135px]"></div>

            <Hero />

            <section className="py-8 md:py-12 bg-white border-b border-gray-50 relative z-30">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 overflow-visible">
                    <div className="flex gap-6 md:gap-12 md:justify-center overflow-x-auto pt-4 pb-4 scrollbar-none snap-x snap-proximity">
                        {categories.map((cat) => (
                            <Link
                                href={cat.href}
                                key={cat.name}
                                className="flex flex-col items-center gap-3 md:gap-4 shrink-0 group transition-all duration-500 snap-center"
                            >
                                <div className="relative">
                                    {/* Perfect Ring Effect (Outer Expanding Circle) */}
                                    <div className="absolute inset-0 rounded-full border-2 border-accent scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"></div>

                                    {/* Main Icon Circle */}
                                    <div className="w-14 h-14 md:w-24 md:h-24 rounded-full bg-[#f8f8f8] flex items-center justify-center text-2xl md:text-5xl border-2 border-transparent group-hover:border-accent group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 relative z-10 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="group-hover:scale-110 transition-transform duration-500">{cat.icon}</span>
                                    </div>
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary group-hover:translate-y-1 transition-all text-center">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-accent animate-pulse">
                            <Sparkles className="w-4 h-4 fill-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trending Now</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">HOTTEST DROPS</h2>
                    </div>
                    <Link href="/shop" className="group flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-2 border-primary pb-2">
                        View More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="px-4 md:px-6 max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 overflow-visible">
                        {products.length > 0 ? (
                            products.map((product: any) => (
                                <ProductCard key={product._id} product={product} width="w-full" />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-4 border-dashed border-muted rounded-[3rem]">
                                <p className="text-muted-foreground font-black italic">Curating next drop...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories Bricks (Large Visuals) */}
            <section className="py-24 bg-primary text-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl">
                            <Image
                                src="/images/modern-streetwear.png" // Generated premium asset
                                alt="Modern Streetwear"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                                <span className="text-accent font-black uppercase tracking-[0.4em] mb-4 text-[10px] md:text-xs">Identity Collection</span>
                                <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic">MODERN <br /> STREETWEAR</h3>
                                <Link href="/shop" className="bg-white text-primary w-fit px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl">Shop Now</Link>
                            </div>
                        </div>
                        <div className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl">
                            <Image
                                src="/images/premium-accessories.png" // Generated premium asset
                                alt="Accessories"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-12">
                                <span className="text-accent font-black uppercase tracking-[0.4em] mb-4">The Kit</span>
                                <h3 className="text-4xl font-black tracking-tighter mb-8 italic">PREMIUM ACCESSORIES</h3>
                                <Link href="/accessories" className="border-2 border-white w-fit px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Explore</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
