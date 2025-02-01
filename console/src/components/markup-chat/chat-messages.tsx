import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserProfileModal } from './user-profile-modal'

export function ChatMessages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Mock user data
  const mockUser = {
    username: "johndoe",
    alternativeUsernames: ["john_d", "jdoe"],
    firstName: "John",
    alternativeFirstNames: ["Johnny", "Jon"],
    lastName: "Doe",
    alternativeLastNames: ["Doeson", "Doesmith"],
    languageCode: "en_US",
    isPremium: true,
    avatars: [
      "https://avatar.vercel.sh/1",
      "https://avatar.vercel.sh/2",
      "https://avatar.vercel.sh/3",
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => openModal(mockUser)}
          >
            <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span
                className="font-semibold cursor-pointer"
                onClick={() => openModal(mockUser)}
              >
                User {i + 1}
              </span>
              <span className="text-xs text-muted-foreground">12:34</span>
            </div>
            <p className="text-sm mb-2">
              This is a sample message in the chat. It can be quite long and
              will wrap to multiple lines if needed.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                Mark as spam
              </Button>
              <Button variant="default" size="sm">
                Not a spam
              </Button>
            </div>
          </div>
        </div>
      ))}
      {selectedUser && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}
