"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function CoderAuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const coderId = localStorage.getItem("gnata-coder-id");

        if (!coderId) {
            setIsAuthenticated(false);
            // Redirect to login if not on login page
            if (pathname !== "/coder/login") {
                router.push("/coder/login");
            }
        } else {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, [pathname, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // If on login page, show content regardless of auth state
    if (pathname === "/coder/login") {
        return <>{children}</>;
    }

    // If not authenticated, don't render (redirect will happen)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // Authenticated, render children
    return <>{children}</>;
}
