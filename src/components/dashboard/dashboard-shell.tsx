"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";

export function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isCheckoutAppearance = pathname === "/transactions/checkout-appearance";

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden p-4 md:p-6 lg:p-8">
                <div className="flex-1 flex flex-col bg-[#1f1f1f] backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl relative">
                    {!isCheckoutAppearance && <Header />}

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className={cn(
                            "min-h-full",
                            !isCheckoutAppearance && "p-6 md:p-10"
                        )}>
                            <div className={cn(
                                "mx-auto h-full",
                                !isCheckoutAppearance && "max-w-[1600px]"
                            )}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
