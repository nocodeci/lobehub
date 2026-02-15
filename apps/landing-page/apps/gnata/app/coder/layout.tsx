"use client";

import { usePathname } from "next/navigation";
import { CoderSidebar } from "@/components/coder/coder-sidebar";
import { CoderHeader } from "@/components/coder/coder-header";
import { CoderAuthGuard } from "@/components/coder/auth-guard";

export default function CoderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Login page has its own layout
    if (pathname === "/coder/login") {
        return (
            <CoderAuthGuard>
                {children}
            </CoderAuthGuard>
        );
    }

    return (
        <CoderAuthGuard>
            <div className="flex h-screen overflow-hidden bg-[#050505]">
                <CoderSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <CoderHeader />
                    <main className="flex-1 overflow-y-auto">
                        <div className="min-h-full" style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px'
                        }}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </CoderAuthGuard>
    );
}
