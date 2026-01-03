
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Minimal Product Schema Definition for Seeding
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true }, // "Clothing", "Accessories"
    gender: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] },
    images: { type: [String], required: true },
    variants: [{
        size: { type: String, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 }
    }],
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
}, { timestamps: true });

// Check if model exists before compiling
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const seedProducts = [
    // --- MEN'S CLOTHING ---
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
        tags: ["Best Seller", "Essential"]
    },
    {
        name: "Nomad Technical Bomber",
        slug: "nomad-bomber",
        description: "Water-resistant bomber jacket with utility pockets.",
        price: 5500,
        category: "Clothing",
        gender: "Men",
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80"],
        variants: [{ size: "L", color: "Black", stock: 10 }, { size: "XL", color: "Black", stock: 5 }],
        isFeatured: false,
        tags: ["New Arrival"]
    },
    {
        name: "Driftwood Cargo Shorts",
        slug: "driftwood-shorts",
        description: "Durable cotton canvas cargo shorts for urban exploration.",
        price: 2400,
        category: "Clothing",
        gender: "Men",
        images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80"],
        variants: [{ size: "30", color: "Khaki", stock: 15 }, { size: "32", color: "Khaki", stock: 15 }],
        isFeatured: false,
    },
    {
        name: "Apex Performance Joggers",
        slug: "apex-joggers",
        description: "Tapered fit joggers with moisture-wicking fabric.",
        price: 3200,
        category: "Clothing",
        gender: "Men",
        images: ["https://images.unsplash.com/photo-1623886538562-42173f443b74?auto=format&fit=crop&q=80"], // Just a placeholder
        variants: [{ size: "M", color: "Black", stock: 20 }],
        isFeatured: true, // Best seller candidate
    },

    // --- WOMEN'S CLOTHING ---
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
        tags: ["Streetwear"]
    },
    {
        name: "Urban Cropped Hoodie",
        slug: "urban-cropped-hoodie",
        description: "Soft fleece cropped hoodie.",
        price: 2800,
        category: "Clothing",
        gender: "Women",
        images: ["https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80"],
        variants: [{ size: "S", color: "Grey", stock: 15 }, { size: "M", color: "Grey", stock: 10 }],
        isFeatured: true,
        tags: ["Cozy"]
    },
    {
        name: "High-Rise Denim Skirt",
        slug: "denim-skirt",
        description: "Classic denim skirt with a raw hem finish.",
        price: 2600,
        category: "Clothing",
        gender: "Women",
        images: ["https://images.unsplash.com/photo-1582142327417-731b5c004a8b?auto=format&fit=crop&q=80"], // Placeholder
        variants: [{ size: "28", color: "Blue", stock: 10 }],
        isFeatured: false,
    },
    {
        name: "Mesh Layered Top",
        slug: "mesh-top",
        description: "Edgy mesh top for layering.",
        price: 1500,
        category: "Clothing",
        gender: "Women",
        images: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80"], // Placeholder
        variants: [{ size: "S", color: "Black", stock: 20 }],
        isFeatured: false,
        tags: ["Party"]
    },

    // --- UNISEX CLOTHING ---
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
        tags: ["Premium", "Featured"]
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
        tags: ["Limited"] // Important for Limited filter
    },
    {
        name: "Oversized Flannel Shirt",
        slug: "flannel-shirt",
        description: "Comfortable oversized flannel in earthy tones.",
        price: 2800,
        category: "Clothing",
        gender: "Unisex",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80"],
        variants: [{ size: "L", color: "Plaid", stock: 15 }],
        isFeatured: false,
    },

    // --- ACCESSORIES (Mostly Unisex) ---
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
        tags: ["Best Seller"]
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
    },
    {
        name: "Canvas Tote Bag",
        slug: "canvas-tote",
        description: "Durable canvas tote with logo print.",
        price: 800,
        category: "Accessories",
        gender: "Unisex",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80"],
        variants: [{ size: "One Size", color: "Beige", stock: 100 }],
        isFeatured: false,
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Cleared!');

        console.log('Inserting seed data...');
        await Product.insertMany(seedProducts);
        console.log('Successfully seeded ' + seedProducts.length + ' products!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
