import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    products: mongoose.Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);
