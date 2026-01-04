"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
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
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
                router.refresh();
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
                    src="/images/auth-login-v2.png"
                    alt="MeroSaaj Clothing"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Left Side: Image Content (Visible on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <Image
                    src="/images/auth-login-v2.png"
                    alt="MeroSaaj Clothing"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-16 text-white z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-6xl font-serif font-bold mb-4">merosaaj</h1>
                        <p className="text-xl max-w-md font-light opacity-90">
                            Experience the elegance of Nepali craftsmanship. Your journey to timeless style starts here.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Login Form */}
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
                        <h2 className="text-3xl font-outfit font-bold tracking-tight text-primary">Welcome Back</h2>
                        <p className="mt-2 text-muted-foreground lg:text-muted-foreground text-primary/80">Sign in to continue your fashion journey</p>
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-primary/70 lg:text-muted-foreground mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-white/50 lg:bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-primary/70 lg:text-muted-foreground mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-3 bg-white/50 lg:bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/50"
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
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" title="Feature coming soon" className="text-sm font-bold text-accent hover:underline decoration-2 underline-offset-4">
                                Forgot password?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Signing In...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-primary/70 lg:text-muted-foreground">
                        Don't have an account yet?{" "}
                        <Link href="/register" className="text-accent font-black hover:underline decoration-2 underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
