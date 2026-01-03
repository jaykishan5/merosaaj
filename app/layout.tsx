import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import CartSessionManager from "@/components/CartSessionManager";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "merosaaj | Premium Nepali Streetwear",
    description: "Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, outfit.variable, playfair.variable, "min-h-screen antialiased")}>
                <AuthProvider>
                    <CartSessionManager />
                    {children}
                    <Footer />
                    <Toaster position="top-center" richColors />
                </AuthProvider>
            </body>
        </html>
    );
}
