"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Context pour partager l'état entre les composants
interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export const Select = ({
    children,
    value = "",
    onValueChange = () => { }
}: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Fermer le menu quand on clique ailleurs
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Delay pour éviter de fermer immédiatement
            const timer = setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isOpen]);

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    if (!context) {
        return (
            <button
                ref={ref}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }

    return (
        <button
            ref={ref}
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                context.setIsOpen(!context.isOpen);
            }}
            className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors",
                "hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className={cn(
                "h-4 w-4 opacity-50 transition-transform duration-200",
                context.isOpen && "rotate-180"
            )} />
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const context = React.useContext(SelectContext);

    // Chercher le label correspondant à la valeur
    return (
        <span className="block truncate text-left">
            {context?.value || placeholder || "Sélectionner..."}
        </span>
    );
};

export const SelectContent = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const context = React.useContext(SelectContext);

    if (!context || !context.isOpen) return null;

    return (
        <div
            className={cn(
                "absolute z-[9999] mt-1 w-full min-w-[8rem] overflow-hidden rounded-xl",
                "border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl",
                "animate-in fade-in-0 zoom-in-95 duration-150",
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="max-h-[300px] overflow-y-auto p-1">
                {children}
            </div>
        </div>
    );
};

export const SelectItem = ({
    children,
    value,
    className
}: {
    children: React.ReactNode;
    value: string;
    className?: string;
}) => {
    const context = React.useContext(SelectContext);
    const isSelected = context?.value === value;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                context?.onValueChange(value);
                context?.setIsOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none",
                "transition-colors hover:bg-white/10 focus:bg-white/10",
                isSelected && "bg-primary/20 text-primary",
                className
            )}
        >
            <span className="flex-1 text-left">{children}</span>
            {isSelected && (
                <Check className="h-4 w-4 text-primary ml-2" />
            )}
        </button>
    );
};

// Export pour les groupes (headers)
export const SelectGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="py-1">{children}</div>
);

export const SelectLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="px-3 py-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
        {children}
    </div>
);
