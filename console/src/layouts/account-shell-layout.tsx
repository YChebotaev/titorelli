import { ReactNode, type FC } from "react";
import { AppLayout } from "./app-layout";
// import { Sidebar } from "@/components/accounts/sidebar";
import { AppHeader } from "@/components/site/header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-select";

export const AccountShellLayout: FC<{
  children: ReactNode;
  sidebar: ReactNode;
}> = ({ children, sidebar }) => {
  return (
    <AppLayout>
      <AppHeader />
      <SidebarProvider className="mt-16">
        {sidebar}
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator aria-orientation="vertical" className="mr-2 h-4" />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AppLayout>
  );
};
