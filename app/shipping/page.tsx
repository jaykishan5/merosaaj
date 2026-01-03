import Navbar from "@/components/Navbar";

export default function ShippingPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold tracking-tighter mb-12 italic">SHIPPING POLICY</h1>
                <div className="space-y-12">
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Delivery Areas</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Currently, we ship all across Nepal. For international shipping inquiries, please contact our support team at support@merosaaj.com.
                        </p>
                    </div>
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Processing Times</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Orders are processed within 1-2 business days. Please note that we do not ship on Saturdays or public holidays.
                        </p>
                    </div>
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Shipping Rates</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            - Inside Kathmandu Valley: Free for orders above Rs. 5000, otherwise Rs. 150.<br />
                            - Outside Kathmandu Valley: Flat rate of Rs. 250.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
