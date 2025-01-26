import { type ReactNode, type FC } from "react";
import { AppLayout } from "../app-layout";
import { AppHeader } from "@/components/site/header";
import { ClientSidebar } from "./client-sidebar";

export const AccountShellLayout: FC<{
  children: ReactNode;
  sidebar: ReactNode;
}> = ({ children, sidebar }) => (
  <AppLayout>
    <AppHeader />
    <ClientSidebar sidebar={sidebar}>{children}</ClientSidebar>
  </AppLayout>
);
