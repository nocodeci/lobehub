"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="ml-2 h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200/50 group"
            title="Se déconnecter"
        >
            <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
        </button>
    );
}
