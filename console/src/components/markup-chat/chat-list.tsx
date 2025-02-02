import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetDataMarkupChats } from "@/hooks/use-get-data-markup-chats";
import { DMChat, FolderTypes } from "@/types/data-markup";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export const ChatList: FC<{
  activeChat: string | undefined;
  activeFolder: FolderTypes;
  onChangeChat(activeChat: string): void;
}> = ({ activeChat, activeFolder, onChangeChat }) => {
  const { accountId } = useParams() as { accountId: string };
  const { data: chats } = useGetDataMarkupChats(activeFolder, accountId);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getChatHref = (chat: DMChat) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("chat", String(chat.id));

    return `${pathname}?${newSearchParams}`;
  };

  const renderListItem = (chat: DMChat) => (
    <Link
      key={chat.id}
      href={getChatHref(chat)}
      className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer"
      onClick={(e) => {
        e.preventDefault();

        onChangeChat(String(chat.id));
      }}
    >
      <Avatar>
        <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground">
            {chat.updatedAt}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {chat.latestExample.text || chat.latestExample.caption}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="flex flex-col">
      {chats.map((chat) => renderListItem(chat))}
    </div>
  );
};
