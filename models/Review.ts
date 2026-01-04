import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: {
        name: string;
        email: string;
    };
    rating: number; // 1-5
    comment: string;
    images?: string[]; // New field for user photos
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        user: {
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        images: [{ type: String }],
    },
    { timestamps: true }
);

// Prevent duplicate reviews from same user on same product
// ReviewSchema.index({ product: 1, 'user.email': 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
