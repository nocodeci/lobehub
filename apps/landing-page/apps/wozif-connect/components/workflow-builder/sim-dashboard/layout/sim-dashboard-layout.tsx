"use client";

import React, { useState } from "react";
import { SIMSidebar } from "../sim-sidebar";
import { SIMTopBar } from "../sim-topbar";
import { SIMSettingsDialog } from "../settings/sim-settings-dialog";

export function SIMDashboardLayout({
    children,
    title = "New Automation",
    showTopBar = true
}: {
    children: React.ReactNode;
    title?: string;
    showTopBar?: boolean;
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--text-primary)] overflow-hidden font-sans select-none">
            {/* 1. Main Dashboard Sidebar */}
            <SIMSidebar onOpenSettings={() => setIsSettingsOpen(true)} />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface-1)]">

                {/* 3. Top Bar (Optional) */}
                {showTopBar && <SIMTopBar breadcrumbs={["Workspaces", title]} />}

                {/* 4. Content */}
                <div className="flex-1 flex overflow-hidden">
                    {children}
                </div>
            </div>

            {/* 5. Global Settings Dialog */}
            <SIMSettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
