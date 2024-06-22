"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAtom } from "jotai";
import { cartItemsAtom, isDrawerOpenAtom } from "./atoms/atoms";
import SideDrawer from "./components/SideDrawer";
import { addToCart } from "./utils/cartUtils";
import { Token } from "./types";

const getTokens = async () => {
  try {
    const response = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tokens"
        : "https://starkify.vercel.app/api/tokens"
    );
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
  const [tokens, setTokens] = useState<Token[]>([]);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTokens();
      setTokens(res);
    };

    fetchData();
  }, []);

  const handleCartClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleAddToCart = (token: Token) => {
    setCartItems((prevCart) => addToCart(prevCart, token, 1));
  };

  return (
    <main>
      <Navbar handleCartClick={handleCartClick} />
      <div className="absolute top-[72px] w-full bg-no-repeat bg-cover bg-center">
        <div className="flex justify-center">
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
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    onClick={() => handleAddToCart(token)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SideDrawer handleCartClick={handleCartClick} />
    </main>
  );
}
