"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommandPalette from "@/components/CommandPalette";
import { Menu, Search, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Keyboard trigger for Command Palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsPaletteOpen(prev => !prev);
            }
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                setIsPaletteOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Sync with sidebar state
    useEffect(() => {
        const checkSidebar = () => {
            const savedState = localStorage.getItem("adminSidebarCollapsed");
            if (savedState) setIsSidebarCollapsed(JSON.parse(savedState));
        };
        checkSidebar();
        window.addEventListener('storage', checkSidebar);
        return () => window.removeEventListener('storage', checkSidebar);
    }, []);

    // Skip protection for the admin login page itself
    const isAdminLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (!isAdminLoginPage) {
            if (status === "unauthenticated") {
                router.push("/admin/login");
            } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
                router.push("/admin/login?error=restricted");
            }
        }
    }, [status, session, router, isAdminLoginPage]);

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // If it's the login page, just render it
    if (isAdminLoginPage) {
        return <>{children}</>;
    }

    // While checking session, show a clean loading state
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Authenticating</p>
                </div>
            </div>
        );
    }

    // Only render children if authenticated as ADMIN
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
        return (
            <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
                <AdminSidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
                <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <div className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"} flex flex-col min-h-screen`}>
                    {/* Header */}
                    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40">
                        <div className="flex items-center gap-8">
                            <span className="text-xl font-black italic uppercase tracking-tighter lg:hidden">Admin<span className="text-primary">.</span></span>
                            <div className="hidden lg:block">
                                <Breadcrumbs />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPaletteOpen(true)}
                                className="p-3 hover:bg-muted rounded-2xl transition-all group relative"
                                title="Search (Ctrl + K)"
                            >
                                <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground">/</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="p-3 hover:bg-muted rounded-2xl transition-all group relative"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-transform" />
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-card animate-pulse" />
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Notifications</span>
                                            <span className="text-[10px] text-muted-foreground">Mark all read</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto py-2 space-y-1">
                                            {[
                                                { id: 1, title: "New Order #2931", desc: "Varun K. placed an order for Rs. 4,500", time: "2m ago", type: "order" },
                                                { id: 2, title: "Low Stock Alert", desc: "Heritage Hoodie (Black, M) is running low.", time: "1h ago", type: "alert" },
                                                { id: 3, title: "New User Registered", desc: "Sarah J. created an account.", time: "3h ago", type: "user" }
                                            ].map(n => (
                                                <div key={n.id} className="p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-xs group-hover:text-primary transition-colors">{n.title}</span>
                                                        <span className="text-[9px] text-muted-foreground font-mono">{n.time}</span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-2">{n.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-3 hover:bg-muted rounded-2xl transition-all"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // Otherwise, return null to prevent flicker before redirect
    return null;
}
