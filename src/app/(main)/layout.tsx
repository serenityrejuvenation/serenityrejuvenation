import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import MainLayoutChrome from "@/components/MainLayoutChrome";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <MainLayoutChrome>{children}</MainLayoutChrome>
    </SessionProvider>
  );
}