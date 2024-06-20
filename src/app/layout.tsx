import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarknetProvider } from "@/app/components/starknet-provider";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Starkify",
  description: "Bringing the e-commerce experience to Starknet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicContextProvider
          settings={{
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
            walletConnectors: [StarknetWalletConnectors],
          }}
        >
          <StarknetProvider>{children}</StarknetProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
