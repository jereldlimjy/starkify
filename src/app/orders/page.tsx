"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAtom } from "jotai";
import { isDrawerOpenAtom } from "../atoms/atoms";
import SideDrawer from "../components/SideDrawer";
import { Order } from "../types";

const OrderHistory = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    setIsLoading(false);
  }, []);

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
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
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
                      <div>
                        <p className="text-sm">
                          Date: {new Date(order.date).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
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
                              Amount: {token.buyAmount} ETH
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
