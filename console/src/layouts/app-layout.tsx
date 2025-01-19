"use server";

import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";
import { FlashNotificationsReceiver } from "@/components/flash-notifications";
import { NotificationsProvider } from "@/components/flash-notifications";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInPage();

  if (user) {
    return (
      <NotificationsProvider userId={maskNumber(user.id)}>
        {children}
        <FlashNotificationsReceiver userId={maskNumber(user.id)} />
      </NotificationsProvider>
    );
  }

  return children;
}
