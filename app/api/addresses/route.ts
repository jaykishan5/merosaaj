import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Address from "@/models/Address";

// GET - Fetch all addresses for current user
export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await dbConnect();
        const addresses = await Address.find({ user: session.user.id }).sort({ isDefault: -1, createdAt: -1 });

        return NextResponse.json(addresses);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch addresses" }, { status: 500 });
    }
}

// POST - Create new address
export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { label, fullName, address, city, phone, region, isDefault } = await req.json();

        if (!fullName || !address || !city || !phone || !region) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const newAddress = await Address.create({
            user: session.user.id,
            label,
            fullName,
            address,
            city,
            phone,
            region,
            isDefault: isDefault || false,
        });

        return NextResponse.json({ message: "Address created successfully", address: newAddress }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to create address" }, { status: 500 });
    }
}

// PUT - Update existing address
export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { _id, label, fullName, address, city, phone, region, isDefault } = await req.json();

        if (!_id) {
            return NextResponse.json({ message: "Address ID required" }, { status: 400 });
        }

        await dbConnect();

        // Verify ownership
        const existingAddress = await Address.findOne({ _id, user: session.user.id });
        if (!existingAddress) {
            return NextResponse.json({ message: "Address not found" }, { status: 404 });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            _id,
            { label, fullName, address, city, phone, region, isDefault },
            { new: true }
        );

        return NextResponse.json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to update address" }, { status: 500 });
    }
}

// DELETE - Remove address
export async function DELETE(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get('id');

        if (!addressId) {
            return NextResponse.json({ message: "Address ID required" }, { status: 400 });
        }

        await dbConnect();

        // Verify ownership
        const address = await Address.findOne({ _id: addressId, user: session.user.id });
        if (!address) {
            return NextResponse.json({ message: "Address not found" }, { status: 404 });
        }

        await Address.findByIdAndDelete(addressId);

        return NextResponse.json({ message: "Address deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to delete address" }, { status: 500 });
    }
}
