"use client";

import {
  ContentActionsContainer,
  ContentActionsContext,
} from "@/components/account/content-actions";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-select";
import { useRef, type FC, type ReactNode } from "react";

export const ClientSidebar: FC<{ sidebar: ReactNode; children: ReactNode }> = ({
  sidebar,
  children,
}) => {
  const contentActionsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <SidebarProvider className="mt-16">
      {sidebar}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator aria-orientation="vertical" className="mr-2 h-4" />
          <ContentActionsContainer ref={contentActionsContainerRef} />
        </header>
        <ContentActionsContext
          value={{ containerRef: contentActionsContainerRef }}
        >
          {children}
        </ContentActionsContext>
      </SidebarInset>
    </SidebarProvider>
  );
};
