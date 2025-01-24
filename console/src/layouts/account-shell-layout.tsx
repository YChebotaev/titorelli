import { ReactNode, type FC } from "react";
import { AppLayout } from "./app-layout";
// import { Sidebar } from "@/components/accounts/sidebar";
import { AppHeader } from "@/components/site/header";

export const AccountShellLayout: FC<{
  children: ReactNode;
  sidebar: ReactNode;
}> = ({ children, sidebar }) => {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex h-screen overflow-hidden mt-16">
          {sidebar}
          <div className="flex-1 flex flex-col overflow-hidden mt-16">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
