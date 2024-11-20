"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChain } from "@cosmos-kit/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect, isWalletConnecting } = useChain("osmosis");
  const [error, setError] = React.useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
      onClose();
    } catch (err) {
      console.error("Failed to connect:", err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm text-red-500 mb-2">
              {error}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleConnect}
            disabled={isWalletConnecting}
          >
            <div className="flex items-center w-full">
              <div className="w-6 h-6 relative flex items-center justify-center rounded-full bg-[#7C63F5]">
                <Image
                  src="/keplr-logo.png"
                  alt="Keplr"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <span className="ml-2">Keplr Wallet</span>
              {isWalletConnecting && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
              )}
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}