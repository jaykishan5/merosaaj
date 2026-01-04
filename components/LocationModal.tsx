"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, MapPin, Navigation, Map as MapIcon, Loader2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: {
        address: string;
        city: string;
        region: "Kathmandu Valley" | "Outside Valley";
        shippingPrice: number;
    }) => void;
    currentLocation?: {
        address: string;
        city: string;
        region: "Kathmandu Valley" | "Outside Valley";
    };
}

export default function LocationModal({ isOpen, onClose, onSelectLocation, currentLocation }: LocationModalProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [view, setView] = useState<"list" | "form">("form");

    const [formData, setFormData] = useState({
        address: currentLocation?.address || "",
        city: currentLocation?.city || "",
        region: currentLocation?.region || "Kathmandu Valley" as "Kathmandu Valley" | "Outside Valley",
    });

    useEffect(() => {
        if (isOpen && session) {
            fetchSavedAddresses();
        }
    }, [isOpen, session]);

    const fetchSavedAddresses = async () => {
        try {
            const res = await fetch("/api/addresses");
            if (res.ok) {
                const data = await res.json();
                setSavedAddresses(data);
                if (data.length > 0 && !currentLocation?.address) {
                    setView("list");
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const shippingPrice = 100;
        onSelectLocation({
            ...formData,
            shippingPrice
        });
        toast.success("Delivery location updated");
        onClose();
    };

    const handleSelectSaved = (addr: any) => {
        const shippingPrice = 100;
        onSelectLocation({
            address: addr.address,
            city: addr.city,
            region: addr.region,
            shippingPrice
        });
        toast.success("Delivery location updated");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl w-[95vw] px-0 py-0 overflow-hidden bg-[#fcfaf2] border-none shadow-2xl rounded-3xl">
                <DialogHeader className="bg-[#fcfaf2] border-b border-black/5 px-8 pt-8 pb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 border border-white">
                            <MapPin className="w-5 h-5 text-accent animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-black italic tracking-tighter font-serif text-primary uppercase leading-tight">Delivery Point</DialogTitle>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Set your exact drop-off location</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="px-8 py-10">
                    {view === "list" && savedAddresses.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Saved Destinations</h4>
                                <button
                                    onClick={() => setView("form")}
                                    className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                                >
                                    + Use Other
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {savedAddresses.map((addr) => (
                                    <button
                                        key={addr._id}
                                        onClick={() => handleSelectSaved(addr)}
                                        className="text-left bg-white p-6 rounded-2xl border border-black/5 hover:border-accent/30 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#fcfaf2] flex items-center justify-center text-muted-foreground group-hover:bg-accent group-hover:text-white transition-all">
                                                <Navigation className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-primary uppercase italic">{addr.fullName}</p>
                                                <p className="text-[11px] text-muted-foreground font-bold truncate max-w-[200px]">{addr.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase text-accent tracking-tighter">{addr.region}</p>
                                                <p className="text-[10px] font-black text-primary">Rs. 100</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-2 italic">Full Address</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-accent transition-colors">
                                        <Navigation className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/20"
                                        placeholder="Street name, landmark, house no..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-2 italic">City</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-accent transition-colors">
                                            <MapIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/20"
                                            placeholder="e.g. Kathmandu"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-2 italic">Delivery Region</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-accent transition-colors pointer-events-none z-10">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <select
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                                            className="w-full pl-14 pr-10 py-5 bg-white border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm appearance-none text-primary shadow-sm"
                                        >
                                            <option value="Kathmandu Valley">Kathmandu Valley (Rs. 100)</option>
                                            <option value="Outside Valley">Outside Valley (Rs. 100)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Navigation className="w-3 h-3 text-muted-foreground/30 rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] hover:bg-accent hover:shadow-[0_20px_40px_rgba(255,0,0,0.15)] transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group shadow-xl shadow-primary/10"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    Confirm Destination
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-accent" />
                                    </div>
                                </button>

                                {savedAddresses.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setView("list")}
                                        className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Back to Saved Addresses
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </Dialog>
    );
}

