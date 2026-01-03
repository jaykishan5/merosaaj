"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Users,
    Trash2,
    Shield,
    User,
    Search,
    Loader2
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

import { TableSkeleton } from "@/components/AdminSkeletons";

export default function AdminUsersPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchUsers();
        }
    }, [status, session]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
        setActionLoading(userId);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error("Failed to update user role", error);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setActionLoading(userId);
        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, {
                method: "DELETE",
            });
            if (res.ok) fetchUsers();
            else {
                const data = await res.json();
                alert(data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <TableSkeleton />;
    }

    return (
        <div className="p-8 lg:p-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">User Management</h1>
                <p className="text-muted-foreground mt-1">Manage accounts and administrative privileges.</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-14 pr-6 py-5 bg-card border border-border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Joined</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user: any) => (
                                <tr key={user._id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name} width={48} height={48} className="object-cover" />
                                                ) : (
                                                    <User className="w-6 h-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleRole(user._id, user.role)}
                                                disabled={actionLoading === user._id || (session.user.id === user._id)}
                                                className={`p-2.5 rounded-xl border border-border transition-all ${user.role === 'ADMIN' ? 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200' : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                title={user.role === 'ADMIN' ? "Revoke Admin Access" : "Grant Admin Access"}
                                            >
                                                {actionLoading === user._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Shield className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                disabled={actionLoading === user._id || (session.user.id === user._id)}
                                                className="p-2.5 rounded-xl border border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete User"
                                            >
                                                {actionLoading === user._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No users found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
