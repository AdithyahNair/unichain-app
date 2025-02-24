// src/app/features/wallet/components/WalletInterface.tsx
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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!account ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Connect Wallet</h2>

            <button
              className="w-full py-3 px-4 bg-[#5E5ADB] hover:bg-[#4E49C6] text-white font-medium rounded-xl transition duration-200 ease-in-out"
              onClick={handleConnectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>

            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-700"
                    >
                      <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">
                    {formatAddress(account)}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                ${balance} <span className="text-sm text-gray-500">USDC</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Send to address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>

              <div>
                <input
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Amount USDC"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button
                className="w-full py-3 px-4 bg-[#FF007A] hover:bg-[#E9006F] text-white font-medium rounded-xl transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendUSDC}
                disabled={isSending || !recipientAddress || !amount}
              >
                {isSending ? "Sending..." : "Send"}
              </button>

              {txHash && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p
                    className={
                      txSuccess
                        ? "text-green-500 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {txSuccess
                      ? "Transaction Successful"
                      : "Transaction Failed"}
                  </p>
                  <p className="text-xs text-gray-600 break-all mt-1">
                    Transaction Hash: {txHash}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
          <span>You are in testnet mode</span>
          <div className="flex gap-4">
            <a href="#" className="text-[#FF007A] hover:underline">
              What is USDC
            </a>
            <a href="#" className="text-[#FF007A] hover:underline">
              Developer Tools
            </a>
            <a
              href="https://circle.com"
              className="text-[#FF007A] hover:underline"
            >
              Go to Circle.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInterface;
