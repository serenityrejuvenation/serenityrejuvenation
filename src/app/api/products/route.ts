import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/cache";

export async function GET() {
  try {
    const products = await getCached(
      "products:all",
      () =>
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
        }),
      5 * 60 * 1000 // 5 minutes
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
