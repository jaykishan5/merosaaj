"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Plus, Home, Briefcase, MapPin, Trash2, Edit2, Check, Sparkles, Map as MapIcon, Loader2, Navigation, Phone, User } from "lucide-react";
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
            <DialogContent className="max-w-3xl w-[95vw] px-0 py-0 overflow-hidden bg-background max-h-[90vh] flex flex-col">
                <DialogHeader className="bg-background border-b border-border/50 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/5 rounded-2xl flex items-center justify-center border border-accent/10">
                            <MapIcon className="w-5 h-5 text-accent animate-pulse" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight font-serif text-primary">Distribution Book</DialogTitle>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Manage your shipping destinations</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-muted rounded-xl transition-all group">
                        <X className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                    </button>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <DialogDescription className="pb-10 pt-6">
                        {!showForm ? (
                            <div className="space-y-8">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full py-8 border-2 border-dashed border-accent/10 bg-accent/[0.02] text-accent rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent/5 hover:border-accent/30 transition-all duration-500 flex flex-col items-center justify-center gap-3 active:scale-[0.99] font-outfit group group shadow-sm hover:shadow-md"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5 text-accent" />
                                    </div>
                                    Add New Destination
                                </button>

                                {loading ? (
                                    <div className="flex flex-col items-center py-20">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <Navigation className="w-6 h-6 absolute inset-0 m-auto text-primary animate-pulse" />
                                        </div>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary/60">Locating Saved Data...</p>
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-20 bg-muted/30 rounded-[2.5rem] border border-dashed border-border">
                                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                            <MapPin className="w-10 h-10 text-muted-foreground/30" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 uppercase tracking-tight">No Saved Locations</h4>
                                        <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">Your personal address book is empty. Add a delivery point to get started.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                className={`group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 ring-1 ${addr.isDefault
                                                    ? 'ring-accent/20 bg-accent/[0.01]'
                                                    : 'ring-border/50 hover:ring-accent/20'
                                                    }`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-2.5 rounded-xl ${addr.isDefault ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-muted/50 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500 border border-border/50'}`}>
                                                                {getLabelIcon(addr.label)}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-[10px] uppercase tracking-wider block font-outfit text-muted-foreground">{addr.label}</span>
                                                                {addr.isDefault && (
                                                                    <span className="text-[10px] font-bold text-accent uppercase tracking-tighter italic">Primary Choice</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(addr);
                                                                }}
                                                                className="p-2 hover:bg-accent/5 text-muted-foreground/40 hover:text-accent rounded-lg transition-all"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(addr._id);
                                                                }}
                                                                disabled={actionLoading === addr._id}
                                                                className="p-2 hover:bg-destructive/5 text-muted-foreground/40 hover:text-destructive rounded-lg transition-all"
                                                            >
                                                                {actionLoading === addr._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{addr.fullName}</h4>
                                                            <p className="text-sm text-foreground/70 leading-relaxed mt-1 font-medium">{addr.address}</p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium">
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                                                                <MapPin className="w-3 h-3 opacity-40" />
                                                                {addr.city}, {addr.region}
                                                            </div>
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                                                                <Phone className="w-3 h-3 opacity-40" />
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
                                                            className="w-full mt-6 py-3 bg-muted group-hover:bg-accent text-muted-foreground group-hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2"
                                                        >
                                                            Select Destination <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-accent rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-xl tracking-tight font-serif text-primary">{editingId ? 'Modify Location' : 'New Destination'}</h3>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pin your point on the map</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition"
                                    >
                                        Back to list
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/70 pl-1">Label</label>
                                        <div className="flex gap-3">
                                            {(['Home', 'Work', 'Other'] as const).map((label) => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, label })}
                                                    className={`flex-1 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-500 flex flex-col items-center gap-2 font-outfit ${formData.label === label
                                                        ? 'border-accent bg-accent text-white shadow-xl shadow-accent/20 scale-[1.02]'
                                                        : 'border-border bg-muted/30 hover:border-primary text-muted-foreground'
                                                        }`}
                                                >
                                                    {label === 'Home' && <Home className="w-4 h-4" />}
                                                    {label === 'Work' && <Briefcase className="w-4 h-4" />}
                                                    {label === 'Other' && <MapPin className="w-4 h-4" />}
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Receiver Name</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                    <User className="w-4 h-4 text-muted-foreground/40" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4.5 bg-muted/30 border border-border/50 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground/30"
                                                    placeholder="Name of recipient"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Building/Street</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                                    <MapPin className="w-4 h-4 text-muted-foreground/40" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4.5 bg-muted/30 border border-border/50 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground/30"
                                                    placeholder="House no, Street name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/70 pl-1">City</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm text-foreground placeholder:text-foreground/30"
                                                placeholder="e.g. Kathmandu"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/70 pl-1">Zone / Region</label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                                                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm appearance-none text-foreground"
                                            >
                                                <option value="Kathmandu Valley">Kathmandu Valley</option>
                                                <option value="Outside Valley">Outside Valley</option>
                                            </select>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.isDefault}
                                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all duration-500 ${formData.isDefault ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted border border-border'}`} />
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm ${formData.isDefault ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/50 group-hover:text-primary transition-colors">Set as favorite point</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading === 'saving'}
                                    className="w-full py-5 bg-primary text-white font-bold rounded-2xl uppercase tracking-[0.2em] hover:bg-accent hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group font-outfit mt-4 shadow-xl shadow-primary/10"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    {actionLoading === 'saving' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Commit Destination</span>
                                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center transition-colors group-hover:bg-white/20">
                                                <Sparkles className="w-3 h-3 text-accent group-hover:text-white" />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </DialogDescription>
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
                    background: rgba(var(--primary), 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--primary), 0.3);
                }
            `}</style>
        </Dialog >
    );
}
