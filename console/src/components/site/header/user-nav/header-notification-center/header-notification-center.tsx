"use client";

import {
  useState,
  useCallback,
  type FC,
  type UIEvent,
  useContext,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { groupNotifications } from "@/lib/utils";
import { useGetNotifications } from "@/hooks/use-get-notifications";
import { NotificationItem } from "./notification-item";
import { NotificationBell } from "./notification-bell";
import { context as notificationProviderContext } from "@/components/flash-notifications";

export const HeaderNotificationsCenter: FC<{ userId: string }> = ({
  userId,
}) => {
  const {
    notifications,
    hasMore,
    isLoading,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useGetNotifications(userId);
  const [open, setOpen] = useState(false);
  const { unreadCount } = useContext(notificationProviderContext)!;
  const groups = groupNotifications(notifications);

  const handleScroll = useCallback(
    async (e: UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (
        isLoading ||
        !hasMore ||
        !target ||
        target.scrollTop + target.clientHeight < target.scrollHeight - 100
      )
        return;

      void loadMore();
    },
    [isLoading, hasMore, loadMore],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <NotificationBell unreadCount={unreadCount} />
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
                {group.notifications.map((notification, i, list) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isFirst={i === 0}
                    isLast={i === list.length - 1}
                    onMarkAsRead={markAsRead}
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
        {!isLoading && notifications.length > 0 && (
          <Button
            variant="ghost"
            className="mt-4 w-full justify-center"
            onClick={markAllAsRead}
          >
            Отметить все прочитанным
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
