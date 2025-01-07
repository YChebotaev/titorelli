import Avatar from "boring-avatars";
import { Button } from "@/components/ui/button";
import type { HeaderUserVm } from "@/types/header";

export const renderAvatar = ({ user }: { user: HeaderUserVm }) => (
  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
    <Avatar
      size={32}
      name={user.username}
      variant="bauhaus"
      colors={["#A7D2CB", "#F2D388", "#C98474", "#874C62", "#3C3C3C"]}
      className="!w-8 !h-8"
    />
  </Button>
);
