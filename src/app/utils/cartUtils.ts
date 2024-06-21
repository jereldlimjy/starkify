export const addToCart = (
  cart: {
    tokenAddress: string;
    symbol: string;
    imageUrl: string;
    buyAmount: number;
  }[],
  tokenAddress: string,
  symbol: string,
  imageUrl: string,
  buyAmount: number
) => {
  const existingItem = cart.find((item) => item.tokenAddress === tokenAddress);
  if (!existingItem) {
    return [...cart, { tokenAddress, symbol, imageUrl, buyAmount }];
  }
  return cart;
};

export const removeFromCart = (
  cart: {
    tokenAddress: string;
    symbol: string;
    imageUrl: string;
    buyAmount: number;
  }[],
  tokenAddress: string
) => {
  return cart.filter((item) => item.tokenAddress !== tokenAddress);
};

export const updateCartAmount = (
  cart: {
    tokenAddress: string;
    symbol: string;
    imageUrl: string;
    buyAmount: number;
  }[],
  tokenAddress: string,
  buyAmount: number
) => {
  return cart.map((item) =>
    item.tokenAddress === tokenAddress ? { ...item, buyAmount } : item
  );
};
