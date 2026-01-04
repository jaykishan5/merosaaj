import mongoose, { Schema, Document } from 'mongoose';

export interface IStockNotification extends Document {
    user?: mongoose.Types.ObjectId;
    email: string;
    product: mongoose.Types.ObjectId;
    variant: {
        size: string;
        color: string;
    };
    isNotified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StockNotificationSchema = new Schema<IStockNotification>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: {
            size: { type: String, required: true },
            color: { type: String, required: true },
        },
        isNotified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.StockNotification || mongoose.model<IStockNotification>('StockNotification', StockNotificationSchema);
