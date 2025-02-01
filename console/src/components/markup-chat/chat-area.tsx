import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical } from "lucide-react";
import { ChatMessages } from "./chat-messages";
import { Button } from "@/components/ui/button";

export function ChatArea() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex-1" />
        <h2 className="font-semibold text-center flex-1">Chat Title</h2>
        <div className="flex-1 flex justify-end">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <ChatMessages />
      </ScrollArea>
    </div>
  );
}
