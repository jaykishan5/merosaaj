import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Image from 'next/image';

interface OrderDetailsModalProps {
    order: any | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
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
