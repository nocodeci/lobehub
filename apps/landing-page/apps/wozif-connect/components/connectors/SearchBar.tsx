import React, { memo } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = memo(({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                placeholder="Rechercher un service, un CRM, une boutique..."
                className="w-full bg-[#171717] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
});

SearchBar.displayName = "SearchBar";
