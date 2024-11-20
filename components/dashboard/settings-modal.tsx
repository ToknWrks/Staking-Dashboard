"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const SWAP_TOKENS = [
  { value: "uusdc", label: "USDC", symbol: "USDC" },
  { value: "nbtc", label: "nBTC", symbol: "nBTC" },
  { value: "uosmo", label: "OSMO", symbol: "OSMO" },
  { value: "uatom", label: "ATOM", symbol: "ATOM" },
];

export function SettingsModal() {
  const [autoSwapPercentage, setAutoSwapPercentage] = useState("50");
  const [taxRate, setTaxRate] = useState("30");
  const [selectedToken, setSelectedToken] = useState("uusdc");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Here we would typically save to a contract or local storage
    const selectedTokenLabel = SWAP_TOKENS.find(t => t.value === selectedToken)?.label;
    toast({
      title: "Settings saved",
      description: `Settings updated: Auto-swap ${autoSwapPercentage}% to ${selectedTokenLabel}, Tax rate ${taxRate}%`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your auto-swap and tax preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="autoSwap">Auto-swap percentage</Label>
            <div className="flex items-center gap-2">
              <Input
                id="autoSwap"
                type="number"
                value={autoSwapPercentage}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, Number(e.target.value)));
                  setAutoSwapPercentage(value.toString());
                }}
                className="flex-1"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Percentage of rewards to automatically swap when claiming
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Swap to token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {SWAP_TOKENS.map((token) => (
                  <SelectItem key={token.value} value={token.value}>
                    {token.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Token to receive when auto-swapping rewards
            </p>
          </div>

          <Separator className="my-2" />

          <div className="grid gap-2">
            <Label htmlFor="taxRate">Tax Rate</Label>
            <div className="flex items-center gap-2">
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, Number(e.target.value)));
                  setTaxRate(value.toString());
                }}
                className="flex-1"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your tax rate for calculating estimated tax obligations
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}