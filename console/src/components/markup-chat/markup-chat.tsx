import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";

export function MarkupChat() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
