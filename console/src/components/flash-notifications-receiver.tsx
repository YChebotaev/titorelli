"use client";

import { useEffect, type FC } from "react";
import dynamic from "next/dynamic";
import { toast, Toaster } from "sonner";
import { useGetUserFlashNotifications } from "@/hooks/use-get-user-flash-notifications";
import { UserFlashNotificationVm } from "@/types/flash-notifications";

const receiveNotifications = async (
  userId: string,
  notifications: UserFlashNotificationVm[],
) => {
  await fetch(`/api/users/${userId}/flash-notifications/receive`, {
    method: "POST",
    body: JSON.stringify({ ids: notifications.map(({ id }) => id) }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const InternalFlashNotificationsReceiver: FC<{ userId: string }> = ({
  userId,
}) => {
  const { data } = useGetUserFlashNotifications(userId);

  useEffect(() => {
    if (!data) return;

    void receiveNotifications(userId, data);
  }, [data, userId]);

  useEffect(() => {
    if (!data) return;

    for (const { id, type, payload } of data) {
      switch (type) {
        case "default":
          if (payload.message) {
            toast(payload.message.toString(), { id });
          }
          break;
        case "description":
          if (payload.message && payload.description) {
            toast(payload.message.toString(), {
              id,
              description: payload.description.toString(),
            });
          }
          break;
        case "success":
          if (payload.message) {
            toast.success(payload.message.toString(), { id });
          }
          break;
        case "info":
          if (payload.message) {
            toast.info(payload.message.toString(), { id });
          }
          break;
        case "warning":
          if (payload.message) {
            toast.warning(payload.message.toString(), { id });
          }
          break;
        case "error":
          if (payload.message) {
            toast.error(payload.message.toString(), { id });
          }
          break;
        case "action/noop":
          break;
      }
    }
  }, [data]);

  return <Toaster />;
};

export const FlashNotificationsReceiver = dynamic(
  () => Promise.resolve(InternalFlashNotificationsReceiver),
  { ssr: false },
);
