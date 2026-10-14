// lib/products.ts
import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/cache";

export async function getProducts() {
  return getCached(
    "products:all",
    () =>
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      }),
    5 * 60 * 1000 // 5 minutes
  );
}