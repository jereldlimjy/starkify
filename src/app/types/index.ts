export type Token = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl?: string | null;
};

export interface BuyToken extends Token {
  buyAmount: number;
}

export type Order = {
  date: string;
  tokens: {
    address: string;
    symbol: string;
    imageUrl: string;
    buyAmount: number;
  }[];
  txnHash: string;
};
