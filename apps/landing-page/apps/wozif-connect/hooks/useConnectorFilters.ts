import { useState, useMemo, useCallback } from "react";
import { Connector } from "../types/connectors";
import { CONNECTORS } from "../constants/connectors";

export const useConnectorFilters = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleCategoryChange = useCallback((id: string) => {
        setActiveCategory(id);
    }, []);

    const filteredConnectors = useMemo(() => {
        return CONNECTORS.filter((c) => {
            const matchesSearch = c.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                activeCategory === "all" || c.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return {
        searchQuery,
        activeCategory,
        filteredConnectors,
        handleSearchChange,
        handleCategoryChange,
    };
};
