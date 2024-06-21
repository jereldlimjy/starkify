import { atom } from "jotai";

export const cartItemsAtom = atom<
  {
    tokenAddress: string;
    symbol: string;
    imageUrl: string;
    buyAmount: number;
  }[]
>([]);
export const isDrawerOpenAtom = atom(false);
