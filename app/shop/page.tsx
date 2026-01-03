import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading Store...</div>}>
            <ShopClient />
        </Suspense>
    );
}
