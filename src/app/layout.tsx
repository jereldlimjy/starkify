import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarknetProvider } from "@/app/components/StarknetProvider";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "jotai";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Starkify",
  description: "Bringing the e-commerce experience to Starknet",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          background:
            "linear-gradient(0.59deg, #FBECF3 0.97%, #F3EBF7 26.24%, #F0F0FB 54.59%, #E6F0FF 99.96%)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <DynamicContextProvider
          settings={{
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
            walletConnectors: [StarknetWalletConnectors],
          }}
        >
          <StarknetProvider>
            <Provider>
              {children}
              <Analytics />
            </Provider>
          </StarknetProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
