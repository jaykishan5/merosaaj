"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChevronRight, Truck, CreditCard, Banknote, ShoppingBag, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import AddressBookModal from "@/components/AddressBookModal";
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { data: session } = useSession();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [shippingInfo, setShippingInfo] = useState({
        fullName: session?.user?.name || "",
        address: "",
        city: "",
        phone: "",
        region: "Kathmandu Valley" as "Kathmandu Valley" | "Outside Valley",
    });

    const [paymentMethod, setPaymentMethod] = useState<"COD" | "eSewa" | "Khalti">("COD");
    const [loading, setLoading] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Coupon related state
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState("");

    const handleApplyCoupon = async () => {
        if (!couponCode) return;

        setCouponLoading(true);
        setCouponError("");

        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, amount: totalPrice() }),
            });

            const data = await res.json();

            if (res.ok) {
                setAppliedCoupon(data.coupon);
                setCouponError("");
            } else {
                setCouponError(data.message);
                setAppliedCoupon(null);
            }
        } catch (err) {
            setCouponError("Failed to apply coupon");
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discountType === 'percentage') {
            return (totalPrice() * appliedCoupon.discountValue) / 100;
        }
        return appliedCoupon.discountValue;
    };

    const handleSelectAddress = (address: any) => {
        setShippingInfo({
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            phone: address.phone,
            region: address.region,
        });
        setIsAddressModalOpen(false);
    };

    const discountAmount = calculateDiscount();
    const shippingPrice = 100;
    const finalTotal = totalPrice() + shippingPrice - discountAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingInfo.address || !shippingInfo.phone) {
            toast.error("Please fill in all address fields");
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                orderItems: items,
                shippingAddress: shippingInfo,
                paymentMethod,
                itemsPrice: totalPrice(),
                shippingPrice,
                couponCode: appliedCoupon?.code,
                totalPrice: finalTotal,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (res.ok) {
                if (paymentMethod === "COD") {
                    clearCart();
                    router.push(`/order/${data.orderId}?success=true`);
                } else if (paymentMethod === "eSewa") {
                    const esewaRes = await fetch("/api/payment/esewa/initiate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            amount: finalTotal,
                            transactionId: data.orderId,
                        }),
                    });

                    const esewaData = await esewaRes.json();

                    if (!esewaRes.ok) {
                        throw new Error(esewaData.message || "Failed to initiate eSewa payment");
                    }

                    const form = document.createElement('form');
                    form.setAttribute('method', 'POST');
                    form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

                    Object.entries(esewaData).forEach(([key, value]) => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', key);
                        input.setAttribute('value', value!.toString());
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    form.submit();
                } else if (paymentMethod === "Khalti") {
                    const khaltiRes = await fetch("/api/payment/khalti/initiate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            amount: finalTotal,
                            transactionId: data.orderId,
                            orderName: `Order #${data.orderId.substring(0, 8)}`,
                        }),
                    });

                    const khaltiData = await khaltiRes.json();

                    if (!khaltiRes.ok) {
                        throw new Error(khaltiData.message || "Failed to initiate Khalti payment");
                    }

                    if (khaltiData.payment_url) {
                        window.location.href = khaltiData.payment_url;
                    } else {
                        throw new Error("Payment URL not received from Khalti");
                    }
                }
            } else {
                toast.error(data.message || "Failed to place order");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items.length, router]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-24 pt-28 md:pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16">
                    {/* Form */}
                    <div className="space-y-12">
                        <h1 className="text-4xl font-bold tracking-tighter uppercase">CHECKOUT</h1>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Shipping Information */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                                        <h2 className="text-xl font-bold uppercase tracking-tight">Shipping Information</h2>
                                    </div>
                                    {session && (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5"
                                        >
                                            <MapPin className="w-3 h-3" /> Select from Book
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                        <input
                                            className="w-full bg-muted border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                            value={shippingInfo.fullName}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                                        <input
                                            className="w-full bg-muted border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Address</label>
                                        <input
                                            className="w-full bg-muted border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Street name, landmark..."
                                            value={shippingInfo.address}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</label>
                                        <input
                                            className="w-full bg-muted border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delivery Region</label>
                                        <select
                                            className="w-full bg-muted border border-border p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary appearance-none"
                                            value={shippingInfo.region}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, region: e.target.value as any })}
                                        >
                                            <option value="Kathmandu Valley">Kathmandu Valley (NPR 100)</option>
                                            <option value="Outside Valley">Outside Valley (NPR 100)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("COD")}
                                        className={`p-6 rounded-2xl border-2 transition text-left flex flex-col justify-between h-32 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
                                    >
                                        <Banknote className="w-6 h-6 mb-4" />
                                        <div>
                                            <div className="font-bold text-sm">CASH</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">On Delivery</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("eSewa")}
                                        className={`p-6 rounded-2xl border-2 transition text-left flex flex-col justify-between h-32 ${paymentMethod === 'eSewa' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
                                    >
                                        <CreditCard className="w-6 h-6 mb-4" />
                                        <div>
                                            <div className="font-bold text-sm text-green-600">eSewa</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">Secure Online</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("Khalti")}
                                        className={`p-6 rounded-2xl border-2 transition text-left flex flex-col justify-between h-32 ${paymentMethod === 'Khalti' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
                                    >
                                        <CreditCard className="w-6 h-6 mb-4" />
                                        <div>
                                            <div className="font-bold text-sm text-purple-600">Khalti</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">Secure Online</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-primary/90 transition shadow-2xl disabled:opacity-50"
                            >
                                <span>{loading ? "PROCESSING..." : "PLACE ORDER"}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Cart Summary (Right Side) */}
                    <div className="bg-muted/50 p-8 rounded-3xl h-fit sticky top-24 border border-border">
                        <h3 className="text-xl font-bold mb-8 uppercase tracking-tight">ORDER SUMMARY</h3>
                        <div className="space-y-6 mb-8 max-h-80 overflow-y-auto">
                            {items.map((item) => (
                                <div key={`${item._id}-${item.size}`} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold uppercase">{item.name}</h4>
                                            <span className="text-sm font-bold">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            QTY: {item.quantity} | SIZE: {item.size}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-border">
                            {/* Coupon Code Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Coupon Code</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-muted border border-border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary text-sm uppercase"
                                        placeholder="ENTER CODE"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setCouponCode("");
                                            }}
                                            className="px-3 py-2 text-[10px] font-bold uppercase text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponCode}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                                        >
                                            {couponLoading ? "..." : "Apply"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{couponError}</p>}
                                {appliedCoupon && <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Coupon Applied!</p>}
                            </div>

                            <div className="flex justify-between text-sm pt-4">
                                <span className="text-muted-foreground uppercase font-bold text-xs tracking-widest">SUBTOTAL</span>
                                <span className="font-bold">{formatPrice(totalPrice())}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span className="uppercase font-bold text-xs tracking-widest">DISCOUNT ({appliedCoupon?.code})</span>
                                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground uppercase font-bold text-xs tracking-widest">SHIPPING</span>
                                <span className="font-bold">{formatPrice(shippingPrice)}</span>
                            </div>
                            <div className="pt-6 border-t border-primary/10 flex justify-between items-end">
                                <span className="font-black text-2xl tracking-tighter">TOTAL</span>
                                <span className="font-black text-2xl tracking-tighter">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center space-x-2 text-muted-foreground">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout - merosaaj</span>
                        </div>
                    </div>
                </div>
            </main>

            <AddressBookModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSelectAddress={handleSelectAddress}
            />
        </div>
    );
}
