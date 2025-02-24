import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USDC Transfer App",
  description: "Send USDC on Unichain network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
