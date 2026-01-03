import Navbar from "@/components/Navbar";

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-24 px-4 max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold tracking-tighter mb-8 italic">OUR STORY</h1>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed text-left">
                    <p>
                        Born in the heart of Kathmandu, <strong>merosaaj</strong> is more than just a clothing brand.
                        It is a movement dedicated to redefining Nepali streetwear for the modern era.
                    </p>
                    <p>
                        Our journey began with a simple observation: the youth of Nepal were seeking fashion that spoke to their global
                        sensibilities while honoring their rich cultural heritage. We decided to bridge that gap.
                    </p>
                    <p>
                        Every collection we release is a blend of traditional motifs and contemporary silhouettes.
                        We source the finest local fabrics and work with skilled artisans to ensure that every garment
                        tells a story of craftsmanship and pride.
                    </p>
                    <p>
                        Join us as we take Nepali identity beyond borders, one stitch at a time.
                    </p>
                </div>
            </section>
        </main>
    );
}
