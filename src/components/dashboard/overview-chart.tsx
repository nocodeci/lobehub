"use client";

import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    Cell
} from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getWeeklyVolume } from "@/lib/actions/dashboard";

export function OverviewChart() {
    const [volumeData, setVolumeData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVolume() {
            const data = await getWeeklyVolume();
            setVolumeData(data);
            setIsLoading(false);
        }
        fetchVolume();
    }, []);

    if (isLoading) {
        return (
            <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg h-[450px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </Card>
        );
    }

    return (
        <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg h-full">
            <CardHeader>
                <CardTitle>Volume de Transactions (Hebdomadaire)</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Evolution du flux financier sur l'ensemble des passerelles.
                </p>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer
                    config={{
                        total: {
                            label: "Volume Total",
                            color: "hsl(var(--primary))",
                        },
                    }}
                    className="h-[350px] w-full"
                >
                    <BarChart data={volumeData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="total"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary opacity-80"
                        >
                            {volumeData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    className="fill-primary hover:opacity-100 transition-opacity cursor-pointer"
                                    fill="hsl(var(--primary) / 0.4)"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
