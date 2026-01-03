"use client";
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRestricted = searchParams.get("error") === "restricted";
    const { data: session, status } = useSession();

    // Auto-redirect if already logged in as ADMIN
    useEffect(() => {
        if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
            router.push("/admin/orders");
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid administrator credentials");
            } else {
                // Force a hard redirect to ensure the session is completely 
                // refreshed and the 'restricted' query param is cleared.
                window.location.href = "/admin/orders";
            }
        } catch (err) {
            setError("Secure connection failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full z-10"
            >
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative">
                    {/* Header Icon */}
                    <div className="flex justify-center flex-col items-center space-y-4">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                        >
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </motion.div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Admin Portal</h2>
                            <p className="text-white/40 text-sm font-medium mt-1 uppercase tracking-widest px-4">Secure Access Required</p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {(error || isRestricted) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <span className="text-red-500 text-xs font-bold uppercase tracking-tight">
                                    {error || (isRestricted ? "Current account does not have admin privileges" : "")}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Secure Key (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@merosaaj.com"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Access Token (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_20px_40px_-15px_rgba(var(--primary),0.5)] transition-all disabled:opacity-50 mt-4"
                        >
                            {loading ? "Decrypting..." : "Initialize Session"}
                            {!loading && <ChevronRight className="w-5 h-5" />}
                        </motion.button>
                    </form>

                    <div className="text-center pt-2">
                        <button
                            onClick={() => router.push("/")}
                            className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition"
                        >
                            Back to Storefront
                        </button>
                    </div>
                </div>

                {/* Secure Footer Info */}
                <p className="text-center mt-8 text-white/20 text-[10px] font-medium leading-relaxed px-10 uppercase tracking-widest">
                    AES-256 Encrypted Traffic • Distributed Order Management Protocol v2.4
                </p>
            </motion.div>
        </div>
    );
}
