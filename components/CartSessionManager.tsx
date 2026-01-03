"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/store";

export default function CartSessionManager() {
    const { data: session } = useSession();
    const clearCart = useCart((state) => state.clearCart);
    const userId = (session?.user as any)?.id;
    const prevUserIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        // If we were logged in (prevUserIdRef.current is truthy)
        // and now the userId is different (either a different user or logged out)
        if (prevUserIdRef.current && prevUserIdRef.current !== userId) {
            clearCart();
        }

        // Update the ref with the current user ID
        prevUserIdRef.current = userId;
    }, [userId, clearCart]);

    return null;
}
