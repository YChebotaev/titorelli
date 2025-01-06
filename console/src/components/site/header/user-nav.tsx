"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "boring-avatars";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserAccounts } from "@/hooks/use-get-user-accounts";
import type { HeaderUserVm } from "@/types/header";
import { useGetActiveAccount } from "@/hooks/use-get-active-account";
import { AddAccountBtn } from "@/components/my-profile/create-account-btn";
import { Notifications } from "./notifications";

import { useGetNotifications } from "./use-get-notifications";

export function UserNav({ user }: { user: HeaderUserVm }) {
  const { data: activeAccount, isLoading: activeAccountLoading } =
    useGetActiveAccount(user.id);
  const { data: accounts, isLoading: accountsLoading } = useGetUserAccounts(
    user.id,
  );
  const isLoading = activeAccountLoading || accountsLoading;
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, hasMore, markAsRead, markAllAsRead, loadMore } =
    useGetNotifications(user.id);

  const buttonWithAvatar = (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar
        size={32}
        name={user.username}
        variant="bauhaus"
        colors={["#A7D2CB", "#F2D388", "#C98474", "#874C62", "#3C3C3C"]}
        className="!w-8 !h-8"
      />
    </Button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        {activeAccount && (
          <Link
            href="/project/titorelli"
            className="text-sm font-medium hover:underline"
          >
            {activeAccount?.name}
          </Link>
        )}
        {buttonWithAvatar}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/project/titorelli"
        className="text-sm font-medium hover:underline"
      >
        {activeAccount?.name}
      </Link>
      <Notifications
        notifications={notifications}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>{buttonWithAvatar}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/my/profile">Профиль</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="px-0">
                {accounts!.length === 0
                  ? "Создать аккаунт"
                  : "Выберите аккаунт"}
              </DropdownMenuLabel>
              <AddAccountBtn
                buttonNode={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
            {accounts!.map((account) => (
              <DropdownMenuItem
                key={account.id}
                className={cn(
                  account.id === activeAccount?.id &&
                    "bg-accent text-accent-foreground",
                )}
              >
                {account.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/authorization/signout">Выйти</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
