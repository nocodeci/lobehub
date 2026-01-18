import { StatsCards } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { GatewayList } from "@/components/dashboard/gateway-list";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre centre de commande AfriFlow.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Exporter
          </Button>
          <Link href="/gateways/new">
            <Button size="sm" className="gap-2 bg-primary shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Nouvelle passerelle
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <OverviewChart />
        </div>
        <div className="lg:col-span-3">
          <TransactionList />
        </div>
      </div>

      <GatewayList />
    </div>
  );
}
