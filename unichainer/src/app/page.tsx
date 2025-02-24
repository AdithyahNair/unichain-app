// app/page.tsx

import WalletInterface from "./features/wallet/components/WalletInterface";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Using USDC on Unichain</h1>
          <p className="text-gray-500 mb-8">
            Send and receive USDC on the Unichain network
          </p>
        </div>

        <WalletInterface />
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>
          For more information, refer to the{" "}
          <a
            href="https://developers.circle.com"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Circle Developer Documentation
          </a>
        </p>
      </footer>
    </main>
  );
}
