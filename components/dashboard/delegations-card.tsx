"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOsmosisChain } from "@/hooks/use-osmosis-chain";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function DelegationsCard() {
  const { delegations, status, isLoading } = useOsmosisChain();

  const formatOsmo = (amount: string) => {
    const osmo = Number(amount) / 1_000_000;
    return isNaN(osmo) ? "0.00" : osmo.toFixed(2);
  };

  if (status !== 'Connected') {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Your Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view delegations
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Your Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Your Delegations</CardTitle>
      </CardHeader>
      <CardContent>
        {delegations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No delegations found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Validator</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delegations.map((delegation, index) => (
                <TableRow key={`${delegation.validator_address}-${index}`}>
                  <TableCell className="font-medium">
                    {delegation.validator_name || "Unknown Validator"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatOsmo(delegation.balance.amount)} OSMO
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}