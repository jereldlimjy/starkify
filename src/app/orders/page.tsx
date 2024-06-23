"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAtom } from "jotai";
import { isDrawerOpenAtom } from "../atoms/atoms";
import SideDrawer from "../components/SideDrawer";
import { OrderDetails } from "../types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";

const OrderHistory = () => {
  const { primaryWallet } = useDynamicContext();
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!primaryWallet) {
      setIsLoading(false);
      return;
    }

    const fetchTransactionData = async (hash: string) => {
      const response = await fetch(
        `https://api.voyager.online/beta/txns/${hash}`,
        {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_VOYAGER_API_KEY ?? "",
          },
        }
      );

      if (!response.ok) {
        return {};
      }

      const data = await response.json();

      return {
        blockNumber: data.blockNumber,
        type: data.type,
        timestamp: data.timestamp,
        status: data.status,
        actualFee: data.actualFee,
      };
    };

    const loadOrders = async () => {
      const storageKey = `starkify-orders-${primaryWallet.address}`;
      const savedOrders = JSON.parse(localStorage.getItem(storageKey) || "[]");

      try {
        const ordersWithTxnData = await Promise.all(
          savedOrders.map(async (order: OrderDetails) => {
            const txnData = await fetchTransactionData(order.txnHash);
            return { ...order, ...txnData };
          })
        );
        setOrders(ordersWithTxnData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [primaryWallet]);

  const handleCartClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <main>
      <Navbar handleCartClick={handleCartClick} />
      <div className="pt-[72px] w-full h-full">
        <div className="container mx-auto p-6">
          <h2 className="text-2xl underline mb-6 text-center">Order History</h2>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-center">No orders yet.</p>
          ) : (
            <ul className="space-y-6 flex flex-col items-center justify-center">
              {orders
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((order, index) => (
                  <li
                    key={index}
                    className="p-6 bg-white bg-opacity-85 rounded-lg shadow-md w-full max-w-screen-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <p className="text-sm">
                          Date: {new Date(order.date).toLocaleString()}
                        </p>
                        <p className="text-sm">
                          Transaction Hash:{" "}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://voyager.online/tx/${order.txnHash}`}
                            className="text-blue-600 hover:underline"
                          >
                            {order.txnHash}
                          </a>
                        </p>
                        <p className="flex items-center text-sm">
                          Type:
                          <div className="ml-2 bg-green-100 rounded border border-green-800 px-1 text-green-700 font-medium">
                            {order?.type ?? "-"}
                          </div>
                        </p>
                        <p className="text-sm">
                          Block Number: {order?.blockNumber ?? "-"}
                        </p>
                        <p className="text-sm">
                          Block Timestamp: {order?.timestamp ?? "-"}
                        </p>
                        <p className="flex items-center text-sm">
                          Status:{" "}
                          <div className="ml-2 bg-green-600 px-1.5 py-0.5 text-white rounded-[42px]">
                            {order?.status ?? "-"}
                          </div>
                        </p>
                        <p className="text-sm">
                          Actual Fee:{" "}
                          {parseFloat(order?.actualFee ?? "0") / 1e18 ?? "-"}{" "}
                          ETH
                        </p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-4">
                      {order.tokens.map((token, tokenIndex) => (
                        <li
                          key={tokenIndex}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={
                              token?.imageUrl ??
                              "https://via.placeholder.com/150"
                            }
                            alt={token.symbol}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-sm text-gray-600">
                              Amount Bought:{" "}
                              {ethers.formatUnits(
                                token.buyAmount ?? "0",
                                token.decimals
                              )}{" "}
                              {token.symbol}
                            </p>
                            <p className="text-sm text-gray-600">
                              Amount Spent: {token.sellAmount} ETH
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <SideDrawer handleCartClick={handleCartClick} />
    </main>
  );
};

export default OrderHistory;
