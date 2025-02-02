import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <MessageSquarePlus className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Chats Yet</h2>
      <p className="text-muted-foreground mb-4">
        Start a new conversation or join a group to begin chatting.
      </p>
      <Button>New Chat</Button>
    </div>
  );
}
