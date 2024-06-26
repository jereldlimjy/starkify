import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { cartItemsAtom, isDrawerOpenAtom } from "../atoms/atoms";
import { useProvider } from "@starknet-react/core";
import {
  DynamicConnectButton,
  CloseIcon as RemoveItemIcon,
  SpinnerIcon,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import { fetchBuildExecuteTransaction, fetchQuotes } from "@avnu/avnu-sdk";
import { removeFromCart, updateCartAmount } from "../utils/cartUtils";
import CartIcon from "./CartIcon";
import CloseIcon from "./CloseIcon";
import SadIcon from "./SadIcon";
import { Order } from "../types";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

interface SideDrawerProps {
  handleCartClick: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ handleCartClick }) => {
  const { primaryWallet } = useDynamicContext();
  const { provider } = useProvider();
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const saveOrderToLocalStorage = (order: Order) => {
    const storageKey = `starkify-orders-${primaryWallet?.address}`;
    const existingOrders = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(
      storageKey,
      JSON.stringify([...existingOrders, order])
    );
  };

  const handleRemove = (tokenAddress: string) => {
    setCartItems((prevCart) => removeFromCart(prevCart, tokenAddress));
  };

  const handleAmountChange = (tokenAddress: string, newAmount: number) => {
    setCartItems((prevCart) =>
      updateCartAmount(prevCart, tokenAddress, newAmount)
    );
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const connector = primaryWallet?.connector as StarknetWalletConnectorType;
      const signer = await connector.getSigner();

      const quotesPromises = cartItems.map((item) =>
        fetchQuote(BigInt(item.buyAmount * 10 ** 18), ETH_ADDRESS, item.address)
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

      const buyAmountMap: any = quotes.reduce((acc, curr) => {
        return { ...acc, [curr.buyTokenAddress.slice(-63)]: curr.buyAmount };
      }, {});

      const order: Order = {
        date: new Date().toISOString(),
        tokens: cartItems.map((item) => ({
          address: item.address,
          decimals: item.decimals,
          symbol: item.symbol,
          imageUrl: item.imageUrl ?? "",
          buyAmount: buyAmountMap[item.address.slice(-63)].toString(),
          sellAmount: item.buyAmount, // TODO: change to sellAmount and sellToken for clarity
        })),
        txnHash: multicall?.transaction_hash!!,
      };

      saveOrderToLocalStorage(order);
      setCartItems([]); // Clear cart after checkout
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-slate-200 bg-opacity-50 transition-opacity" />
      )}

      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`flex flex-col fixed top-0 right-0 w-full md:w-[420px] h-full bg-white shadow-lg z-50 p-4 ease-in-out duration-500 transform ${
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

        {/* Cart items */}
        <div className="grow overflow-y-auto overflow-x-hidden">
          {/* Note */}
          <div className="px-4 py-2 bg-pink-100 text-pink-800 font-medium text-sm text-center rounded mb-2">
            Note: Amounts are denominated in ETH
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center mt-12">
              <SadIcon height="80" width="80" />
              <p className="mt-2 text-md">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item, id) => (
                <li
                  key={id}
                  className="flex items-center gap-4 p-4 bg-white rounded shadow transition hover:scale-105"
                >
                  <img
                    src={item.imageUrl ?? "https://via.placeholder.com/150"}
                    alt={item.symbol}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.symbol}</p>
                  </div>
                  <input
                    type="number"
                    value={item.buyAmount}
                    onChange={(e) =>
                      handleAmountChange(item.address, Number(e.target.value))
                    }
                    className="w-24 p-1 border rounded"
                  />
                  <button onClick={() => handleRemove(item.address)}>
                    <RemoveItemIcon className="rounded-full hover:bg-gray-100" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Checkout button */}
        {primaryWallet ? (
          <button
            className="bg-blue-500 enabled:hover:bg-blue-600 text-white mb-4 p-4 rounded flex justify-center items-center disabled:opacity-75"
            disabled={cartItems.length === 0 || isLoading}
            onClick={handleCheckout}
          >
            {isLoading ? <SpinnerIcon className="animate-spin" /> : "Checkout"}
          </button>
        ) : (
          <div>
            <DynamicConnectButton buttonClassName="bg-gray-100 w-full hover:bg-gray-200 mb-4 p-4 rounded">
              Connect Wallet
            </DynamicConnectButton>
          </div>
        )}
      </div>
    </>
  );
};

export default SideDrawer;
