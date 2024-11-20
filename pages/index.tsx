import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RewardsChart } from "@/components/dashboard/rewards-chart";
import { DelegationsCard } from "@/components/dashboard/delegations-card";
import { CoinsIcon, DollarSignIcon, PiggyBankIcon, ReceiptIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Available OSMO"
            type="available"
            icon={<CoinsIcon className="h-4 w-4 text-muted-foreground" />}
            description="Available balance in your wallet"
          />
          <StatsCard
            title="Staked OSMO"
            type="staked"
            icon={<CoinsIcon className="h-4 w-4 text-muted-foreground" />}
            description="Total OSMO staked"
          />
          <StatsCard
            title="Total USD Value of Rewards Claimed"
            type="converted"
            icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
            description="Value of all claimed rewards"
          />
          <StatsCard
            title="USD Collected"
            type="collected"
            icon={<PiggyBankIcon className="h-4 w-4 text-muted-foreground" />}
            description="Total USD value collected"
          />
          <StatsCard
            title="Tax Obligation"
            type="tax"
            icon={<ReceiptIcon className="h-4 w-4 text-muted-foreground" />}
            description="Estimated tax obligation"
          />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <RewardsChart />
          <DelegationsCard />
        </div>
      </main>
    </div>
  );
}