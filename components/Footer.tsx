"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="bg-foreground text-background pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <h2 className="text-3xl font-black italic tracking-tighter font-serif">Merosaaj</h2>
                        </Link>
                        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                            Curated streetwear for the modern nomad. Combining cultural heritage with contemporary urban aesthetics.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">Shop</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><FooterLink href="/shop?gender=Men">Men's Collection</FooterLink></li>
                            <li><FooterLink href="/shop?gender=Women">Women's Collection</FooterLink></li>
                            <li><FooterLink href="/shop?gender=Unisex">Unisex Essentials</FooterLink></li>
                            <li><FooterLink href="/shop?category=Accessories">Accessories</FooterLink></li>
                            <li><FooterLink href="/shop?category=New Arrivals">New Arrivals</FooterLink></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><FooterLink href="/track-order">Track Order</FooterLink></li>
                            <li><FooterLink href="/returns">Returns & Exchanges</FooterLink></li>
                            <li><FooterLink href="/shipping">Shipping Policy</FooterLink></li>
                            <li><FooterLink href="/contact">Contact Us</FooterLink></li>
                            <li><FooterLink href="/faq">FAQs</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">Stay in the Loop</h3>
                        <p className="text-sm text-white/60 mb-6">Subscribe for exclusive drops, early access, and cultural stories.</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
                            if (email) {
                                toast.success("Welcome to the community!", {
                                    description: "You've successfully subscribed to our newsletter."
                                });
                                (e.target as HTMLFormElement).reset();
                            }
                        }} className="flex group">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-l-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-white/10 transition-all font-medium placeholder:text-white/20"
                                />
                            </div>
                            <button type="submit" className="bg-accent text-white px-4 rounded-r-xl font-bold hover:bg-accent/80 transition-colors flex items-center justify-center">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <p>&copy; {new Date().getFullYear()} Merosaaj. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <div className="w-1 h-1 bg-white/10 rounded-full hidden md:block"></div>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
    <Link href={href} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
        {icon}
    </Link>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="hover:text-accent transition-colors block w-fit">
        {children}
    </Link>
);
