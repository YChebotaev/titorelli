"use client";

import { useEffect, type FC } from "react";
import dynamic from "next/dynamic";
import { toast, Toaster } from "sonner";
import { last, map } from "lodash";
import { useGetUserFlashNotifications } from "@/hooks/use-get-user-flash-notifications";
import type {
  UserNotificationVm,
  JoinToAccountsPayload,
  GenericToasPayload,
} from "@/types/user-notification";
import { useQueryClient } from "@tanstack/react-query";

const receiveNotifications = async (
  userId: string,
  notifications: UserNotificationVm[],
) => {
  await fetch(`/api/users/${userId}/notifications/flash/receive`, {
    method: "POST",
    body: JSON.stringify({ ids: notifications.map(({ id }) => id) }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const spawnJoinToAccountsToast = ({
  id,
  payload: { accounts },
}: UserNotificationVm<JoinToAccountsPayload>) => {
  const message =
    accounts.length === 1
      ? "Вы присоединились к аккаунту"
      : "Вы присоединились к аккаунтам:";

  return toast(message, {
    id,
    description: (
      <ul>
        {accounts.map(({ name }, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    ),
  });
};

const spawnGenericToast = (
  id: string,
  { type, message, description }: GenericToasPayload,
) => {
  switch (type) {
    case "default":
      return toast(message, { id, description });
    case "success":
      return toast.success(message, { id, description });
    case "info":
      return toast.info(message, { id, description });
    case "warning":
      return toast.warning(message, { id, description });
    case "error":
      return toast.error(message, { id, description });
    default:
      return void null; // Do nothing
  }
};

const spawnToast = (item: UserNotificationVm) => {
  const { id, type, payload } = item;

  switch (type) {
    case "generic-toast":
      return spawnGenericToast(id, payload as GenericToasPayload);
    case "join-to-accounts":
      return spawnJoinToAccountsToast(
        item as UserNotificationVm<JoinToAccountsPayload>,
      );
    default:
      return void null; // Do nothing
  }
};

const InternalFlashNotificationsReceiver: FC<{ userId: string }> = ({
  userId,
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserFlashNotifications(userId);

  useEffect(() => {
    if (!data) return;

    data.forEach(spawnToast);
  }, [data]);

  const lastId = last(map(data, 'id') ?? [])
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["users", userId, "notifications", "unread-count"],
    });
  }, [queryClient, userId, lastId]);

  useEffect(() => {
    if (!data) return;

    void receiveNotifications(userId, data);
  }, [data, userId]);

  return <Toaster />;
};

export const FlashNotificationsReceiver = dynamic(
  () => Promise.resolve(InternalFlashNotificationsReceiver),
  { ssr: false },
);
