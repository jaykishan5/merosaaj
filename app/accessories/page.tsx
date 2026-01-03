import Navbar from "@/components/Navbar";
import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

async function getProducts(category: string) {
    await dbConnect();
    return await Product.find({ category }).sort({ createdAt: -1 }).lean();
}

export default async function AccessoriesPage() {
    const products: any = await getProducts("Accessories");

    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold tracking-tighter italic">ACCESSORIES</h1>
                    <p className="text-muted-foreground mt-2">The finishing touches for your fit.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map((product: any) => (
                            <div key={product._id} className="group">
                                <Link href={`/product/${product.slug}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xl mb-4">
                                        <Image
                                            src={product.images[0] || "/placeholder.jpg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold group-hover:text-accent transition">{product.name}</h3>
                                    <p className="font-bold mt-1">{formatPrice(product.price)}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground">No accessories found.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
