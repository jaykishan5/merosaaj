import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { notFound } from "next/navigation";

import dbConnect from "@/lib/mongodb";
import Collection from "@/models/Collection";

async function getCollection(slug: string) {
    await dbConnect();
    const collection = await Collection.findOne({ slug }).populate("products").lean();
    if (!collection) return null;
    return JSON.parse(JSON.stringify(collection));
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
    const collection = await getCollection(params.slug);

    if (!collection) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <Breadcrumbs />

                {/* Hero section */}
                <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
                    <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 shadow-sm">
                            {collection.name}
                        </h1>
                        <p className="text-white/90 text-sm md:text-lg max-w-2xl font-bold italic">
                            {collection.description}
                        </p>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    {collection.products.map((product: any) => (
                        <ProductCard key={product._id} product={product} width="w-full" />
                    ))}
                </div>

                {collection.products.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground italic font-medium">
                        Products coming soon...
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
