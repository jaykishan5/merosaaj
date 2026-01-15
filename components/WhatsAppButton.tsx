"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
    productName: string;
    productSlug: string;
    variant?: string;
    phoneNumber?: string; // Default to a placeholder or config
}

export default function WhatsAppButton({
    productName,
    productSlug,
    variant,
    phoneNumber = "9779864593097" // Updated admin number
}: WhatsAppButtonProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://merosaaj.com';
    const message = `Namaste Merosaaj! 🇳🇵 I'm interested in the ${productName}${variant ? ` (${variant})` : ''}. Could you provide more details? \n\nLink: ${baseUrl}/product/${productSlug}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full h-14 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 transition-all hover:bg-[#128C7E]"
        >
            <MessageSquare className="w-5 h-5 fill-white" />
            Inquire on WhatsApp
        </motion.a>
    );
}
