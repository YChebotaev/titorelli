import { Suspense, type FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatList } from "./chat-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FolderTypes } from "@/types/data-markup";
import { ChatListSkeleton } from "./chat-list-skeleton";
import { useGetDataMarkupChats } from "@/hooks/use-get-data-markup-chats";
import { useParams } from "next/navigation";
import { ChatListEmpty } from "./chat-list-empty";

export const Sidebar: FC<{
  activeFolder: FolderTypes;
  activeChat: string | undefined;
  onChangeFolder(activeTab: FolderTypes): void;
  onChangeChat(activeChat: string): void;
}> = ({ activeFolder, activeChat, onChangeFolder, onChangeChat }) => {
  const { accountId } = useParams() as { accountId: string };
  const { data: chats } = useGetDataMarkupChats(activeFolder, accountId);

  return (
    <div className="w-[320px] border-r flex flex-col">
      <div className="p-4 border-b h-16">
        <Tabs
          value={activeFolder}
          onValueChange={(activeFolder) =>
            onChangeFolder(activeFolder as FolderTypes)
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-chat">By chat</TabsTrigger>
            <TabsTrigger value="by-model">By model</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Suspense fallback={<ChatListSkeleton />}>
        {chats.length === 0 ? (
          <ChatListEmpty />
        ) : (
          <ScrollArea className="flex-1">
            <ChatList
              activeFolder={activeFolder}
              activeChat={activeChat}
              onChangeChat={onChangeChat}
            />
          </ScrollArea>
        )}
      </Suspense>
    </div>
  );
};
