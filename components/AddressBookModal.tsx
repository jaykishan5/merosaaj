"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Plus, Home, Briefcase, MapPin, Trash2, Edit2, Check, Sparkles, Map as MapIcon, Loader2, Navigation, Phone, User, Upload } from "lucide-react";
import { toast } from "sonner";

interface Address {
    _id: string;
    label: 'Home' | 'Work' | 'Other';
    fullName: string;
    address: string;
    city: string;
    phone: string;
    region: 'Kathmandu Valley' | 'Outside Valley';
    isDefault: boolean;
}

interface AddressBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress?: (address: Address) => void;
}

export default function AddressBookModal({ isOpen, onClose, onSelectAddress }: AddressBookModalProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        label: 'Home' as 'Home' | 'Work' | 'Other',
        fullName: '',
        address: '',
        city: '',
        phone: '',
        region: 'Kathmandu Valley' as 'Kathmandu Valley' | 'Outside Valley',
        isDefault: false,
    });

    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
        }
    }, [isOpen]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/addresses');
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading('saving');
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, _id: editingId } : formData;

            const res = await fetch('/api/addresses', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingId ? 'Address updated' : 'Address added');
                fetchAddresses();
                resetForm();
            } else {
                toast.error('Failed to save address');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            setActionLoading(id);
            const res = await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Address deleted');
                fetchAddresses();
            }
        } catch (error) {
            toast.error('Failed to delete address');
        } finally {
            setActionLoading(null);
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            label: address.label,
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            phone: address.phone,
            region: address.region,
            isDefault: address.isDefault,
        });
        setEditingId(address._id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            label: 'Home',
            fullName: '',
            address: '',
            city: '',
            phone: '',
            region: 'Kathmandu Valley',
            isDefault: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getLabelIcon = (label: string) => {
        switch (label) {
            case 'Home': return <Home className="w-4 h-4" />;
            case 'Work': return <Briefcase className="w-4 h-4" />;
            default: return <MapPin className="w-4 h-4" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl w-[95vw] px-0 py-0 overflow-hidden bg-[#fcfaf2] max-h-[90vh] flex flex-col border-none shadow-2xl rounded-3xl">
                <DialogHeader className="bg-[#fcfaf2] border-b border-black/5 px-8 py-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl shadow-black/5 border border-white">
                            <MapIcon className="w-6 h-6 text-accent animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-black italic tracking-tighter font-serif text-primary uppercase leading-tight">Distribution Book</DialogTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Manage your shipping destinations</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-12">
                    {!showForm ? (
                        <div className="space-y-10">
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full py-10 border-4 border-dashed border-accent/10 bg-white rounded-[3rem] text-accent font-black text-xs uppercase tracking-[0.3em] hover:bg-accent/5 hover:border-accent/30 transition-all duration-500 flex flex-col items-center justify-center gap-4 active:scale-[0.99] group shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                Add New Destination
                            </button>

                            {loading ? (
                                <div className="flex flex-col items-center py-24">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-accent/5 border-t-accent rounded-full animate-spin"></div>
                                        <Navigation className="w-8 h-8 absolute inset-0 m-auto text-accent animate-pulse" />
                                    </div>
                                    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-accent/60">Locating Saved Data...</p>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-black/5">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                        <MapPin className="w-10 h-10 text-accent/20" />
                                    </div>
                                    <h4 className="text-xl font-black italic text-primary uppercase tracking-tighter mb-3">No Saved Locations</h4>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] max-w-[240px] mx-auto opacity-60">Your personal address book is empty. Add a delivery point to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            className={`group relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] ring-1 ${addr.isDefault
                                                ? 'ring-accent/20 bg-accent/[0.01]'
                                                : 'ring-black/5 hover:ring-accent/20'
                                                }`}
                                        >
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-3 rounded-2xl ${addr.isDefault ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-[#fcfaf2] text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500 border border-black/5'}`}>
                                                            {getLabelIcon(addr.label)}
                                                        </div>
                                                        <div>
                                                            <span className="font-black text-[10px] uppercase tracking-[0.2em] block text-muted-foreground">{addr.label}</span>
                                                            {addr.isDefault && (
                                                                <span className="text-[9px] font-black text-accent uppercase tracking-tighter italic">Primary Choice</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(addr);
                                                            }}
                                                            className="w-10 h-10 flex items-center justify-center bg-[#fcfaf2] hover:bg-white text-muted-foreground/40 hover:text-accent rounded-full transition-all border border-black/5"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(addr._id);
                                                            }}
                                                            disabled={actionLoading === addr._id}
                                                            className="w-10 h-10 flex items-center justify-center bg-[#fcfaf2] hover:bg-white text-muted-foreground/40 hover:text-destructive rounded-full transition-all border border-black/5"
                                                        >
                                                            {actionLoading === addr._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-lg font-black italic tracking-tighter text-primary group-hover:text-accent transition-colors uppercase leading-none">{addr.fullName}</h4>
                                                        <p className="text-sm text-foreground/60 leading-relaxed mt-2 font-bold line-clamp-2 uppercase tracking-tight">{addr.address}</p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#fcfaf2] rounded-full border border-black/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                            <MapPin className="w-3 h-3 text-accent" />
                                                            {addr.city}
                                                        </div>
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#fcfaf2] rounded-full border border-black/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                            <Phone className="w-3 h-3 text-accent" />
                                                            {addr.phone}
                                                        </div>
                                                    </div>
                                                </div>

                                                {onSelectAddress && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectAddress(addr);
                                                            onClose();
                                                        }}
                                                        className="w-full mt-8 py-5 bg-[#0a0a0a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 hover:bg-accent active:scale-95 shadow-xl"
                                                    >
                                                        Select Destination <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                            <div className="flex justify-between items-center px-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-2 h-10 bg-accent rounded-full animate-pulse" />
                                    <div>
                                        <h3 className="font-black text-2xl italic tracking-tighter font-serif text-primary uppercase leading-tight">{editingId ? 'Modify Location' : 'New Destination'}</h3>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Pin your exact delivery point</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent hover:border-accent/30 transition-all shadow-sm active:scale-95"
                                >
                                    Back to list
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">Label Type</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['Home', 'Work', 'Other'] as const).map((label) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, label })}
                                                className={`py-6 rounded-3xl border-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex flex-col items-center gap-3 ${formData.label === label
                                                    ? 'border-accent bg-accent text-white shadow-[0_15px_30px_rgba(255,0,0,0.15)] scale-[1.02]'
                                                    : 'border-white bg-white hover:border-accent text-muted-foreground shadow-sm'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl ${formData.label === label ? 'bg-white/20' : 'bg-accent/5 transition-colors group-hover:bg-accent/10'}`}>
                                                    {label === 'Home' && <Home className="w-5 h-5" />}
                                                    {label === 'Work' && <Briefcase className="w-5 h-5" />}
                                                    {label === 'Other' && <MapPin className="w-5 h-5" />}
                                                </div>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">Receiver Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                <User className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                                placeholder="Recipient Identity"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">Building / Street</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                <Navigation className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                                placeholder="House no, Tower, Street"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">City Point</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                <MapIcon className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                                placeholder="e.g. Kathmandu"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">Region / Area</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent pointer-events-none z-10">
                                                <MapPin className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                                                className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm appearance-none text-primary shadow-sm"
                                            >
                                                <option value="Kathmandu Valley">Kathmandu Valley</option>
                                                <option value="Outside Valley">Outside Valley</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-6">Contact Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                <Phone className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                                placeholder="Phone reachable"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-4 cursor-pointer group bg-white p-5 rounded-full border border-black/5 shadow-sm hover:border-accent/30 transition-all w-fit mt-6 md:mt-10">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.isDefault}
                                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-8 rounded-full transition-all duration-500 ${formData.isDefault ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-[#fcfaf2] border border-black/5'}`} />
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-xl ${formData.isDefault ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Mark as Primary Choice</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading === 'saving'}
                                className="w-full py-6 bg-primary text-white font-black rounded-[2rem] uppercase tracking-[0.3em] text-xs hover:bg-accent hover:shadow-[0_20px_40px_rgba(255,0,0,0.15)] transition-all duration-500 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group shadow-xl shadow-primary/10 mt-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                {actionLoading === 'saving' ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Commit Destination</span>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20">
                                            <Sparkles className="w-5 h-5 text-accent" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </DialogContent>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 0, 0, 0.2);
                }
            `}</style>
        </Dialog >
    );
}
