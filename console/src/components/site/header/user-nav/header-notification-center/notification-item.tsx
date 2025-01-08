import type {
  GenericToasPayload,
  HeaderNotificationVm,
  JoinToAccountsPayload,
} from "@/types/user-notification";
import { BaseNotificationItem } from "./base-notification-item";

interface NotificationItemProps {
  notification: HeaderNotificationVm;
  onMarkAsRead?: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const NotificationItem = ({
  notification,
  isFirst,
  isLast,
  onMarkAsRead,
}: NotificationItemProps) => {
  switch (notification.type) {
    case "generic-toast":
      const { type, message, description } =
        notification.payload as GenericToasPayload;

      return (
        <BaseNotificationItem
          id={notification.id}
          type={type}
          message={message}
          description={description}
          createdAt={notification.createdAt}
          read={notification.read}
          isFirst={isFirst}
          isLast={isLast}
          onMarkAsRead={onMarkAsRead}
        />
      );
    case "join-to-accounts":
      const { accounts } = notification.payload as JoinToAccountsPayload;

      return (
        <BaseNotificationItem
          id={notification.id}
          type="default"
          message={
            accounts.length === 1
              ? "Вы присоединились к аккаунту"
              : "Вы присоединились к аккаунтам:"
          }
          description={
            <ul>
              {accounts.map(({ name }, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          }
          createdAt={notification.createdAt}
          read={notification.read}
          isFirst={isFirst}
          isLast={isLast}
          onMarkAsRead={onMarkAsRead}
        />
      );
    default:
      return null;
  }
};
