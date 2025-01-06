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

const spawnJoinToAccountsToast = ({
  id,
  payload: { accountNames },
}: UserFlashNotificationVm<{ accountNames: string[] }>) => {
  const message =
    accountNames.length === 1
      ? "Вы присоединились к аккаунту"
      : "Вы присоединились к аккаунтам:";

  return toast(message, {
    id,
    description: (
      <ul>
        {accountNames.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    ),
  });
};

const spawnToast = (item: UserFlashNotificationVm) => {
  const { id, type, payload } = item;
  const message = payload.message?.toString();
  const description = payload.description?.toString();

  switch (type) {
    case "default":
      return toast(message, { id });
    case "description":
      return toast(message, { id, description });
    case "success":
      return toast.success(message, { id, description });
    case "info":
      return toast.info(message, { id, description });
    case "warning":
      return toast.warning(message, { id, description });
    case "error":
      return toast.error(message, { id, description });
    case "join-to-accounts":
      return spawnJoinToAccountsToast(item);
    default:
      return null;
  }
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

    data.forEach(spawnToast);
  }, [data]);

  return <Toaster />;
};

export const FlashNotificationsReceiver = dynamic(
  () => Promise.resolve(InternalFlashNotificationsReceiver),
  { ssr: false },
);
