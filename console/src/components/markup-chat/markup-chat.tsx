import { Suspense, type FC } from "react";
import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";
import { EmptyChat } from "./empty-chat";
import { FolderTypes } from "@/types/data-markup";
import { SidebarSkeleton } from "./sidebar-skeleton";

export const MarkupChat: FC<{
  activeFolder: FolderTypes;
  activeChat: string | undefined;
  onChangeFolder(activeTab: FolderTypes): void;
  onChangeChat(activeChat: string): void;
}> = ({ activeFolder, activeChat, onChangeFolder, onChangeChat }) => {
  return (
    <div className="flex" style={{ height: "calc(100svh - 64px + 65px)" }}>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar
          activeFolder={activeFolder}
          activeChat={activeChat}
          onChangeFolder={onChangeFolder}
          onChangeChat={onChangeChat}
        />
      </Suspense>

      {activeChat ? <ChatArea /> : <EmptyChat />}
    </div>
  );
};
