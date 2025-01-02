import { QueryClientProvider } from "@/components/query-client-provider";
import { Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { activeAccountCookueName } from "@/constants";
import { ActiveAccountIdProvider } from "@/components/active-account-id-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Titorelli - Manage Classification Models for Telegram Bots",
  description:
    "Titorelli platform helps you manage classification models for Telegram bots, providing advanced spam protection features.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const activeAccountId = c.get(activeAccountCookueName)?.value ?? null;

  return (
    <html lang="en">
      <body className={geist.className}>
        <QueryClientProvider>
          <ActiveAccountIdProvider id={activeAccountId}>
            {children}
          </ActiveAccountIdProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
