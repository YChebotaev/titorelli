import { cookies } from "next/headers";
import { Geist } from "next/font/google";
import { QueryClientProvider } from "@/components/query-client-provider";
import { activeAccountCookueName } from "@/constants";
import { ActiveAccountIdProvider } from "@/components/active-account-id-provider";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";
import { FlashNotificationsReceiver } from "@/components/flash-notifications-receiver";

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
  const user = await getUserInPage();
  const c = await cookies();
  const activeAccountId = user
    ? (c.get(activeAccountCookueName)?.value ?? null)
    : null;

  return (
    <html lang="ru">
      <body className={geist.className}>
        <QueryClientProvider>
          <ActiveAccountIdProvider id={activeAccountId}>
            {children}
          </ActiveAccountIdProvider>
          {user && <FlashNotificationsReceiver userId={maskNumber(user.id)} />}
        </QueryClientProvider>
      </body>
    </html>
  );
}
