"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOsmosisChain } from "@/hooks/use-osmosis-chain";

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  type: 'available' | 'staked' | 'converted' | 'collected' | 'tax';
  description?: string;
}

export function StatsCard({ title, icon, type, description }: StatsCardProps) {
  const { 
    balance,
    stakedBalance,
    isLoading,
    isWalletConnected
  } = useOsmosisChain();

  const getDisplayValue = () => {
    if (!isWalletConnected) return "--";

    switch (type) {
      case 'available':
        return `${balance} OSMO`;
      case 'staked':
        return `${stakedBalance} OSMO`;
      case 'converted':
        return "$0.00";
      case 'collected':
        return "$0.00";
      case 'tax':
        return "$0.00";
      default:
        return "--";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[100px]" />
            {description && <Skeleton className="h-4 w-[200px]" />}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">{getDisplayValue()}</div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {!isWalletConnected ? "Connect wallet to view" : description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}