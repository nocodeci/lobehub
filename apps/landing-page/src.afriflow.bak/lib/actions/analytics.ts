"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { subDays, startOfDay, endOfDay, format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSelectedAppId } from "./utils";

export async function getAnalyticsData(days: number = 7) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const now = new Date();
        const startDate = startOfDay(subDays(now, days));
        const prevStartDate = startOfDay(subDays(startDate, days));

        // Fetch current period data
        const currentRecords = await prisma.paymentRecord.findMany({
            where: {
                applicationId: appId,
                createdAt: { gte: startDate }
            }
        });

        // Fetch previous period data for trends
        const prevRecords = await prisma.paymentRecord.findMany({
            where: {
                applicationId: appId,
                createdAt: { gte: prevStartDate, lt: startDate }
            }
        });

        // 1. Calculate Metrics
        const calculateStats = (records: any[]) => {
            const success = records.filter(r => r.status === 'SUCCESS');
            const revenue = success.reduce((acc, r) => acc + r.amount, 0);
            const failureRate = records.length > 0 ? (records.filter(r => r.status === 'FAILED').length / records.length) * 100 : 0;
            const uniqueClients = new Set(records.map(r => r.customerEmail)).size;
            const avgVolume = uniqueClients > 0 ? revenue / uniqueClients : 0;

            // Average response time in seconds
            const responseTimes = success
                .filter(r => r.completedAt)
                .map(r => (r.completedAt!.getTime() - r.createdAt.getTime()) / 1000);
            const avgResponseTime = responseTimes.length > 0
                ? responseTimes.reduce((acc, t) => acc + t, 0) / responseTimes.length
                : 1.2; // fallback

            return { revenue, failureRate, avgVolume, avgResponseTime };
        };

        const currentStats = calculateStats(currentRecords);
        const prevStats = calculateStats(prevRecords);

        const getTrend = (curr: number, prev: number) => {
            if (prev === 0) return { val: "+0%", up: true };
            const diff = ((curr - prev) / prev) * 100;
            return {
                val: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
                up: diff >= 0
            };
        };

        // 2. Conversion Data (Area Chart)
        const conversionData = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(now, i);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);

            const dayRecords = currentRecords.filter((r: any) => r.createdAt >= dayStart && r.createdAt <= dayEnd);
            const daySuccess = dayRecords.filter((r: any) => r.status === 'SUCCESS').length;
            const rate = dayRecords.length > 0 ? (daySuccess / dayRecords.length) * 100 : 0;

            conversionData.push({
                name: format(date, 'eee', { locale: fr }),
                value: Math.round(rate)
            });
        }

        // 3. Gateway Mix (Pie Chart)
        const gatewayCounts: Record<string, number> = {};
        currentRecords.forEach((r: any) => {
            const provider = r.provider || "Autre";
            gatewayCounts[provider] = (gatewayCounts[provider] || 0) + 1;
        });
        const gatewayMixData = Object.entries(gatewayCounts).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);

        // 4. Regional Volume (Bar Chart)
        const customersWithSuccess = await prisma.customer.findMany({
            where: { applicationId: appId },
            select: { id: true, country: true, email: true }
        });

        const regionVolume: Record<string, number> = {};
        currentRecords.filter((r: any) => r.status === 'SUCCESS').forEach((r: any) => {
            let country = "Autre";

            // 1. Try to infer from Phone Number
            const phone = r.customerPhone?.replace(/\D/g, '') || "";
            if (phone.startsWith('225')) country = "Côte d'Ivoire";
            else if (phone.startsWith('221')) country = "Sénégal";
            else if (phone.startsWith('229')) country = "Bénin";
            else if (phone.startsWith('237')) country = "Cameroun";
            else if (phone.startsWith('223')) country = "Mali";
            else if (phone.startsWith('226')) country = "Burkina Faso";
            else if (phone.startsWith('228')) country = "Togo";
            else if (phone.startsWith('241')) country = "Gabon";
            else if (phone.startsWith('242')) country = "Congo";
            else if (phone.startsWith('243')) country = "RDC";

            // 2. If phone didn't match, check provider/method hint if available
            if (country === "Autre" && r.provider) {
                const p = r.provider.toLowerCase();
                if (p.includes('ci') || p.includes('cote') || p.includes('ivory')) country = "Côte d'Ivoire";
                else if (p.includes('sn') || p.includes('senegal')) country = "Sénégal";
                else if (p.includes('bj') || p.includes('benin')) country = "Bénin";
                else if (p.includes('cm') || p.includes('cameroon')) country = "Cameroun";
            }

            // 3. Fallback to Customer Profile
            if (country === "Autre") {
                const customer = customersWithSuccess.find((c: any) => c.email === r.customerEmail);
                country = customer?.country || "Sénégal"; // Default to Senegal if truly unknown, as per user base
            }

            regionVolume[country] = (regionVolume[country] || 0) + r.amount;
        });

        const regionalData = Object.entries(regionVolume).map(([name, amount], i) => ({
            name,
            amount,
            color: `hsl(var(--chart-${(i % 5) + 1}))`
        })).sort((a, b) => b.amount - a.amount);

        return {
            stats: [
                { title: "Revenue Net", value: `${currentStats.revenue.toLocaleString()} F`, trend: getTrend(currentStats.revenue, prevStats.revenue).val, up: getTrend(currentStats.revenue, prevStats.revenue).up, icon: "zap" },
                { title: "Temps de Réponse", value: `${currentStats.avgResponseTime.toFixed(1)}s`, trend: `${(currentStats.avgResponseTime - prevStats.avgResponseTime).toFixed(1)}s`, up: currentStats.avgResponseTime <= prevStats.avgResponseTime, icon: "activity" },
                { title: "Taux d'Échec", value: `${currentStats.failureRate.toFixed(1)}%`, trend: getTrend(currentStats.failureRate, prevStats.failureRate).val, up: currentStats.failureRate <= prevStats.failureRate, icon: "trending-down" },
                { title: "Volume Moyen/Client", value: `${Math.round(currentStats.avgVolume).toLocaleString()} F`, trend: getTrend(currentStats.avgVolume, prevStats.avgVolume).val, up: getTrend(currentStats.avgVolume, prevStats.avgVolume).up, icon: "bar-chart" },
            ],
            conversionData,
            gatewayMixData,
            regionalData
        };
    } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        throw error;
    }
}
