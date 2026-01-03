"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Edit, Package, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchProducts();
        }
    }, [status, session]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex-1 flex items-center justify-center p-20">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Loading Inventory</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Inventory Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your collection and stock levels.</p>
                </div>
                <button
                    onClick={() => router.push("/admin/products/add")}
                    className="flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Product
                </button>
            </div>

            <div className="relative mb-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products or categories..."
                    className="w-full pl-14 pr-6 py-5 bg-card border border-border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product: any) => (
                    <div key={product._id} className="bg-card p-5 rounded-3xl border border-border flex items-center gap-6 hover:shadow-xl hover:border-primary/20 transition-all group">
                        <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 bg-muted border border-border">
                            <Image
                                src={product.images[0] || "/placeholder.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-lg truncate mb-1">{product.name}</h3>
                            <div className="flex items-center gap-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">{product.category}</span>
                                <span className="font-black text-sm">{formatPrice(product.price)}</span>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col items-center px-10 border-x border-border">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 text-center">In Stock</span>
                            <span className="font-black text-lg">{product.variants.reduce((acc: number, v: any) => acc + v.stock, 0)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                                className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => deleteProduct(product._id)}
                                className="p-3 bg-muted hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/30">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
