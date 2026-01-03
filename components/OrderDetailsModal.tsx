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
            <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground">
                    <DialogTitle className="text-lg font-bold">
                        Order #{order._id.substring(0, 8).toUpperCase()}
                    </DialogTitle>
                    <button onClick={onClose} className="p-1 hover:bg-primary/80 rounded-full transition">
                        <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                </DialogHeader>
                <DialogDescription className="p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Placed on</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-bold text-xl">{formatPrice(order.totalPrice)}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground">Items</h3>
                        {order.orderItems.map((item: any) => (
                            <div key={item._id} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity} × {formatPrice(item.price)} • {item.size}/{item.color}
                                    </p>
                                </div>
                                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                                Shipping Address
                            </h3>
                            <p className="text-sm">{order.shippingAddress.fullName}</p>
                            <p className="text-sm">{order.shippingAddress.address}</p>
                            <p className="text-sm">{order.shippingAddress.city}</p>
                            <p className="text-sm">{order.shippingAddress.phone}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                                Payment
                            </h3>
                            <p className="text-sm">Method: {order.paymentMethod}</p>
                            {order.paymentResult && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <p>ID: {order.paymentResult.id}</p>
                                    <p>Status: {order.paymentResult.status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
