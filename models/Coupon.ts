import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxUses?: number;
    usedCount: number;
    usesPerUser: number;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
        discountValue: { type: Number, required: true },
        minOrderAmount: { type: Number, default: 0 },
        maxUses: { type: Number },
        usedCount: { type: Number, default: 0 },
        usesPerUser: { type: Number, default: 1 },
        expiresAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
