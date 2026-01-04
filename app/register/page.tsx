"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative bg-secondary overflow-hidden">
            {/* Background Image for Mobile Only */}
            <div className="lg:hidden absolute inset-0 z-0">
                <Image
                    src="/images/auth-register-v2.png"
                    alt="MeroSaaj Clothing"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Left Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-white/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-8 lg:p-0 rounded-3xl border border-white/20 lg:border-none shadow-2xl lg:shadow-none"
                >
                    <div className="text-center lg:text-left mb-10">
                        <Link href="/" className="lg:hidden block mb-6">
                            <h2 className="text-4xl font-serif font-bold text-primary">merosaaj</h2>
                        </Link>
                        <h2 className="text-3xl font-outfit font-bold tracking-tight text-primary">Create Account</h2>
                        <p className="mt-2 text-muted-foreground lg:text-muted-foreground text-primary/80">Join the MeroSaaj family and discover authentic Nepali styles</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 text-center mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-primary/70 lg:text-muted-foreground mb-1.5 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 lg:text-muted-foreground/50">
                                        <User size={18} />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-white/50 lg:bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/30"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-primary/70 lg:text-muted-foreground mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 lg:text-muted-foreground/50">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-white/50 lg:bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/30"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-primary/70 lg:text-muted-foreground mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 lg:text-muted-foreground/50">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-12 py-3 bg-white/50 lg:bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/30"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="mt-1.5 text-[11px] font-medium text-primary/60 lg:text-muted-foreground ml-1">
                                    Must be at least 8 characters with a mix of letters and numbers.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 ml-1">
                            <input type="checkbox" id="terms" required className="mt-1 rounded border-border text-accent focus:ring-accent" />
                            <label htmlFor="terms" className="text-xs font-medium text-primary/70 lg:text-muted-foreground leading-relaxed">
                                I agree to the <Link href="/terms" className="text-accent font-bold underline decoration-2 underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-accent font-bold underline decoration-2 underline-offset-4">Privacy Policy</Link>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Register Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <SocialLoginButtons />

                    <p className="mt-8 text-center text-sm text-primary/70 lg:text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-accent font-black hover:underline decoration-2 underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Image Content (Visible on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <Image
                    src="/images/auth-register-v2.png"
                    alt="Nepali Craftsmanship"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-end justify-end p-16 text-white text-right z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-6xl font-serif font-bold mb-4">merosaaj</h1>
                        <p className="text-xl max-w-md font-light opacity-90">
                            Preserving the art of hand-woven traditions for the modern world.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
