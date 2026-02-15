"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminAuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthGuard>
            <div className="flex h-screen overflow-hidden bg-[#050505]">
                <AdminSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto">
                        <div className="grid-pattern min-h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminAuthGuard>
    );
}
