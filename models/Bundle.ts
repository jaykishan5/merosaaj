import mongoose, { Schema, Document } from "mongoose";

export interface IBundle extends Document {
    name: string;
    slug: string;
    description: string;
    products: {
        product: mongoose.Types.ObjectId;
        variant: {
            size: string;
            color: string;
        };
    }[];
    price: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                variant: {
                    size: { type: String, required: true },
                    color: { type: String, required: true },
                },
            },
        ],
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Bundle || mongoose.model<IBundle>("Bundle", BundleSchema);
