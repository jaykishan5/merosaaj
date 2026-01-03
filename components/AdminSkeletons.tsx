"use client";

import { ShoppingBag, Users as UsersIcon, Package, LayoutDashboard } from "lucide-react";

export function DashboardSkeleton() {
    return (
        <div className="p-8 lg:p-12 animate-pulse">
            <div className="mb-12 space-y-4">
                <div className="h-10 bg-muted rounded-2xl w-64" />
                <div className="h-4 bg-muted rounded-xl w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-card p-8 rounded-[2rem] border border-border h-48" />
                ))}
            </div>

            <div className="bg-card rounded-[2rem] border border-border overflow-hidden h-96" />
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="p-8 lg:p-12 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="space-y-4">
                    <div className="h-10 bg-muted rounded-2xl w-64" />
                    <div className="h-4 bg-muted rounded-xl w-96" />
                </div>
                <div className="h-12 bg-muted rounded-2xl w-32" />
            </div>

            <div className="bg-card rounded-[2rem] border border-border overflow-hidden">
                <div className="p-8 space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-8 items-center h-16 border-b border-border last:border-0">
                            <div className="h-10 bg-muted rounded-xl w-24" />
                            <div className="h-10 bg-muted rounded-xl flex-1" />
                            <div className="h-10 bg-muted rounded-xl w-32" />
                            <div className="h-10 bg-muted rounded-xl w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
