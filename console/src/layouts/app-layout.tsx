"use server";

import { ActiveAccountIdProvider } from "@/components/active-account-id-provider";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";
import { FlashNotificationsReceiver } from "@/components/flash-notifications";
import { getMaskedActiveAccountId } from "@/lib/server/get-active-account-id";
import { NotificationsProvider } from "@/components/flash-notifications/notifications-provider";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInPage(); // TODO: Remove
  const activeAccountId = await getMaskedActiveAccountId(user); // TODO: Remove

  const content = (
    <>
      <ActiveAccountIdProvider id={activeAccountId}>
        {children}
      </ActiveAccountIdProvider>
      {user && <FlashNotificationsReceiver userId={maskNumber(user.id)} />}
    </>
  );

  return user ? (
    <>
      <NotificationsProvider userId={maskNumber(user?.id)}>
        {content}
      </NotificationsProvider>
    </>
  ) : (
    content
  );
}
