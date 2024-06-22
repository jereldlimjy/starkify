import { BuyToken, Token } from "../types";

export const addToCart = (
  cart: BuyToken[],
  token: Token,
  buyAmount: number
) => {
  const existingItem = cart.find((item) => item.address === token.address);
  if (!existingItem) {
    return [...cart, { ...token, buyAmount }];
  }
  return cart;
};

export const removeFromCart = (cart: BuyToken[], tokenAddress: string) => {
  return cart.filter((item) => item.address !== tokenAddress);
};

export const updateCartAmount = (
  cart: BuyToken[],
  tokenAddress: string,
  buyAmount: number
) => {
  return cart.map((item) =>
    item.address === tokenAddress ? { ...item, buyAmount } : item
  );
};
