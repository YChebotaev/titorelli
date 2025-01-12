"use client";

import { useGetUnreadNotificationsCount } from "@/hooks/use-get-unread-notifications-count";
import { createContext, ReactNode, useMemo, type FC } from "react";

export type FlashNotificationsContextProps = {
  unreadCount: number;
};

export const context = createContext<FlashNotificationsContextProps | null>(
  null,
);

export const NotificationsProvider: FC<{
  userId: string;
  children: ReactNode;
}> = ({ userId, children }) => {
  const { data } = useGetUnreadNotificationsCount(userId);
  const unreadCount = data?.unreadCount ?? 0;
  const value = useMemo(() => ({ unreadCount }), [unreadCount]);

  return <context.Provider value={value}>{children}</context.Provider>;
};
