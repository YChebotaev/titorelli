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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserAccounts } from "@/hooks/use-get-user-accounts";
import { HeaderUserVm } from "@/types/header";

export function UserNav({ user }: { user: HeaderUserVm }) {
  const { data: accounts, isLoading } = useGetUserAccounts(user.id);
  const [isOpen, setIsOpen] = useState(false);

  const buttonWithAvatar = (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar
        size={32}
        name={user.name}
        variant="bauhaus"
        colors={["#A7D2CB", "#F2D388", "#C98474", "#874C62", "#3C3C3C"]}
        className="!w-8 !h-8"
      />
    </Button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/project/titorelli"
          className="text-sm font-medium hover:underline"
        >
          Work Project
        </Link>
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
        Work Project
      </Link>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>{buttonWithAvatar}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Создать аккаунт</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {accounts!.map((account) => (
              <DropdownMenuItem
                key={account.id}
                className={cn("bg-accent text-accent-foreground")}
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
