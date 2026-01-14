import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-7xl mx-auto">
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
                                    <p className="text-muted-foreground">support@merosaaj.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-muted rounded-xl">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Call Us</h3>
                                    <p className="text-muted-foreground">+977 9864593097</p>
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
                            <Instagram className="w-6 h-6 cursor-pointer hover:text-accent transition" />
                            <Twitter className="w-6 h-6 cursor-pointer hover:text-accent transition" />
                            <Facebook className="w-6 h-6 cursor-pointer hover:text-accent transition" />
                        </div>
                    </div>

                    <div className="bg-muted p-8 rounded-2xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">First Name</label>
                                    <input type="text" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">Last Name</label>
                                    <input type="text" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest">Email Address</label>
                                <input type="email" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest">Message</label>
                                <textarea rows={5} className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent hover:text-white transition">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
