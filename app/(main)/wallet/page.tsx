import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet - ABA Access",
  description: "Manage your wallet balance and payments",
};

export default function WalletPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Wallet Page</h1>
    </div>
  );
}
