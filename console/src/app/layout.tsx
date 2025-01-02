import { QueryClientProvider } from "@/components/query-client-providet";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Titorelli - Manage Classification Models for Telegram Bots",
  description:
    "Titorelli platform helps you manage classification models for Telegram bots, providing advanced spam protection features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
