import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant extends Document {
    size: string;
    color: string;
    stock: number;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    gender: 'Men' | 'Women' | 'Unisex';
    images: string[];
    variants: IVariant[];
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        category: { type: String, required: true },
        gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
        images: [{ type: String }],
        variants: [VariantSchema],
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
