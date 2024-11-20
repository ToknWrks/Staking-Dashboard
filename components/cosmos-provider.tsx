"use client";

import * as React from "react";
import { Chain } from '@chain-registry/types';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';

// Filter for Osmosis chain
const osmosisChain = chains.find((chain: Chain) => chain.chain_name === 'osmosis');
const osmosisAssets = assets.filter((asset) => asset.chain_name === 'osmosis');

export function CosmosProvider({ children }: { children: React.ReactNode }) {
  if (!osmosisChain) {
    console.error('Osmosis chain configuration not found');
    return null;
  }

  return (
    <ChainProvider
      chains={[osmosisChain]}
      assetLists={osmosisAssets}
      wallets={keplrWallets}
      signerOptions={{
        signingStargate: () => ({
          preferNoSetFee: false,
          preferNoSetMemo: true,
        }),
        signingCosmwasm: () => ({
          preferNoSetFee: false,
          preferNoSetMemo: true,
        })
      }}
      endpointOptions={{
        endpoints: {
          osmosis: {
            rpc: ["https://rpc.osmosis.zone"],
            rest: ["https://lcd.osmosis.zone"],
          }
        }
      }}
      walletConnectOptions={undefined}
    >
      {children}
    </ChainProvider>
  );
}