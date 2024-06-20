"use client";
import { useEffect, useState } from "react";
import { useProvider } from "@starknet-react/core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import { fetchBuildExecuteTransaction, fetchQuotes } from "@avnu/avnu-sdk";
import Navbar from "@/app/components/Navbar";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const ONE = BigInt(100000000000000); // 0.0001

type Token = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl?: string | null;
};

const getTokens = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/tokens");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const { provider } = useProvider();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTokens();
      setTokens(res);
    };

    fetchData();
  }, []);

  const handleCartClick = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const fetchQuote = async (
    sellAmount: bigint,
    sellTokenAddress: string,
    buyTokenAddress: string
  ) => {
    const params = {
      sellTokenAddress,
      buyTokenAddress,
      sellAmount,
      takerAddress: primaryWallet?.address,
    };
    return fetchQuotes(params).then((quotes) => quotes[0]);
  };

  const handleSwap = async () => {
    const connector = primaryWallet?.connector as StarknetWalletConnectorType;
    const signer = await connector.getSigner();

    const quote1 = await fetchQuote(ONE, ETH_ADDRESS, tokens[0].address);
    const quote2 = await fetchQuote(ONE, ETH_ADDRESS, tokens[1].address);
    const quotes = [quote1, quote2];
    const callsPromises = quotes.map(async (quote) => {
      let result = await fetchBuildExecuteTransaction(quote.quoteId);
      const { calls } = result;
      return calls;
    });
    const calls = await Promise.all(callsPromises);

    const multicall = await signer?.execute(calls.flat());
    await provider.waitForTransaction(multicall?.transaction_hash!!);
  };

  return (
    <main>
      <Navbar handleCartClick={handleCartClick} />
      <div className="absolute top-[72px] w-full">
        <button onClick={handleSwap}>swap</button>
        <div className="flex flex-col gap-4">
          {tokens.map((token) => (
            <div key={token.id} className="flex gap-4">
              <img
                src={token?.imageUrl ?? "https://via.placeholder.com/150"}
                alt={token.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p>{token.name}</p>
                <p>{token.symbol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4">
          <button
            onClick={handleCartClick}
            className="absolute top-2 right-2 text-gray-600"
          >
            Close
          </button>
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          {/* Cart contents go here */}
        </div>
      )}
    </main>
  );
}
