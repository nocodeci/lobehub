"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { useConnectorFilters } from "../../hooks/useConnectorFilters";
import { ConnectorsHeader } from "../../components/connectors/ConnectorsHeader";
import { SearchBar } from "../../components/connectors/SearchBar";
import { CategoryFilter } from "../../components/connectors/CategoryFilter";
import { ConnectorGrid } from "../../components/connectors/ConnectorGrid";

export default function ConnectorsPage() {
    const {
        searchQuery,
        activeCategory,
        filteredConnectors,
        handleSearchChange,
        handleCategoryChange,
    } = useConnectorFilters();

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden text-white/90">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        <ConnectorsHeader />

                        {/* Search & Categories */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <CategoryFilter
                                    activeCategory={activeCategory}
                                    onCategoryChange={handleCategoryChange}
                                />
                            </div>
                        </div>

                        <ConnectorGrid connectors={filteredConnectors} />

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
