"use client";

import { Share2, Facebook, Twitter, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
    title: string;
    url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
    const [isOpen, setIsOpen] = useState(false);

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: <Send className="w-4 h-4" />,
            color: "bg-[#25D366]",
            href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-4 h-4" />,
            color: "bg-[#1877F2]",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: "Twitter",
            icon: <Twitter className="w-4 h-4" />,
            color: "bg-[#000000]",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-primary border border-border/50 hover:bg-muted transition-colors"
                title="Share Product"
            >
                <Share2 className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute right-0 bottom-full mb-4 z-[70] bg-white border border-border rounded-2xl p-4 shadow-2xl min-w-[200px]"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 pl-1">Share Drop</p>
                            <div className="space-y-2">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${link.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            {link.icon}
                                        </div>
                                        <span className="text-xs font-bold text-primary">{link.name}</span>
                                    </a>
                                ))}
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Share2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-primary">Copy Link</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
