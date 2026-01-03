"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ShoppingBag,
    Package,
    Users,
    LayoutDashboard,
    X,
    Command as CommandIcon,
    ArrowRight
} from "lucide-react";

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = [
        { name: "Go to Dashboard", href: "/admin", icon: LayoutDashboard, category: "Navigation" },
        { name: "View Orders", href: "/admin/orders", icon: ShoppingBag, category: "Navigation" },
        { name: "Manage Products", href: "/admin/products", icon: Package, category: "Navigation" },
        { name: "Manage Users", href: "/admin/users", icon: Users, category: "Navigation" },
        { name: "Add New Product", href: "/admin/products/add", icon: Package, category: "Actions" },
        { name: "Store Front", href: "/", icon: ArrowRight, category: "General" },
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = useCallback((href: string) => {
        router.push(href);
        onClose();
        setQuery("");
    }, [router, onClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") {
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            }
            if (e.key === "ArrowUp") {
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            if (e.key === "Enter" && filteredCommands.length > 0) {
                handleSelect(filteredCommands[selectedIndex].href);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, filteredCommands, selectedIndex, handleSelect]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex items-center gap-4">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/50"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                    />
                    <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-lg text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        ESC
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {filteredCommands.length > 0 ? (
                        <div className="space-y-4">
                            {Array.from(new Set(filteredCommands.map(c => c.category))).map(category => (
                                <div key={category} className="space-y-1">
                                    <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{category}</p>
                                    {filteredCommands.filter(c => c.category === category).map((cmd) => {
                                        const isSelected = filteredCommands.indexOf(cmd) === selectedIndex;
                                        return (
                                            <button
                                                key={cmd.name}
                                                onClick={() => handleSelect(cmd.href)}
                                                onMouseEnter={() => setSelectedIndex(filteredCommands.indexOf(cmd))}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <cmd.icon className={`w-5 h-5 ${isSelected ? "" : "text-muted-foreground"}`} />
                                                    <span className="font-bold text-sm">{cmd.name}</span>
                                                </div>
                                                {isSelected && <ArrowRight className="w-4 h-4" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            <p className="font-black text-xs uppercase tracking-widest">No commands found</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <span className="px-1.5 py-0.5 bg-card border border-border rounded">↑↓</span>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <span className="px-1.5 py-0.5 bg-card border border-border rounded">Enter</span>
                            <span>Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                        <CommandIcon className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Command Center</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
