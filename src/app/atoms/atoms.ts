import { atom } from "jotai";
import { BuyToken } from "../types";

export const cartItemsAtom = atom<BuyToken[]>([]);
export const isDrawerOpenAtom = atom(false);
