import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Image from 'next/image';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
    order: any | null;
    isOpen: boolean;
    onClose: () => void;
    onOrderUpdated?: () => void;
    enableReturns?: boolean;
}

export default function OrderDetailsModal({ order, isOpen, onClose, onOrderUpdated, enableReturns = false }: OrderDetailsModalProps) {
    const [isReturnMode, setIsReturnMode] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [returnComment, setReturnComment] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [hasReturn, setHasReturn] = useState(false);

    // Reset state when modal opens/closes or order changes
    useEffect(() => {
        if (isOpen) {
            setIsReturnMode(false);
            setReturnReason("");
            setReturnComment("");
            setIsSuccess(false);
            checkReturnStatus();
        }
    }, [isOpen, order]);

    const checkReturnStatus = async () => {
        if (!order) return;
        try {
            // This is a bit inefficient to fetch all user orders to check one status or use a dedicated endpoint. 
            // For now, let's just assume we check via a new endpoint or the create endpoint handles it. 
            // Actually, best to have a GET endpoint for specific order return status. 
            // Or simpler: The order object itself likely doesn't have it unless populated.
            // Let's rely on the user trying to open it or fetch a check.
            // A better way for this MVP:
            // Let's add a lightweight check call or just handle the error from the API 
            // AND adding a client-side check if we have the data.
            // Since we don't have the data in `order` prop easily without re-fetching, 
            // Let's just create a `useEffect` that calls an API to check if return exists for this order.

            // To save time/complexity, I'll hit the create endpoint with a dry-run or 
            // just assume if the user has returns in their profile they are loaded. 
            // No, independent check is safer.
            // Let's add a GET /api/returns/check?orderId=... 
            // BUT I haven't created that route. 
            // Implementation: I will just try to create it and if it fails with 'already exists' I show that state? 
            // No, I want to disable the button if it exists.

            // Let's query the specific return for this order.
            const res = await fetch(`/api/returns?orderId=${order._id}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setHasReturn(true);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl w-[95vw] rounded-3xl p-0 overflow-hidden bg-background shadow-2xl border-none">
                <DialogHeader className="flex flex-row items-center justify-between px-8 py-6 bg-primary text-primary-foreground">
                    <div>
                        <DialogTitle className="text-xl font-black italic tracking-tighter">
                            ORDER #{order._id.substring(0, 8).toUpperCase()}
                        </DialogTitle>
                        <p className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest mt-1">Transaction Detailed Brief</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                </DialogHeader>
                <DialogDescription className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {/* Order Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-border/50">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Placement Date</p>
                            <p className="font-bold text-primary italic">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
                            <p className="font-black text-2xl text-accent italic">{formatPrice(order.totalPrice)}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-accent/20"></div>
                            Acquired Artifacts
                        </h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item: any) => (
                                <div key={item._id} className="flex items-center gap-4 group">
                                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-muted border border-border/50 shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm uppercase tracking-tight text-primary truncate italic">{item.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                            {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <span className="px-2 py-0.5 bg-muted rounded-md text-[9px] font-black uppercase">{item.size}</span>
                                            <span className="px-2 py-0.5 bg-muted rounded-md text-[9px] font-black uppercase">{item.color}</span>
                                        </div>
                                    </div>
                                    <p className="font-black text-sm italic">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Shipping Destination
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase italic">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-muted-foreground font-medium">{order.shippingAddress.address}</p>
                                <p className="text-sm text-muted-foreground font-medium">{order.shippingAddress.city}, {order.shippingAddress.phone}</p>
                            </div>

                            {/* Shipping Label Logic */}
                            <div className="pt-4 border-t border-dashed border-border/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                                    Logistics
                                </h3>
                                {order.trackingNumber ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold">Carrier: <span className="text-primary">{order.carrier}</span></p>
                                        <p className="text-xs font-bold">Tracking: <span className="font-mono bg-muted px-1 rounded">{order.trackingNumber}</span></p>
                                        {order.shippingLabelUrl && (
                                            <a href={order.shippingLabelUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline block mt-1">
                                                View Label
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    (order.status === 'Processing' || order.status === 'Pending') && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/shipping/label", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ orderId: order._id }),
                                                    });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        toast.success(`Label generated! Tracking: ${data.trackingNumber}`);
                                                        if (onOrderUpdated) onOrderUpdated();
                                                    } else {
                                                        toast.error("Failed to generate label");
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    toast.error("Error generating label");
                                                }
                                            }}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full"
                                        >
                                            Generate Shipping Label
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Settlement Logic
                            </h3>
                            <div className="space-y-2">
                                <div className="inline-flex items-center px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{order.paymentMethod}</span>
                                </div>
                                {order.paymentResult && (
                                    <div className="text-[10px] text-muted-foreground font-medium space-y-1">
                                        <p>REF: {order.paymentResult.id}</p>
                                        <p className="uppercase tracking-tighter">STATUS: <span className="text-green-600 font-bold">{order.paymentResult.status}</span></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Return Request (Customer) */}
                    {enableReturns && order.status === 'Delivered' && (
                        <div className="pt-6 border-t border-border/50">
                            {!isReturnMode ? (
                                <div className="bg-muted/30 p-4 rounded-3xl border border-border/50 flex flex-col items-center text-center space-y-3">
                                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                                        <RefreshCw className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Return Available</h3>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Item doesn't match? You can request a return.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsReturnMode(true)}
                                        className="px-6 py-2.5 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-lg w-full md:w-auto"
                                    >
                                        Start Return Request
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black uppercase tracking-wider italic flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 text-primary" />
                                            Return Request
                                        </h3>
                                        <button
                                            onClick={() => setIsReturnMode(false)}
                                            className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reason for Return</label>
                                            <select
                                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                                value={returnReason}
                                                onChange={(e) => setReturnReason(e.target.value)}
                                            >
                                                <option value="">Select a reason...</option>
                                                <option value="Size too small">Size too small</option>
                                                <option value="Size too large">Size too large</option>
                                                <option value="Damaged item">Damaged item</option>
                                                <option value="Wrong item sent">Wrong item sent</option>
                                                <option value="Color mismatch">Color mismatch</option>
                                                <option value="Changed mind">Changed mind</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Additional Comments</label>
                                            <textarea
                                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px] resize-none"
                                                placeholder="Please provide more details about the issue..."
                                                value={returnComment}
                                                onChange={(e) => setReturnComment(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={async () => {
                                                if (!returnReason) {
                                                    toast.error("Please select a reason");
                                                    return;
                                                }

                                                try {
                                                    const res = await fetch("/api/returns", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            orderId: order._id,
                                                            items: order.orderItems.map((i: any) => ({
                                                                product: i.product,
                                                                quantity: i.quantity,
                                                                reason: returnReason + (returnComment ? ` - ${returnComment}` : ""),
                                                                condition: 'Unopened'
                                                            }))
                                                        }),
                                                    });
                                                    if (res.ok) {
                                                        toast.success("Return request submitted successfully.");
                                                        setIsReturnMode(false);
                                                        onClose();
                                                        if (onOrderUpdated) onOrderUpdated();
                                                    } else {
                                                        const data = await res.json();
                                                        toast.error(`Return request failed: ${data.error}`);
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    toast.error("Error submitting request");
                                                }
                                            }}
                                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                                        >
                                            Submit Request
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogDescription>
            </DialogContent>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary), 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </Dialog>
    );
}
