import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    label: 'Home' | 'Work' | 'Other';
    fullName: string;
    address: string;
    city: string;
    phone: string;
    region: 'Kathmandu Valley' | 'Outside Valley';
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        region: { type: String, required: true, enum: ['Kathmandu Valley', 'Outside Valley'] },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure only one default address per user
AddressSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await mongoose.model('Address').updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

export default mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
