"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import Image from "next/image";

export default function EditProductPage({ params }: { params: { id: string } }) {
    const { data: session }: any = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "Clothing",
        images: ["", "", ""],
        isFeatured: false,
        variants: [
            { size: "M", color: "Black", stock: 10 }
        ]
    });

    const categories = ["Clothing", "Accessories"];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();

                if (res.ok) {
                    setFormData({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        discountPrice: data.discountPrice || "",
                        category: data.category,
                        // Ensure we have at least 3 slots for images
                        images: [
                            data.images[0] || "",
                            data.images[1] || "",
                            data.images[2] || ""
                        ],
                        isFeatured: data.isFeatured || false,
                        variants: data.variants || []
                    });
                } else {
                    toast.error("Failed to load product");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Error loading product");
                router.push("/admin/products");
            } finally {
                setFetching(false);
            }
        };

        if (session?.user?.role === "ADMIN") {
            fetchProduct();
        }
    }, [params.id, session, router]);

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIndex(index);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                handleImageChange(index, data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed");
        } finally {
            setUploadingIndex(null);
        }
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { size: "L", color: "Black", stock: 10 }]
        }));
    };

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        const newVariants: any = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
                    images: formData.images.filter(img => img.trim() !== "")
                }),
            });

            if (res.ok) {
                toast.success("Product updated successfully");
                router.push("/admin/products");
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12">
            <button
                onClick={() => router.back()}
                className="flex items-center text-[10px] font-black text-muted-foreground hover:text-primary transition mb-8 uppercase tracking-[0.2em]"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
            </button>

            <div className="max-w-5xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Edit Product</h1>
                    <p className="text-muted-foreground mt-1">Make changes to your existing product.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info */}
                    <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest px-1">Product Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full p-4 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="e.g. Heritage Oversized Hoodie"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="w-full p-4 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Describe the aesthetic and materials..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest px-1">Price (Rs.)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        required
                                        className="w-full p-4 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="4500"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest px-1">Discount Price (Optional)</label>
                                    <input
                                        name="discountPrice"
                                        type="number"
                                        className="w-full p-4 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="3800"
                                        value={formData.discountPrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest px-1">Category</label>
                                    <select
                                        name="category"
                                        className="w-full p-4 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent appearance-none"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        id="isFeatured"
                                        className="w-5 h-5 accent-accent"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="isFeatured" className="text-sm font-bold cursor-pointer">Feature on Homepage</label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Images */}
                    <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">Product Photography</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.images.map((img, i) => (
                                <div key={i} className="space-y-4">
                                    <label className="block group cursor-pointer">
                                        <div className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden border border-border relative group-hover:border-accent transition-colors">
                                            {img ? (
                                                <Image
                                                    src={img}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                                                    <ImageIcon className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Click to Upload</span>
                                                </div>
                                            )}
                                            {uploadingIndex === i && (
                                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold uppercase animate-pulse">Uploading...</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(i, e)}
                                        />
                                    </label>
                                    <input
                                        className="w-full p-3 bg-muted/50 border border-border rounded-xl text-[10px] outline-none focus:ring-1 focus:ring-accent font-mono"
                                        placeholder="Or paste URL..."
                                        value={img}
                                        onChange={(e) => handleImageChange(i, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Inventory/Variants */}
                    <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory & Variants</h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="text-[10px] font-black uppercase tracking-tighter bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-accent transition"
                            >
                                Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.variants.map((v, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 items-end bg-muted/20 p-4 rounded-2xl border border-border/50">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase px-1">Size</label>
                                        <input
                                            className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none"
                                            value={v.size}
                                            onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase px-1">Color</label>
                                        <input
                                            className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none"
                                            value={v.color}
                                            onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase px-1">Stock</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none"
                                            value={v.stock}
                                            onChange={(e) => handleVariantChange(i, "stock", Number(e.target.value))}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(i)}
                                        disabled={formData.variants.length === 1}
                                        className="p-3 text-muted-foreground hover:text-destructive transition disabled:opacity-20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <button
                        disabled={loading}
                        className="w-full py-6 bg-primary text-primary-foreground font-black text-xl uppercase tracking-widest rounded-3xl hover:bg-accent transition shadow-xl disabled:opacity-50"
                    >
                        {loading ? "Saving Changes..." : "Update Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
