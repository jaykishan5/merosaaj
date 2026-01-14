"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SocialLoginButtons() {
    return (
        <div className="space-y-4 w-full">
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-muted-foreground font-black tracking-widest">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white border border-border rounded-xl font-bold shadow-sm transition-all hover:shadow-md group"
                >
                    <Image
                        src="/images/google-icon.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                    <span className="text-sm font-black uppercase tracking-wider text-primary">Continue with Google</span>
                </motion.button>
            </div>
        </div>
    );
}
