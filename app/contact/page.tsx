"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, Instagram, Facebook, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                toast.success("Message sent successfully!");
                setFormData({ firstName: "", lastName: "", email: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const socialLinks = {
        instagram: "https://instagram.com/merosaaj",
        facebook: "https://facebook.com/merosaaj",
        tiktok: "https://tiktok.com/@merosaaj",
    };

    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-7xl mx-auto pt-28 md:pt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tighter mb-8 italic">GET IN TOUCH</h1>
                        <p className="text-lg text-muted-foreground mb-12">
                            Have questions about our latest drop or need help with an order?
                            Our team is here to help you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-muted rounded-xl">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email Us</h3>
                                    <a href="mailto:support@merosaaj.com" className="text-muted-foreground hover:text-primary transition">
                                        support@merosaaj.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-muted rounded-xl">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Call Us</h3>
                                    <a href="tel:+9779864593097" className="text-muted-foreground hover:text-primary transition">
                                        +977 9864593097
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-muted rounded-xl">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Visit Studio</h3>
                                    <p className="text-muted-foreground">Kathmandu, Nepal</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex space-x-6">
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-muted rounded-xl hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a
                                href={socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-muted rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Follow us on Facebook"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href={socialLinks.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-muted rounded-xl hover:bg-black hover:text-white transition-all"
                                aria-label="Follow us on TikTok"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="bg-muted p-8 rounded-2xl">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground mb-6">
                                    We'll get back to you within 24-48 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">Message *</label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
