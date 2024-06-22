import React, { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { cartItemsAtom, isDrawerOpenAtom } from "../atoms/atoms";
import { useProvider } from "@starknet-react/core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import { fetchBuildExecuteTransaction, fetchQuotes } from "@avnu/avnu-sdk";
import CartIcon from "./CartIcon";
import CloseIcon from "./CloseIcon";
import SadIcon from "./SadIcon";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const ONE = BigInt(100000000000000); // 0.0001

interface SideDrawerProps {
  handleCartClick: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ handleCartClick }) => {
  const { primaryWallet } = useDynamicContext();
  const { provider } = useProvider();
  const [cartItems] = useAtom(cartItemsAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target as Node)
    ) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

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

  const handleCheckout = async () => {
    const connector = primaryWallet?.connector as StarknetWalletConnectorType;
    const signer = await connector.getSigner();

    const quotesPromises = cartItems.map((item) =>
      fetchQuote(ONE, ETH_ADDRESS, item.tokenAddress)
    );

    const quotes = await Promise.all(quotesPromises);

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
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-gray-100 bg-opacity-75 transition-opacity" />
      )}

      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`flex flex-col fixed top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-lg z-50 p-4 ease-in-out duration-500 transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={handleCartClick}
          className="absolute top-2 right-2 transform hover:scale-110"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-medium mr-2">Cart</h2>
          <CartIcon height="28" width="28" />
        </div>

        <div className="flex flex-col grow">
          {/* Cart items */}
          <div className="grow">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center mt-12">
                <SadIcon height="80" width="80" />
                <p className="mt-2 text-md">Your cart is empty.</p>
              </div>
            ) : (
              <ul>
                {cartItems.map((item: any, id) => (
                  <li key={id}>
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl ?? "https://via.placeholder.com/150"}
                        alt={item.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p>{item.symbol}</p>
                        <p>{item.buyAmount}</p>
                      </div>
                    </div>
                    {item.address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Checkout button */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white mb-4 p-2 rounded"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
