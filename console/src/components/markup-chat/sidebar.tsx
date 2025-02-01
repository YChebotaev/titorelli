import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatList } from "./chat-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("everything")

  return (
    <div className="w-[320px] border-r flex flex-col">
      <div className="p-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="everything">Everything</TabsTrigger>
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

