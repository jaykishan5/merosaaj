import mongoose, { Schema, Document } from 'mongoose';

export interface IReturnRequest extends Document {
    user: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        reason: string;
        condition: string;
    }[];
    status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
    refundAmount: number;
    adminComment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReturnRequestSchema = new Schema<IReturnRequest>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                reason: { type: String, required: true },
                condition: { type: String, required: true },
            },
        ],
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Approved', 'Rejected', 'Refunded'],
        },
        refundAmount: { type: Number, required: true, default: 0 },
        adminComment: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.ReturnRequest || mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);
