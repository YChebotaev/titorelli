"use client";

import { useGetUserAccounts } from "@/hooks/use-get-user-accounts";
import { useGetActiveAccount } from "@/hooks/use-get-active-account";
import type { HeaderUserVm } from "@/types/header";
import { HeaderNotificationsCenter } from "./header-notification-center";
import { UserMenu } from "./user-menu";
import { renderAvatar } from "./render-avatar";

export function UserNav({ user }: { user: HeaderUserVm }) {
  const { data: activeAccount } = useGetActiveAccount(user.id);
  const { data: accounts } = useGetUserAccounts(user.id);

  return (
    <div className="flex items-center gap-4">
      <HeaderNotificationsCenter userId={user.id} />
      <UserMenu
        user={user}
        buttonWithAvatar={renderAvatar({ user })}
        activeAccount={activeAccount!}
        accounts={accounts!}
      />
    </div>
  );
}
