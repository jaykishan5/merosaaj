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

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "merosaaj | Premium Nepali Streetwear",
    description: "Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity.",
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
                        <Footer />
                        <Toaster position="top-center" richColors />
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
