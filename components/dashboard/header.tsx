import { MoonStar, Sun, Wallet } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "./settings-modal";
import { SwapModal } from "./swap-modal";
import { WalletModal } from "./wallet-modal";
import { useState } from "react";
import { useOsmosisChain } from "@/hooks/use-osmosis-chain";
import { Loader2 } from "lucide-react";

export function Header() {
  const { setTheme } = useTheme();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { isWalletConnected, isWalletConnecting, status } = useOsmosisChain();

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Osmosis Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => setShowSwapModal(true)}
          >
            Swap
          </Button>
          <Button 
            variant="outline" 
            onClick={() => !isWalletConnected && setShowWalletModal(true)}
            disabled={isWalletConnecting}
            className="min-w-[160px]"
          >
            {isWalletConnecting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                {isWalletConnected ? formatAddress(status) : 'Connect Wallet'}
              </span>
            )}
          </Button>
          <SettingsModal />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SwapModal open={showSwapModal} onClose={() => setShowSwapModal(false)} />
      <WalletModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </header>
  );
}