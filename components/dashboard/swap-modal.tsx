import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SwapModalProps {
  open: boolean;
  onClose: () => void;
}

export function SwapModal({ open, onClose }: SwapModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] h-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Swap Tokens</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 -mx-6 -mb-6">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <iframe
            src="https://swapfast.app/embed/swaps"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}