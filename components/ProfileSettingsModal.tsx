"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, User, Phone, Image as ImageIcon, Loader2, Camera, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose, onUpdate }: ProfileSettingsModalProps) {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        phone: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                const result = await res.json();
                setFormData(prev => ({ ...prev, image: result.url }));
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            toast.error("Error uploading image");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    image: data.image || "",
                    phone: data.phone || "",
                });
            }
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Profile updated successfully");
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                        image: formData.image,
                    }
                });
                if (onUpdate) onUpdate();
                onClose();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[480px] w-[95vw] px-0 py-0 overflow-hidden bg-[#fcfaf2] border-none shadow-2xl rounded-3xl">
                <DialogHeader className="bg-[#fcfaf2] border-b border-black/5 px-8 py-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl shadow-black/5 border border-white">
                            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-black italic tracking-tighter font-serif text-primary uppercase leading-tight">Personal Profile</DialogTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Update your digital identity</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="px-10 py-12">
                    {fetching ? (
                        <div className="flex flex-col items-center py-24">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-accent/5 border-t-accent rounded-full animate-spin"></div>
                                <Loader2 className="w-8 h-8 absolute inset-0 m-auto text-accent/20 animate-pulse" />
                            </div>
                            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">Loading Identity...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Avatar Preview Section */}
                            <div className="flex flex-col items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-40 h-40 rounded-[3rem] border-8 border-white overflow-hidden relative transition-all duration-500 group-hover:scale-105 group-hover:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-muted">
                                        {isUploading ? (
                                            <div className="absolute inset-0 z-20 bg-white/80 flex items-center justify-center backdrop-blur-md">
                                                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                                            </div>
                                        ) : null}

                                        {formData.image ? (
                                            <Image
                                                src={formData.image}
                                                alt="Avatar Preview"
                                                fill
                                                className="object-cover"
                                                onError={() => setFormData({ ...formData, image: '' })}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-accent/5">
                                                <User className="w-16 h-16 text-accent/20" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/90 p-3 rounded-2xl shadow-xl flex items-center gap-2">
                                                <Upload className="w-5 h-5 text-accent animate-bounce" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Update</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-accent text-white p-3.5 rounded-2xl shadow-2xl border-4 border-white z-10 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                </div>
                                <p className="mt-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Click photo to update</p>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-4">Display Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                            <User className="w-4 h-4 text-muted-foreground/30" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-4">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-accent">
                                            <Phone className="w-4 h-4 text-muted-foreground/30" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-16 pr-8 py-5 bg-white border border-black/5 rounded-full outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-bold text-sm text-primary shadow-sm placeholder:text-muted-foreground/30"
                                            placeholder="Connect your device"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-primary text-white font-black rounded-3xl uppercase tracking-[0.3em] text-xs hover:bg-accent hover:shadow-[0_20px_40px_rgba(255,0,0,0.15)] transition-all duration-500 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group shadow-xl shadow-primary/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Save Changes</span>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20">
                                            <Sparkles className="w-4 h-4 text-accent" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
