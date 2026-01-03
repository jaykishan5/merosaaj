import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");
        const category = searchParams.get("category");
        const gender = searchParams.get("gender");
        const search = searchParams.get("search");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const color = searchParams.get("color");

        await dbConnect();

        // Auto-seed if database is empty
        const count = await Product.countDocuments();
        if (count === 0) {
            const seedProducts = [
                // MEN'S CLOTHING
                {
                    name: "Valley Oversized Tee",
                    slug: "valley-oversized-tee",
                    description: "Minimalist off-white tee with premium drop-shoulder fit. Essential urban wear.",
                    price: 1800,
                    category: "Clothing",
                    gender: "Men",
                    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80"],
                    variants: [{ size: "M", color: "Cream", stock: 20 }, { size: "L", color: "Cream", stock: 25 }],
                    isFeatured: true,
                },
                {
                    name: "Nomad Technical Bomber",
                    slug: "nomad-bomber",
                    description: "Water-resistant bomber jacket with utility pockets.",
                    price: 5500,
                    category: "Clothing",
                    gender: "Men",
                    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80"],
                    variants: [{ size: "L", color: "Black", stock: 10 }],
                    isFeatured: false,
                },

                // WOMEN'S CLOTHING
                {
                    name: "Nomad Cargo Pants",
                    slug: "nomad-cargo",
                    description: "Functional streetwear cargo pants with adjustable straps and multiple pockets.",
                    price: 3200,
                    category: "Clothing",
                    gender: "Women",
                    images: ["https://images.unsplash.com/photo-1517438476312-10d79c67750d?auto=format&fit=crop&q=80"],
                    variants: [{ size: "30", color: "Black", stock: 5 }, { size: "32", color: "Black", stock: 12 }],
                    isFeatured: false,
                },
                {
                    name: "Urban Cropped Hoodie",
                    slug: "urban-cropped-hoodie",
                    description: "Soft fleece cropped hoodie.",
                    price: 2800,
                    category: "Clothing",
                    gender: "Women",
                    images: ["https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80"],
                    variants: [{ size: "S", color: "Grey", stock: 15 }],
                    isFeatured: true,
                },

                // UNISEX CLOTHING
                {
                    name: "Merosaaj Heritage Hoodie",
                    slug: "heritage-hoodie",
                    description: "Heavyweight charcoal hoodie featuring hand-embroidered cultural motifs. 100% organic cotton.",
                    price: 4500,
                    discountPrice: 3800,
                    category: "Clothing",
                    gender: "Unisex",
                    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80"],
                    variants: [{ size: "M", color: "Charcoal", stock: 15 }, { size: "L", color: "Charcoal", stock: 8 }],
                    isFeatured: true,
                },
                {
                    name: "Limited Edition Graphic Tee",
                    slug: "ltd-graphic-tee",
                    description: "Limited run graphic tee designed by local artist.",
                    price: 2200,
                    category: "Clothing",
                    gender: "Unisex",
                    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80"],
                    variants: [{ size: "L", color: "Black", stock: 5 }],
                    isFeatured: true,
                },

                // ACCESSORIES (Mostly Unisex)
                {
                    name: "Identity Snapback",
                    slug: "identity-snapback",
                    description: "Structured 6-panel cap with 'identity' 3D embroidery.",
                    price: 1200,
                    category: "Accessories",
                    gender: "Unisex",
                    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80"],
                    variants: [{ size: "Adjustable", color: "Black", stock: 50 }],
                    isFeatured: true,
                },
                {
                    name: "Utility Crossbody Bag",
                    slug: "utility-bag",
                    description: "Compact bag for essentials.",
                    price: 1800,
                    category: "Accessories",
                    gender: "Unisex",
                    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80"],
                    variants: [{ size: "One Size", color: "Olive", stock: 25 }],
                    isFeatured: false,
                },
                {
                    name: "Silver Chain Necklace",
                    slug: "chain-necklace",
                    description: "Sterling silver chain with minimal pendant.",
                    price: 2500,
                    category: "Accessories",
                    gender: "Unisex",
                    images: ["https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80"],
                    variants: [{ size: "One Size", color: "Silver", stock: 10 }],
                    isFeatured: false,
                }
            ];
            await Product.insertMany(seedProducts);
        }

        // Build filter
        const filter: any = {};

        // Fetch single product
        if (id) {
            const product = await Product.findById(id);
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
            return NextResponse.json(product);
        }

        if (slug) {
            const product = await Product.findOne({ slug });
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
            return NextResponse.json(product);
        }

        if (category && category !== "all") {
            if (category === "Best Sellers") {
                filter.isFeatured = true;
            } else if (category === "Limited") {
                // For demo purposes, treat low stock as "Limited" or just use a specific tag if schema allowed.
                // Let's filter products with "Limited" in the name or description, AND/OR small stock.
                // Or simpler: just ensure we seed items with 'category: "Limited"' if that's what the user wants,
                // BUT "Limited" acts more like a tag. 
                // Let's use specific logic: items with "Limited" in name.
                filter.name = { $regex: "Limited", $options: "i" };
            } else {
                filter.category = category;
            }
        }

        if (gender && gender !== "all") {
            if (gender === "Men" || gender === "Women") {
                filter.gender = { $in: [gender, "Unisex"] };
            } else {
                filter.gender = gender;
            }
        }
        if (search) filter.name = { $regex: search, $options: "i" };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (color && color !== "all") {
            filter["variants.color"] = color;
        }

        const sortParam = searchParams.get("sort");
        let sortQuery: any = { createdAt: -1 }; // Default to newest

        if (sortParam === "price_asc") {
            sortQuery = { price: 1 };
        } else if (sortParam === "price_desc") {
            sortQuery = { price: -1 };
        } else if (sortParam === "oldest") {
            sortQuery = { createdAt: 1 };
        }

        const products = await Product.find(filter).sort(sortQuery);
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // If it's a single product object
        if (data.name) {
            const product = await Product.create({
                ...data,
                slug: data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                gender: data.gender || 'Unisex'
            });
            return NextResponse.json(product, { status: 201 });
        }

        // Fallback to seed if empty array or no name provided
        const sampleProducts = [
            // MEN'S CLOTHING
            {
                name: "Valley Oversized Tee",
                slug: "valley-oversized-tee",
                description: "Minimalist off-white tee with premium drop-shoulder fit. Essential urban wear.",
                price: 1800,
                category: "Clothing",
                gender: "Men",
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80"],
                variants: [{ size: "M", color: "Cream", stock: 20 }, { size: "L", color: "Cream", stock: 25 }],
                isFeatured: true,
            },
            {
                name: "Nomad Technical Bomber",
                slug: "nomad-bomber",
                description: "Water-resistant bomber jacket with utility pockets.",
                price: 5500,
                category: "Clothing",
                gender: "Men",
                images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80"],
                variants: [{ size: "L", color: "Black", stock: 10 }],
                isFeatured: false,
            },

            // WOMEN'S CLOTHING
            {
                name: "Nomad Cargo Pants",
                slug: "nomad-cargo",
                description: "Functional streetwear cargo pants with adjustable straps and multiple pockets.",
                price: 3200,
                category: "Clothing",
                gender: "Women",
                images: ["https://images.unsplash.com/photo-1517438476312-10d79c67750d?auto=format&fit=crop&q=80"],
                variants: [{ size: "30", color: "Black", stock: 5 }, { size: "32", color: "Black", stock: 12 }],
                isFeatured: false,
            },
            {
                name: "Urban Cropped Hoodie",
                slug: "urban-cropped-hoodie",
                description: "Soft fleece cropped hoodie.",
                price: 2800,
                category: "Clothing",
                gender: "Women",
                images: ["https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80"],
                variants: [{ size: "S", color: "Grey", stock: 15 }],
                isFeatured: true,
            },

            // UNISEX CLOTHING
            {
                name: "Merosaaj Heritage Hoodie",
                slug: "heritage-hoodie",
                description: "Heavyweight charcoal hoodie featuring hand-embroidered cultural motifs. 100% organic cotton.",
                price: 4500,
                discountPrice: 3800,
                category: "Clothing",
                gender: "Unisex",
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80"],
                variants: [{ size: "M", color: "Charcoal", stock: 15 }, { size: "L", color: "Charcoal", stock: 8 }],
                isFeatured: true,
            },
            {
                name: "Limited Edition Graphic Tee",
                slug: "ltd-graphic-tee",
                description: "Limited run graphic tee designed by local artist.",
                price: 2200,
                category: "Clothing",
                gender: "Unisex",
                images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80"],
                variants: [{ size: "L", color: "Black", stock: 5 }],
                isFeatured: true,
            },

            // ACCESSORIES (Mostly Unisex)
            {
                name: "Identity Snapback",
                slug: "identity-snapback",
                description: "Structured 6-panel cap with 'identity' 3D embroidery.",
                price: 1200,
                category: "Accessories",
                gender: "Unisex",
                images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80"],
                variants: [{ size: "Adjustable", color: "Black", stock: 50 }],
                isFeatured: true,
            },
            {
                name: "Utility Crossbody Bag",
                slug: "utility-bag",
                description: "Compact bag for essentials.",
                price: 1800,
                category: "Accessories",
                gender: "Unisex",
                images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80"],
                variants: [{ size: "One Size", color: "Olive", stock: 25 }],
                isFeatured: false,
            },
            {
                name: "Silver Chain Necklace",
                slug: "chain-necklace",
                description: "Sterling silver chain with minimal pendant.",
                price: 2500,
                category: "Accessories",
                gender: "Unisex",
                images: ["https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80"],
                variants: [{ size: "One Size", color: "Silver", stock: 10 }],
                isFeatured: false,
            }
        ];

        await Product.insertMany(sampleProducts);
        return NextResponse.json({ message: "Seed successful" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
