import Navbar from "@/components/Navbar";

export default function ReturnsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold tracking-tighter mb-12 italic">RETURNS & EXCHANGES</h1>
                <div className="space-y-12">
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Our Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We accept returns and exchanges within 7 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached.
                        </p>
                    </div>
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Non-Returnable Items</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Underwear, socks, and items marked as "Final Sale" cannot be returned or exchanged for hygiene reasons.
                        </p>
                    </div>
                    <div className="border-b border-border pb-8">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">How to Return</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To initiate a return, please email us at returns@merosaaj.com with your order number and reason for return.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
