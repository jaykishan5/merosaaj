import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/40 uppercase tracking-widest text-xs">Initializing...</div>}>
            <AdminLoginClient />
        </Suspense>
    );
}
