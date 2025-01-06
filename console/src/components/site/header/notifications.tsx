"use client"

import * as React from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Notification, NotificationGroup } from "@/types/notifications"
import { formatTimeAgo, groupNotifications } from "@/lib/utils"

interface NotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onLoadMore: () => Promise<void>
  hasMore: boolean
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 hover:bg-accent">
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none">
          <span className="font-medium">{notification.userName}</span>{" "}
          {notification.action}{" "}
          <span className="font-medium">{notification.target}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatTimeAgo(notification.timestamp)}
        </p>
      </div>
    </div>
  )
}

export function Notifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onLoadMore,
  hasMore
}: NotificationsProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length
  const groups = groupNotifications(notifications)

  const handleScroll = React.useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (
      isLoading || 
      !hasMore || 
      !target || 
      target.scrollTop + target.clientHeight < target.scrollHeight - 100
    ) return

    setIsLoading(true)
    await onLoadMore()
    setIsLoading(false)
  }, [isLoading, hasMore, onLoadMore])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[380px] p-0"
        align="end"
        alignOffset={-4}
        forceMount
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[440px]" onScrollCapture={handleScroll}>
          <div>
            {groups.map((group) => (
              <div key={group.label}>
                <div className="sticky top-0 z-10 bg-background px-4 py-2 text-xs font-medium text-muted-foreground">
                  {group.label}
                </div>
                {group.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

