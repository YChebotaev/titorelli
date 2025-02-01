import { MessageSquare } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Welcome to Telegram</h2>
      <p className="text-muted-foreground max-w-md">
        Select a chat to start messaging or create a new one to connect with
        friends and family.
      </p>
    </div>
  );
}
