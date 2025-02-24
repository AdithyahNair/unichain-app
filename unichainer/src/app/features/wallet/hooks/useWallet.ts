// src/app/features/wallet/hooks/useWallet.ts

import { useState, useEffect } from "react";
import {
  http,
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
} from "viem";
import { unichainSepolia } from "viem/chains";
import type { Address, Hash, TransactionReceipt } from "viem";
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from "../constants/contracts";

// Define the chain if it doesn't exist in viem
const unichainSepoliaConfig = {
  id: 11155111, // Sepolia Chain ID (Replace with Unichain's specific chain ID if different)
  name: "Unichain Sepolia",
  network: "unichainSepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.infura.io/v3/"] }, // Replace with actual Unichain RPC if available
    default: { http: ["https://sepolia.infura.io/v3/"] }, // Replace with actual Unichain RPC if available
  },
};

// Create a public client to interact with the blockchain
const publicClient = createPublicClient({
  chain: unichainSepoliaConfig,
  transport: http("https://sepolia.infura.io/v3/"), // Replace with actual Unichain RPC if available
});

export function useWallet() {
  const [account, setAccount] = useState<Address | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to connect wallet
  async function connectWallet() {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if ethereum is available in the window object
      if (!window.ethereum) {
        throw new Error(
          "No wallet detected. Please install Uniswap Wallet or MetaMask."
        );
      }

      // Specifically check for Uniswap wallet
      const isUniswap = window.ethereum.isUniswap;

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Set the first account as the current account
      const currentAccount = accounts[0] as Address;
      setAccount(currentAccount);

      // Create wallet client
      const walletClient = createWalletClient({
        chain: unichainSepoliaConfig,
        transport: custom(window.ethereum),
      });

      // Get USDC balance
      await fetchBalance(currentAccount);

      return currentAccount;
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }

  // Function to fetch USDC balance
  async function fetchBalance(address: Address) {
    try {
      const balanceResult = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      // Format balance (USDC has 6 decimals)
      const formattedBalance = (Number(balanceResult) / 1_000_000).toFixed(2);
      setBalance(formattedBalance);
      return formattedBalance;
    } catch (err: any) {
      console.error("Failed to fetch balance:", err);
      setError(err.message || "Failed to fetch balance");
      return "0";
    }
  }

  // Function to send USDC
  async function sendUSDC(
    recipientAddress: string,
    amount: string
  ): Promise<TransactionReceipt | null> {
    setIsSending(true);
    setError(null);

    try {
      // Check if wallet is connected
      if (!account) {
        throw new Error("Wallet not connected");
      }

      // Convert amount to USDC units (6 decimals)
      const amountInUSDCUnits = BigInt(
        Math.floor(parseFloat(amount) * 1_000_000)
      );

      // Create wallet client
      const walletClient = createWalletClient({
        chain: unichainSepoliaConfig,
        transport: custom(window.ethereum),
      });

      // Encode the transfer function data
      const data = encodeFunctionData({
        abi: USDC_ABI,
        functionName: "transfer",
        args: [recipientAddress as Address, amountInUSDCUnits],
      });

      // Send transaction
      const hash = await walletClient.sendTransaction({
        to: USDC_CONTRACT_ADDRESS,
        data,
        account,
      });

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Refresh balance after sending
      await fetchBalance(account);

      return receipt;
    } catch (err: any) {
      console.error("Failed to send USDC:", err);
      setError(err.message || "Failed to send USDC");
      return null;
    } finally {
      setIsSending(false);
    }
  }

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          setBalance("0");
        } else if (accounts[0] !== account) {
          // User switched accounts
          setAccount(accounts[0] as Address);
          fetchBalance(accounts[0] as Address);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [account]);

  return {
    account,
    balance,
    isConnecting,
    isSending,
    error,
    connectWallet,
    sendUSDC,
    fetchBalance,
  };
}

export default useWallet;
