"use client";

import { useState } from "react";
import { useWallet } from "../hooks/useWallet";

const WalletInterface = () => {
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  const {
    account,
    balance,
    isConnecting,
    isSending,
    error,
    connectWallet,
    sendUSDC,
  } = useWallet();

  // Handle connect wallet button click
  const handleConnectWallet = async () => {
    await connectWallet();
  };

  // Handle send USDC button click
  const handleSendUSDC = async () => {
    if (!recipientAddress || !amount) return;

    try {
      const receipt = await sendUSDC(recipientAddress, amount);
      if (receipt) {
        setTxHash(receipt.transactionHash as string);
        setTxSuccess(true);
      } else {
        setTxSuccess(false);
      }
    } catch (err) {
      setTxSuccess(false);
      console.error("Error sending USDC:", err);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded-lg bg-white shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {account ? `Wallet ${formatAddress(account)}` : "Connect Wallet"}
        </h2>
        {account && (
          <div className="text-2xl font-bold mt-2">
            ${balance} <span className="text-sm opacity-70">USDC</span>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      {!account ? (
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleConnectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <input
              className="w-full p-2 border rounded"
              placeholder="Send to address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>

          <div>
            <input
              className="w-full p-2 border rounded"
              placeholder="Amount USDC"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded transition"
            onClick={handleSendUSDC}
            disabled={isSending || !recipientAddress || !amount}
          >
            {isSending ? "Sending..." : "Send"}
          </button>

          {txHash && (
            <div className="text-sm mt-2">
              <p className={txSuccess ? "text-green-500" : "text-red-500"}>
                {txSuccess ? "Transaction Successful" : "Transaction Failed"}
              </p>
              <p className="break-all">Transaction Hash: {txHash}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-6 text-xs opacity-70">
        <span>You are in testnet mode</span>
        <div className="flex gap-4">
          <a href="#" className="text-blue-500 hover:underline">
            What is USDC
          </a>
          <a href="#" className="text-blue-500 hover:underline">
            Developer Tools
          </a>
          <a
            href="https://circle.com"
            className="text-blue-500 hover:underline"
          >
            Go to Circle.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default WalletInterface;
