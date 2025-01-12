import { ReactNode, type FC } from "react";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const typeIcons = {
  default: null,
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
} as const;

const typeStyles = {
  default: "",
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-yellow-500",
} as const;

export const BaseNotificationItem: FC<{
  id: string
  type?: "default" | "success" | "info" | "warning" | "error";
  message: string;
  description?: ReactNode;
  createdAt: string | Date;
  read?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMarkAsRead?: (id: string) => void;
}> = ({
  id,
  type = "default",
  message,
  description,
  createdAt,
  read = false,
  isFirst,
  isLast,
  onMarkAsRead,
}) => {
  const Icon = typeIcons[type];
  const formattedDate = format(createdAt, "dd.MM.yyyy HH:mm", {
    locale: ru,
  });

  return (
    <div
      className={cn(
        "group relative flex items-start px-4 py-3 hover:bg-accent",
        isFirst && "rounded-t-lg",
        isLast && "rounded-b-lg",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 h-4 w-4", typeStyles[type])}>
          {Icon ? <Icon className="h-4 w-4" /> : <div className="h-4 w-4" />}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{message}</p>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
      {!read && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="group relative h-2 w-2">
            <div className="absolute inset-0 rounded-full bg-blue-500 transition-opacity group-hover:opacity-0" />
            {onMarkAsRead && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onMarkAsRead(id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Отметить как прочитанное</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
