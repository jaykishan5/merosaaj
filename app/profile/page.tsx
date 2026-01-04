"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, User as UserIcon, LogOut, ChevronRight, CheckCircle, Clock, Truck, MapPin, XCircle, Settings, Map } from "lucide-react";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import ProfileSettingsModal from "@/components/ProfileSettingsModal";
import AddressBookModal from "@/components/AddressBookModal";
import Image from "next/image";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchUserOrders();
            fetchUserProfile();
        }
    }, [status, router]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setUserData(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const fetchUserOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <main className="min-h-screen bg-background relative overflow-hidden">
                <Navbar />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="mt-8 space-y-2 text-center">
                        <h2 className="text-xl font-black uppercase tracking-[0.3em] italic text-primary">Synchronizing</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Accessing Vault Data</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 md:pt-48 pb-12">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-8">
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center text-white relative overflow-hidden">
                                    {userData?.image ? (
                                        <Image src={userData.image} alt={userData.name} fill className="object-cover" />
                                    ) : (
                                        <UserIcon className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h2 className="font-bold truncate">{userData?.name || session?.user?.name}</h2>
                                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                                    {userData?.phone && (
                                        <p className="text-[10px] text-muted-foreground truncate font-medium">{userData.phone}</p>
                                    )}
                                </div>
                            </div>
                            <nav className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl">
                                    <span className="flex items-center"><Package className="w-4 h-4 mr-3" /> My Orders</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsProfileModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3 text-sm font-bold hover:bg-muted rounded-xl transition group"
                                >
                                    <span className="flex items-center"><Settings className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition" /> Profile Settings</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                                </button>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3 text-sm font-bold hover:bg-muted rounded-xl transition group"
                                >
                                    <span className="flex items-center"><Map className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition" /> Address Book</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                                </button>
                                <button
                                    onClick={() => router.push('/track-order')}
                                    className="w-full flex items-center justify-between p-3 text-sm font-bold hover:bg-muted rounded-xl transition group"
                                >
                                    <span className="flex items-center"><Truck className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition" /> Track Order</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                                </button>
                                <hr className="my-4 border-border" />
                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center p-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition"
                                >
                                    <LogOut className="w-4 h-4 mr-3" /> Logout
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tighter mb-8 uppercase italic">Order History</h1>

                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order._id} className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                                    Order #{order._id.substring(0, 8).toUpperCase()}
                                                </p>
                                                <p className="text-sm font-bold text-primary">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-accent/10 text-accent'
                                                    }`}>
                                                    {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                                    {order.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                                                    {(order.status === 'Pending' || order.status === 'Processing') && <Clock className="w-3 h-3" />}
                                                    {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Timeline */}
                                        {order.status !== 'Cancelled' && (
                                            <div className="relative mb-8 mt-4 px-2">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                                                <div
                                                    className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                                                    style={{
                                                        width: order.status === 'Pending' ? '0%' :
                                                            order.status === 'Processing' ? '33%' :
                                                                order.status === 'Shipped' ? '66%' : '100%'
                                                    }}
                                                ></div>

                                                <div className="relative z-10 flex justify-between w-full">
                                                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                                        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                                                        const currentStepIndex = steps.indexOf(order.status);
                                                        const isCompleted = index <= currentStepIndex;

                                                        return (
                                                            <div key={step} className="flex flex-col items-center gap-2">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${isCompleted ? 'border-accent text-accent' : 'border-gray-200 text-gray-300'
                                                                    }`}>
                                                                    {index === 0 && <Clock className="w-4 h-4" />}
                                                                    {index === 1 && <Package className="w-4 h-4" />}
                                                                    {index === 2 && <Truck className="w-4 h-4" />}
                                                                    {index === 3 && <MapPin className="w-4 h-4" />}
                                                                </div>
                                                                <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block ${isCompleted ? 'text-primary' : 'text-muted-foreground/40'
                                                                    }`}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border gap-4">
                                            <div className="text-sm space-y-1">
                                                <p className="text-muted-foreground text-xs">Total Amount</p>
                                                <p className="text-xl font-black">{formatPrice(order.totalPrice)}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                            >
                                                View Order Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-muted/50 py-20 rounded-3xl text-center border-2 border-dashed border-border">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground font-medium">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:bg-accent transition"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            <ProfileSettingsModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onUpdate={fetchUserProfile}
            />

            <AddressBookModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
            />
        </main>
    );
}
