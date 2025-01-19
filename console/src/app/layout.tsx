import { Suspense } from "react";
import { Geist } from "next/font/google";

import { QueryClientProvider } from "@/components/query-client-provider";
import { MetrikaScript } from "@/components/metrika-script";

import "./globals.css";

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
  return (
    <html lang="ru">
      <body className={geist.className}>
        <QueryClientProvider>{children}</QueryClientProvider>
        {process.env.NODE_ENV === "production" && (
          <Suspense>
            <MetrikaScript />
          </Suspense>
        )}
      </body>
    </html>
  );
}
