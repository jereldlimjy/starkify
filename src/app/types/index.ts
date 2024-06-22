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
