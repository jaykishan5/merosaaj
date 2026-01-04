import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import dbConnect from "@/lib/mongodb";
import Collection from "@/models/Collection";

async function getCollections() {
    await dbConnect();
    const collections = await Collection.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(collections));
}

export default async function CollectionsPage() {
    const collections = await getCollections();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <Breadcrumbs />

                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                        Curated <span className="text-accent">Collections</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-xl">
                        Expertly curated themes and drops. Discover the soul of Merosaaj through our signature looks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {collections.map((collection: any) => (
                        <Link
                            key={collection._id}
                            href={`/collections/${collection.slug}`}
                            className="group relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-muted shadow-2xl"
                        >
                            <Image
                                src={collection.image}
                                alt={collection.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 md:p-12 flex flex-col justify-end">
                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic mb-2">
                                    {collection.name}
                                </h2>
                                <p className="text-white/70 text-sm md:text-base max-w-md line-clamp-2 mb-6">
                                    {collection.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="h-[2px] w-12 bg-accent"></span>
                                    <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Explore Drop</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {collections.length === 0 && (
                    <div className="py-32 text-center border-2 border-dashed border-border rounded-[2rem]">
                        <p className="text-muted-foreground italic font-bold">New collections dropping soon...</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
