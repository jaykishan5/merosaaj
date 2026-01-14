import { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrderPage({ params }: { params: { id: string } }) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect(`/login?callbackUrl=/order/${params.id}`);
    }

    await dbConnect();
    const order = await Order.findById(params.id).lean();

    if (!order) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Order Not Found</h1>
                    <p className="text-muted-foreground text-sm font-medium">The order you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    // Security check
    const isOwner = order.user?.toString() === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Access Denied</h1>
                    <p className="text-muted-foreground text-sm font-medium">You don't have permission to view this order.</p>
                </div>
            </div>
        );
    }

    // Serialize MongoDB object for Client Component
    const serializedOrder = JSON.parse(JSON.stringify(order));

    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading Order Details...</div>}>
            <OrderSuccessClient initialOrder={serializedOrder} />
        </Suspense>
    );
}
