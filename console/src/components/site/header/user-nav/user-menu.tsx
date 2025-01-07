"use client";

import { type FC, type ReactNode, useState } from "react";
import Link from "next/link";
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
import type { HeaderUserVm, UserAccountVm } from "@/types/header";
import { AddAccountBtn } from "@/components/my-profile/create-account-btn";

export const UserMenu: FC<{
  user: HeaderUserVm;
  buttonWithAvatar: ReactNode;
  activeAccount: UserAccountVm;
  accounts: UserAccountVm[];
}> = ({ user, buttonWithAvatar, activeAccount, accounts }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{buttonWithAvatar}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
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
              {accounts!.length === 0 ? "Создать аккаунт" : "Выберите аккаунт"}
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
  );
};
