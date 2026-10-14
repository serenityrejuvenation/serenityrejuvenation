"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Product = {
  id: string;
  title: string;
  price?: string | null;
  description: string;
  image: string;
  benefits: string[];
};

type ProductsContextType = {
  products: Product[];
  isLoading: boolean;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({
  children,
  initialProducts = [],
}: {
  children: React.ReactNode;
  initialProducts?: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products on mount if not provided
  useEffect(() => {
    if (initialProducts.length === 0) {
      setIsLoading(true);
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [initialProducts.length]);

  return (
    <ProductsContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx.products;
}

export function useProductsLoading() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsLoading must be used inside ProductsProvider");
  return ctx.isLoading;
}