import { ReactNode, type FC } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UserNavSkeleton: FC<{ buttonWithAvatar: ReactNode }> = ({
  buttonWithAvatar,
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="!h-6 !w-6" />
      </Button>
      {buttonWithAvatar}
    </div>
  );
};
