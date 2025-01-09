"use server";

import { ActiveAccountIdProvider } from "@/components/active-account-id-provider";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";
import { FlashNotificationsReceiver } from "@/components/flash-notifications-receiver";
import { getMaskedActiveAccountId } from "@/lib/server/get-active-account-id";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInPage();
  const activeAccountId = await getMaskedActiveAccountId(user);

  return (
    <>
      <ActiveAccountIdProvider id={activeAccountId}>
        {children}
      </ActiveAccountIdProvider>
      {user && <FlashNotificationsReceiver userId={maskNumber(user.id)} />}
    </>
  );
}
