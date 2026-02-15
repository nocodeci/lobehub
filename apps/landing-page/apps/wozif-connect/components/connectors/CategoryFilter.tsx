import React, { memo } from "react";
import { CATEGORIES } from "../../constants/connectors";

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export const CategoryFilter = memo(({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
    return (
        <div className="flex bg-[#171717] p-1 rounded-2xl border border-white/5">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                            ? "bg-white text-black shadow-lg"
                            : "text-muted-foreground hover:text-white"
                        }`}
                >
                    <cat.icon className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">{cat.name}</span>
                </button>
            ))}
        </div>
    );
});

CategoryFilter.displayName = "CategoryFilter";
