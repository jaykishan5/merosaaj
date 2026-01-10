import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import CartSessionManager from "@/components/CartSessionManager";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import OrderSuccessModal from "@/components/OrderSuccessModal";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: {
        default: "merosaaj | Premium Nepali Streetwear",
        template: "%s | merosaaj"
    },
    description: "Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity. Premium quality streetwear made in Nepal.",
    keywords: ["Nepali streetwear", "clothing brand Nepal", "merosaaj", "Nepali fashion", "streetwear accessories"],
    authors: [{ name: "merosaaj" }],
    creator: "merosaaj",
    publisher: "merosaaj",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("https://merosaaj.com"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://merosaaj.com",
        siteName: "merosaaj",
        title: "merosaaj | Premium Nepali Streetwear",
        description: "Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "merosaaj - Premium Nepali Streetwear",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "merosaaj | Premium Nepali Streetwear",
        description: "Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity.",
        images: ["/og-image.jpg"],
        creator: "@merosaaj",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = cookies().get("NEXT_LOCALE")?.value || "en";
    let messages;
    try {
        messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (error) {
        messages = (await import(`@/messages/en.json`)).default;
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, outfit.variable, playfair.variable, "min-h-screen antialiased")}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AuthProvider>
                        <CartSessionManager />
                        {children}
                        <OrderSuccessModal />
                        <Footer />
                        <Toaster position="top-center" richColors />
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
