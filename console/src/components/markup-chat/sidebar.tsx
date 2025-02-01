import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatList } from "./chat-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("by-chat")

  return (
    <div className="w-[320px] border-r flex flex-col">
      <div className="p-4 border-b h-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-chat">By chat</TabsTrigger>
            <TabsTrigger value="by-model">By model</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        <ChatList activeTab={activeTab} />
      </ScrollArea>
    </div>
  )
}

