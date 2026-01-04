"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommandPalette from "@/components/CommandPalette";
import { Menu, Search, Bell, ShoppingBag, Package, Users, CheckCheck } from "lucide-react";
import { useRef } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAllRead = async () => {
        try {
            const res = await fetch("/api/admin/notifications", { method: "PUT" });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const markSingleRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/notifications/${id}`, { method: "PATCH" });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    // Auto sync on mount and periodic polling
    useEffect(() => {
        if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [status, session]);

    // Initial sync with localStorage
    useEffect(() => {
        const savedState = localStorage.getItem("adminSidebarCollapsed");
        if (savedState) setIsSidebarCollapsed(JSON.parse(savedState));
    }, []);

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem("adminSidebarCollapsed", JSON.stringify(newState));
    };

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

    // Click outside to close notifications
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNotificationsOpen]);

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
                <AdminSidebar
                    isMobileOpen={isMobileMenuOpen}
                    onCloseMobile={() => setIsMobileMenuOpen(false)}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleSidebar}
                />
                <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <div className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"} flex flex-col min-h-screen relative`}>
                    {/* Header */}
                    <header className="h-20 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-8 lg:px-12 sticky top-0 z-[60]">
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
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className={`p-3 rounded-2xl transition-all group relative ${isNotificationsOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                    title="Notifications"
                                >
                                    <Bell className={`w-5 h-5 ${isNotificationsOpen ? 'text-primary-foreground' : 'group-hover:text-foreground group-hover:scale-110'} transition-transform`} />
                                    {unreadCount > 0 && (
                                        <span className={`absolute top-2 right-3 w-2 h-2 rounded-full bg-rose-500 border-2 ${isNotificationsOpen ? 'border-primary' : 'border-card'} animate-pulse`} />
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-[380px] bg-[#fcfaf2] border border-border rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="px-8 py-7 border-b border-border flex justify-between items-center bg-[#fcfaf2]/50">
                                            <span className="text-sm font-black uppercase tracking-[0.3em] italic text-primary">Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                                            <button
                                                onClick={markAllRead}
                                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5 transition-transform group-hover:scale-110" /> Mark all read
                                            </button>
                                        </div>
                                        <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-3">
                                            <div className="space-y-1">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => {
                                                        const Icon = n.type === 'order' ? ShoppingBag : n.type === 'alert' ? Package : Users;
                                                        const colorClass = n.type === 'order' ? 'text-blue-500' : n.type === 'alert' ? 'text-orange-500' : 'text-purple-500';
                                                        const bgClass = n.type === 'order' ? 'bg-blue-500/10' : n.type === 'alert' ? 'bg-orange-500/10' : 'bg-purple-500/10';

                                                        return (
                                                            <div
                                                                key={n._id}
                                                                onClick={() => {
                                                                    markSingleRead(n._id);
                                                                    if (n.link) router.push(n.link);
                                                                    setIsNotificationsOpen(false);
                                                                }}
                                                                className={`p-5 hover:bg-muted/50 rounded-3xl cursor-pointer transition-all duration-300 group flex gap-5 border border-transparent hover:border-border/50 ${!n.isRead ? 'bg-accent/[0.02] border-accent/10' : ''}`}
                                                            >
                                                                <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                                                    <Icon className={`w-6 h-6 ${colorClass}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className={`font-black text-sm group-hover:text-primary transition-colors italic tracking-tight ${!n.isRead ? 'text-accent' : ''}`}>{n.title}</span>
                                                                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{n.message}</p>
                                                                </div>
                                                                {!n.isRead && (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="py-20 text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No new notifications</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted/10 border-t border-border mt-2">
                                            <button className="w-full py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-500">
                                                View All Activity
                                            </button>
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
