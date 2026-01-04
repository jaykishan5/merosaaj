"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AdminSidebar({
    isMobileOpen = false,
    onCloseMobile,
    isCollapsed,
    onToggleCollapse
}: AdminSidebarProps) {
    const pathname = usePathname();

    const toggleSidebar = () => {
        onToggleCollapse();
    };

    const menuItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Users", href: "/admin/users", icon: Users },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-[120] transition-all duration-300 ease-in-out 
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${isCollapsed ? "lg:w-20" : "lg:w-64"}
                w-64
            `}
        >
            <div className={`p-8 flex items-center justify-between ${isCollapsed ? "lg:justify-center" : ""}`}>
                {(!isCollapsed || isMobileOpen) && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-2xl font-black italic tracking-tighter uppercase">Admin<span className="text-primary">.</span></span>
                    </Link>
                )}

                {/* Mobile Close */}
                <button
                    onClick={onCloseMobile}
                    className="lg:hidden p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Desktop Collapse */}
                <button
                    onClick={toggleSidebar}
                    className={`hidden lg:block p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors ${isCollapsed ? "" : "hidden"}`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                {!isCollapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:block p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed && !isMobileOpen ? item.name : ""}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`} />
                            {(!isCollapsed || isMobileOpen) && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
                            {isActive && (!isCollapsed || isMobileOpen) && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-border space-y-1">
                <Link
                    href="/"
                    title={isCollapsed && !isMobileOpen ? "View Website" : ""}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
                >
                    <ExternalLink className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {(!isCollapsed || isMobileOpen) && <span className="font-bold text-sm whitespace-nowrap">View Website</span>}
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title={isCollapsed && !isMobileOpen ? "Logout" : ""}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${(isCollapsed && !isMobileOpen) ? "justify-center" : ""
                        } text-rose-500 hover:bg-rose-50`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {(!isCollapsed || isMobileOpen) && <span className="font-bold text-sm whitespace-nowrap">Logout</span>}
                </button>
                {(!isCollapsed || isMobileOpen) && (
                    <div className="pt-2 text-center pointer-events-none select-none">
                        <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">v1.0.0</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
