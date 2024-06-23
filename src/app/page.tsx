"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAtom } from "jotai";
import { cartItemsAtom, isDrawerOpenAtom } from "./atoms/atoms";
import SideDrawer from "./components/SideDrawer";
import { addToCart } from "./utils/cartUtils";
import { Token } from "./types";
import CartIcon from "./components/CartIcon";
import { formatCurrency } from "@coingecko/cryptoformat";

const getTokens = async () => {
  try {
    const response = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tokens"
        : "https://starkify.vercel.app/api/tokens",
      { next: { revalidate: 60 } }
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
  const [_, setCartItems] = useAtom(cartItemsAtom);
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
      <div className="pt-[72px] w-full">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex relative gap-4 p-4 bg-white bg-opacity-60 rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={token.imageUrl ?? "https://via.placeholder.com/150"}
                  alt={token.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-md font-semibold mr-12">{token.name}</p>
                  <p className="text-gray-500">{token.symbol}</p>
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Price: </span>
                    {token?.priceUsd
                      ? formatCurrency(parseFloat(token.priceUsd), "USD", "en")
                      : "-"}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <span className="font-medium">Volume (24h): </span>
                    {token?.volumeUsd24hr
                      ? formatCurrency(
                          parseFloat(token.volumeUsd24hr),
                          "USD",
                          "en"
                        )
                      : "-"}
                  </p>
                </div>

                <button
                  className="absolute top-2 right-2"
                  onClick={() => handleAddToCart(token)}
                  aria-label="Add to cart"
                >
                  <CartIcon height="30" width="30" />
                </button>
              </div>
            ))}

            {!!tokens.length && (
              <>
                <div></div>
                <p className="flex items-center space-x-2 justify-end">
                  <span className="text-sm text-gray-500">
                    Token data provided by
                  </span>
                  <a href="https://www.geckoterminal.com" target="_blank">
                    <img
                      src="/gecko-terminal-logo.webp"
                      alt="Gecko Terminal logo"
                      className="h-6"
                    />
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <SideDrawer handleCartClick={handleCartClick} />
    </main>
  );
}
