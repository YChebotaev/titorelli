"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBellProps {
  unreadCount: number;
}

export function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
  return (
    <>
      <Bell className="!h-6 !w-6" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="absolute -right-1 -top-1"
          >
            <Badge
              variant="destructive"
              className="flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              <motion.span
                key={unreadCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {unreadCount}
              </motion.span>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
