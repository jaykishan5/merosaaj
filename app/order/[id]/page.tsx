import { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading Order Details...</div>}>
            <OrderSuccessClient />
        </Suspense>
    );
}
