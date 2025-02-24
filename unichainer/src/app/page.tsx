// src/app/page.tsx
"use client";

import WalletInterface from "./features/wallet/components/WalletInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Using USDC on Unichain
        </h1>
        <p className="text-gray-600 text-lg">
          Send and receive USDC on the Unichain network
        </p>
      </div>

      <WalletInterface />

      <div className="mt-12 text-center text-sm text-gray-500 max-w-lg">
        <p className="mb-4">
          For more information, refer to the{" "}
          <a
            href="https://developers.circle.com"
            className="text-pink-500 hover:text-pink-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Circle Developer Documentation
          </a>
        </p>
      </div>
    </div>
  );
}
