import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    alternativeUsernames: string[];
    firstName?: string;
    alternativeFirstNames: string[];
    lastName: string;
    alternativeLastNames: string[];
    languageCode: string;
    isPremium: boolean;
    avatars: string[];
  };
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  const nextAvatar = () => {
    setCurrentAvatarIndex((prev) => (prev + 1) % user.avatars.length);
  };

  const prevAvatar = () => {
    setCurrentAvatarIndex(
      (prev) => (prev - 1 + user.avatars.length) % user.avatars.length,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatars[currentAvatarIndex]} />
            </Avatar>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-0 top-1/2 -translate-y-1/2"
              onClick={prevAvatar}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={nextAvatar}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Username:</span>
            <span className="col-span-2">{user.username}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Alt. Usernames:</span>
            <span className="col-span-2">
              {user.alternativeUsernames.join(", ")}
            </span>
          </div>
          {user.firstName && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">First Name:</span>
              <span className="col-span-2">{user.firstName}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Alt. First Names:</span>
            <span className="col-span-2">
              {user.alternativeFirstNames.join(", ")}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Last Name:</span>
            <span className="col-span-2">{user.lastName}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Alt. Last Names:</span>
            <span className="col-span-2">
              {user.alternativeLastNames.join(", ")}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Language Code:</span>
            <span className="col-span-2">{user.languageCode}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-right font-medium">Premium:</span>
            <Checkbox
              checked={user.isPremium}
              disabled
              className="col-span-2"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
