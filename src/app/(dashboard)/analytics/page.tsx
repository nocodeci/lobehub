"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
    ArrowUpRight,
    Calendar,
    Download,
    Filter,
    TrendingUp,
    TrendingDown,
    Zap,
    Globe,
    PieChart as PieIcon,
    BarChart3,
    Activity,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { getAnalyticsData } from "@/lib/actions/analytics";

const iconMap: Record<string, any> = {
    zap: Zap,
    activity: Activity,
    "trending-down": TrendingDown,
    "bar-chart": BarChart3
};

export default function AnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [data, setData] = useState<any>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAnalyticsData(days);
            setData(res);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }, [days]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (isLoading && !data) {
        return (
            <div className="p-8 animate-pulse space-y-8">
                <div className="flex justify-between items-center">
                    <div className="h-10 w-48 bg-card/40 rounded-lg" />
                    <div className="h-10 w-32 bg-card/40 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-card/40 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 h-[400px] bg-card/40 rounded-xl" />
                    <div className="col-span-4 h-[400px] bg-card/40 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic text-gradient">Analytiques Avancées</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Visualisez la croissance et l'efficacité de vos flux de paiement.
                    </p>
                </div>
                <div className="flex gap-3">
                    <DropdownMenuWrapper days={days} setDays={setDays} />
                    <Button className="gap-2 bg-primary font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
                        <Download className="h-4 w-4" /> Rapport complet
                    </Button>
                </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence>
                    {data?.stats.map((stat: any, i: number) => {
                        const Icon = iconMap[stat.icon] || Zap;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border border-white/10 bg-card/40 backdrop-blur-xl relative overflow-hidden group rounded-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                                            <Icon className="h-4 w-4 text-primary opacity-50" />
                                        </div>
                                        <h3 className="text-2xl font-black mt-2 tracking-tight">{stat.value}</h3>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className={`text-[10px] font-black ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {stat.trend}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium">vs période précédente</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Multi-Chart Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
                {/* Conversion Rate Area Chart */}
                <Card className="lg:col-span-8 border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative">
                    {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>}
                    <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5 bg-white/5">
                        <div>
                            <CardTitle className="font-black uppercase italic tracking-tighter">Taux de Conversion</CardTitle>
                            <CardDescription className="font-medium">Performance globale de conversion par jour.</CardDescription>
                        </div>
                        <TrendingUp className="h-6 w-6 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <ChartContainer config={{ value: { label: "Taux %", color: "hsl(var(--primary))" } }} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.conversionData || []}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Gateway Distribution Pie Chart */}
                <Card className="lg:col-span-4 border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative">
                    {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>}
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <CardTitle className="font-black uppercase italic tracking-tighter">Passerelles</CardTitle>
                        <CardDescription className="font-medium">Répartition des flux par fournisseur.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {data?.gatewayMixData.length === 0 ? (
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground font-bold italic">Aucune donnée</div>
                        ) : (
                            <>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data?.gatewayMixData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {data?.gatewayMixData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    {data?.gatewayMixData.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                                            <span className="text-[10px] font-black uppercase text-muted-foreground truncate">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Regional Volume Bar Chart */}
                <Card className="lg:col-span-12 border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative">
                    {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>}
                    <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5 bg-white/5">
                        <div>
                            <CardTitle className="font-black uppercase italic tracking-tighter">Volume par Région</CardTitle>
                            <CardDescription className="font-medium">Analyse géographique des flux financiers.</CardDescription>
                        </div>
                        <Globe className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent className="p-8">
                        {data?.regionalData.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground font-bold italic">Aucune donnée géographique</div>
                        ) : (
                            <ChartContainer config={{}} className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.regionalData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            stroke="#888888"
                                            fontSize={12}
                                            fontWeight="black"
                                            tickLine={false}
                                            axisLine={false}
                                            width={120}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={40}>
                                            {data?.regionalData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Sub-component for Date Range Dropdown
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DropdownMenuWrapper({ days, setDays }: { days: number, setDays: (d: number) => void }) {
    const labels: Record<number, string> = {
        7: "7 derniers jours",
        30: "30 derniers jours",
        90: "90 derniers jours"
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-white/10 bg-white/5 backdrop-blur-md h-11 px-5 rounded-xl font-bold">
                    <Calendar className="h-4 w-4" /> {labels[days]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card/90 backdrop-blur-xl border-white/10 font-bold min-w-[200px]">
                <DropdownMenuItem onClick={() => setDays(7)}>7 derniers jours</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDays(30)}>30 derniers jours</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDays(90)}>90 derniers jours</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
