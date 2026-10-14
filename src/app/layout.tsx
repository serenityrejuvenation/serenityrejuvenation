import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";
import "./globals.css";

import LenisProvider from "@/components/LenisProvider";
import SpaLoader from "@/components/loader";

import { ProductsProvider } from "@/components/ProductsProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title:  "Serenity Rejuvenation",
  description: "Luxury hydration spa focused on restore, rebalance, and renew.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const startTime = Date.now();
  const session = await auth();
  console.log(`[Layout] Auth loaded in ${Date.now() - startTime}ms`);

  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} dark`}>
      <body className="antialiased">
      <TooltipProvider>
        <SessionProvider session={session}>
          <SpaLoader />

          <LenisProvider>
            {/* Products fetched client-side to avoid blocking page load */}
            <ProductsProvider initialProducts={[]}>
              {children}
            </ProductsProvider>
          </LenisProvider>
        </SessionProvider>
      </TooltipProvider>
      </body>
    </html>
  );
}
