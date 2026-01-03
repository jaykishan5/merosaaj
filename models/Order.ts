import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    name: string;
    quantity: number;
    image: string;
    price: number;
    product: mongoose.Types.ObjectId;
    size: string;
    color: string;
}

export interface IShippingAddress {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    region: 'Kathmandu Valley' | 'Outside Valley';
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderItems: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: 'COD' | 'eSewa' | 'Khalti';
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                size: { type: String, required: true },
                color: { type: String, required: true },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String, required: true },
            region: { type: String, required: true, enum: ['Kathmandu Valley', 'Outside Valley'] },
        },
        paymentMethod: { type: String, required: true, enum: ['COD', 'eSewa', 'Khalti'] },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
