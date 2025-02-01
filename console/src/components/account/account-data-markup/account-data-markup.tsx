"use client";

import { type FC } from "react";
import { FolderTypes, MarkupChat } from "@/components/markup-chat/markup-chat";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const AccountDataMarkup: FC<{
  activeChat: string | undefined;
  activeFolder: FolderTypes;
}> = ({ activeChat, activeFolder }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <MarkupChat
        activeChat={activeChat}
        activeFolder={activeFolder}
        onChangeChat={(chatId) => {
          const newSearchParams = new URLSearchParams(searchParams);

          newSearchParams.set("chat", chatId);

          router.replace(`${pathname}?${newSearchParams}`);
        }}
        onChangeFolder={(folderId) => {
          const newSearchParams = new URLSearchParams(searchParams);

          newSearchParams.set("folder", folderId);

          router.replace(`${pathname}?${newSearchParams}`);
        }}
      />
    </div>
  );
};
