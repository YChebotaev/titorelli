import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";

export function MarkupChat() {
  return (
    <div className="flex" style={{ height: "calc(100svh - 64px + 65px)" }}>
      <Sidebar />
      <ChatArea />
    </div>
  );
}
