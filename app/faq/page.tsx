import Navbar from "@/components/Navbar";

export default function FAQPage() {
    const faqs = [
        {
            q: "How do I track my order?",
            a: "Once your order is shipped, you will receive an email with the tracking details."
        },
        {
            q: "Do you have a physical store?",
            a: "We are currently exclusively online, but we host pop-up shops in Kathmandu frequently. Follow our Instagram for updates!"
        },
        {
            q: "What sizes do you offer?",
            a: "Most of our streetwear is designed for an oversized fit. We offer sizes from S to XL. Check the size guide on each product page."
        },
        {
            q: "Are the products authentic?",
            a: "Yes, all products on our website are original merosaaj designs, crafted with quality in mind."
        }
    ];

    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold tracking-tighter mb-12 italic">FREQUENTLY ASKED QUESTIONS</h1>
                <div className="space-y-8">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-muted p-8 rounded-2xl">
                            <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                            <p className="text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
