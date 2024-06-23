export type Token = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl?: string | null;
  priceUsd?: string;
  volumeUsd24hr?: string;
};

export interface BuyToken extends Token {
  buyAmount: number;
}

export type Order = {
  date: string;
  tokens: {
    address: string;
    symbol: string;
    decimals: number;
    imageUrl: string;
    buyAmount: string;
    sellAmount: number;
  }[];
  txnHash: string;
};

export interface OrderDetails extends Order {
  blockNumber?: number | null;
  type?: string;
  timestamp?: number;
  status?: string;
  actualFee?: string;
}
