import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type Token = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl?: string | null;
};

export async function GET(
  req: NextRequest,
  res: NextResponse<Token[] | { message: string }>
) {
  const tokens = await prisma.token.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(tokens);
}
