"use client";
import { useProvider } from "@starknet-react/core";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import { fetchBuildExecuteTransaction, fetchQuotes } from "@avnu/avnu-sdk";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const ONE = BigInt(100000000000000); // 0.0001

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const { provider } = useProvider();

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

    const quote1 = await fetchQuote(ONE, ETH_ADDRESS, STRK_ADDRESS);
    const quote2 = await fetchQuote(ONE, STRK_ADDRESS, ETH_ADDRESS);
    const quotes = [quote1, quote2];
    const callsPromises = quotes.map(async (quote) => {
      let result = await fetchBuildExecuteTransaction(quote.quoteId);
      const { calls } = result;
      return calls;
    });
    const calls = await Promise.all(callsPromises);

    // You can use this flat calls array to execute
    console.log(calls.flat());

    const multicall = await signer?.execute(calls.flat());
    await provider.waitForTransaction(multicall?.transaction_hash!!);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <DynamicWidget />
      {/* <button onClick={() => handleSwap} /> */}
      <button onClick={handleSwap}>hello</button>
    </main>
  );
}
