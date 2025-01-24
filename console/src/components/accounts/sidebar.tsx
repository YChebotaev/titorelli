"use client";

import * as React from "react";
import { Plus, Bot, Database, LayoutDashboard } from "lucide-react";

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

interface Bot {
  id: string;
  name: string;
}

const mockBots: Bot[] = [
  { id: "1", name: "Бот 1" },
  { id: "2", name: "Бот 2" },
  { id: "3", name: "Бот 3" },
];

export const Sidebar: React.FC<{
  active: "dashboard" | `bot-${string}` | "data-markup";
}> = ({ active }) => {
  const [bots, setBots] = React.useState<Bot[]>(mockBots);

  const addBot = () => {
    const newBot = { id: `${bots.length + 1}`, name: `Бот ${bots.length + 1}` };
    setBots([...bots, newBot]);
  };

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
                  <Button variant="ghost" className="w-full justify-start">
                    <Bot className="mr-2 h-4 w-4" />
                    Боты
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {bots.map((bot) => (
                <SidebarMenuItem key={bot.id}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start pl-8",
                        active === `bot-${bot.id}` &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      {bot.name}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8"
                    onClick={addBot}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить бота
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
                    <Database className="mr-2 h-4 w-4" />
                    Разметка данных
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
