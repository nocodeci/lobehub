import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardPageClient from "./dashboard-client";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Middleware already ensures session exists, but we handle it just in case
    return <DashboardPageClient userName={session?.user?.name || "Entrepreneur"} />;
}

