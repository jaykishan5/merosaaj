"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

function OrderSuccessModalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setIsOpen(true);
            toast.success("Order Placed Successfully!", {
                description: "Welcome to the MeroSaaj family.",
                duration: 5000,
            });
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsOpen(false);
        // Clean up URL without refresh
        const params = new URLSearchParams(searchParams.toString());
        params.delete("success");
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl, { scroll: false });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none bg-white z-[100]">
                <div className="bg-[#8B0000] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/20"
                    >
                        <CheckCircle2 className="w-10 h-10 text-[#8B0000]" />
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-black uppercase tracking-tighter italic mb-2 relative z-10"
                    >
                        Order Placed!
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] relative z-10"
                    >
                        Welcome to the MeroSaaj family
                    </motion.p>
                </div>

                <div className="p-10 space-y-8">
                    <p className="text-center text-muted-foreground text-[10px] font-bold leading-relaxed uppercase tracking-widest">
                        Your streetwear is being prepared. We've sent a confirmation email with all the details. Get ready to flex.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/profile/orders"
                            onClick={handleClose}
                            className="flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/20 group"
                        >
                            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Track My Order
                        </Link>
                        <button
                            onClick={handleClose}
                            className="flex items-center justify-center gap-3 bg-gray-100 text-[#1a1a1a] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                        >
                            Back to Streets
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function OrderSuccessModal() {
    return (
        <Suspense fallback={null}>
            <OrderSuccessModalContent />
        </Suspense>
    );
}
