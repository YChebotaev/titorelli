import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ChatList: FC<{
  activeChat: string | undefined;
  onChangeChat(activeChat: string): void;
}> = ({ activeChat, onChangeChat }) => {
  const renderListItem = (i: number) => (
    <div
      key={i}
      className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer"
    >
      <Avatar>
        <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">Chat Name {i + 1}</h3>
          <span className="text-xs text-muted-foreground">12:34</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          Latest message preview...
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {Array.from({ length: 20 }).map((_, i) => renderListItem(i))}
    </div>
  );
};
