"use client";

import * as React from "react";
import { Bot, Database, LayoutDashboard, SquareAsterisk } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Sidebar: React.FC<{
  active:
    | "dashboard"
    | `bot-${string}`
    | "access-tokens"
    | "bots"
    | "models"
    | "data-markup";
  accountId: string;
}> = ({ active, accountId }) => {
  return (
    <ShadSidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      active === "dashboard" &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Панель управления
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      active === "access-tokens" &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <Link
                      className="w-full flex items-center justify-start"
                      href={`/accounts/${accountId}/access-tokens`}
                    >
                      <SquareAsterisk className="mr-2 h-4 w-4" />
                      Токены доступа
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      active === "bots" && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Link
                      className="w-full flex items-center justify-start"
                      href={`/accounts/${accountId}/bots`}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Боты
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      active === "models" && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Link
                      className="w-full flex items-center justify-start"
                      href={`/accounts/${accountId}/models`}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Модели
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      active === "data-markup" &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <Link
                      className="w-full flex items-center justify-start"
                      href={`/accounts/${accountId}/data-markup`}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Разметка данных
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadSidebar>
  );
};
