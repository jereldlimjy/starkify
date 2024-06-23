import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Token } from "@/app/types";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  res: NextResponse<Token[] | { message: string }>
) {
  const tokens = await prisma.token.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch price data from gecko terminal
  const GECKO_TERMINAL_ENDPOINT =
    "https://api.geckoterminal.com/api/v2/networks/starknet-alpha/tokens/multi";
  const addresses = tokens.map((token: Token) =>
    token.address.length === 66
      ? `0x${token.address.slice(-63)}`
      : token.address
  );

  const response = await fetch(
    `${GECKO_TERMINAL_ENDPOINT}/${addresses.join(",")}`
  );
  const data = (await response.json()).data;

  const geckoTerminalDataMap = data.reduce((acc: any, curr: any) => {
    const attributes = curr.attributes;
    return {
      ...acc,
      [attributes.address.slice(-63)]: {
        priceUsd: attributes.price_usd,
        volumeUsd24hr: attributes.volume_usd.h24,
      },
    };
  }, {});

  tokens.forEach((token: Token) => {
    const tokenData = geckoTerminalDataMap[token.address.slice(-63)];

    if (tokenData) {
      token.priceUsd = tokenData.priceUsd;
      token.volumeUsd24hr = tokenData.volumeUsd24hr;
    }
  });

  return Response.json(tokens);
}
