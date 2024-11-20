"use client";

import { useState, useCallback, useEffect } from "react";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";

const OSMOSIS_CHAIN_ID = "osmosis-1";
const OSMOSIS_RPC = "https://rpc.osmosis.zone";
const OSMOSIS_LCD = "https://lcd.osmosis.zone";
const OSMO_DENOM = "uosmo";

export function useKeplr() {
  const [address, setAddress] = useState<string>("");
  const [client, setClient] = useState<StargateClient | null>(null);
  const [signingClient, setSigningClient] = useState<SigningStargateClient | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'Connected' | 'Connecting' | 'Disconnected'>('Disconnected');

  // Fetch wallet balance
  const fetchBalance = useCallback(async (stargateClient: StargateClient, userAddress: string) => {
    if (!stargateClient || !userAddress || status !== 'Connected') {
      setBalance("0");
      return;
    }

    try {
      const balance = await stargateClient.getBalance(userAddress, OSMO_DENOM);
      const osmoBalance = balance?.amount ? Number(balance.amount) / 1_000_000 : 0;
      setBalance(osmoBalance.toFixed(6));
      setError(null);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
      setBalance("0");
    }
  }, [status]);

  // Fetch staked balance
  const fetchStakedBalance = useCallback(async (userAddress: string) => {
    if (!userAddress || status !== 'Connected') {
      setStakedBalance("0");
      return;
    }

    try {
      const response = await fetch(`${OSMOSIS_LCD}/cosmos/staking/v1beta1/delegations/${userAddress}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      const delegations = data.delegation_responses || [];
      const totalStaked = delegations.reduce((sum: number, delegation: any) => {
        if (!delegation?.balance?.amount) return sum;
        return sum + Number(delegation.balance.amount);
      }, 0);

      const stakedOsmo = totalStaked / 1_000_000;
      setStakedBalance(stakedOsmo.toFixed(6));
      setError(null);
    } catch (err) {
      console.error("Error fetching staked balance:", err);
      setError("Failed to fetch staked balance");
      setStakedBalance("0");
    }
  }, [status]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;
    
    if (!window.keplr) {
      setError("Please install Keplr extension");
      return;
    }

    setIsLoading(true);
    setStatus('Connecting');
    setError(null);

    try {
      await window.keplr.enable(OSMOSIS_CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(OSMOSIS_CHAIN_ID);
      
      const accounts = await offlineSigner.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const userAddress = accounts[0].address;
      const stargateClient = await StargateClient.connect(OSMOSIS_RPC);
      const signingStargateClient = await SigningStargateClient.connectWithSigner(
        OSMOSIS_RPC,
        offlineSigner
      );

      setAddress(userAddress);
      setClient(stargateClient);
      setSigningClient(signingStargateClient);
      setStatus('Connected');

      // Initial balance fetch
      await Promise.all([
        fetchBalance(stargateClient, userAddress),
        fetchStakedBalance(userAddress)
      ]);
    } catch (err) {
      console.error("Error connecting to Keplr:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect";
      setError(`Connection failed: ${errorMessage}`);
      disconnect();
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance, fetchStakedBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress("");
    setClient(null);
    setSigningClient(null);
    setBalance("0");
    setStakedBalance("0");
    setError(null);
    setIsLoading(false);
    setStatus('Disconnected');
  }, []);

  // Handle Keplr account changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAccountChange = () => {
      if (status === 'Connected') {
        connect();
      }
    };

    window.addEventListener("keplr_keystorechange", handleAccountChange);
    return () => {
      window.removeEventListener("keplr_keystorechange", handleAccountChange);
    };
  }, [status, connect]);

  return {
    connect,
    disconnect,
    status,
    isLoading,
    error,
    address,
    balance,
    stakedBalance,
    client,
    signingClient,
  };
}