import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    phone?: string;
    role: 'CUSTOMER' | 'ADMIN';
    searchHistory?: string[];
    loyaltyPoints: number;
    lifetimeSpent: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        image: { type: String },
        phone: { type: String },
        role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
        searchHistory: [{ type: String }],
        loyaltyPoints: { type: Number, default: 0 },
        lifetimeSpent: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
