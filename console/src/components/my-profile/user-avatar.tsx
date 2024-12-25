"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserAvatar({
  initialAvatar,
}: {
  initialAvatar: string;
}) {
  const [avatar, setAvatar] = useState(initialAvatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAvatar = () => {
    setAvatar(initialAvatar);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatar} alt="User avatar" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="flex space-x-2">
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button variant="outline" size="sm" as="span">
            Upload
          </Button>
        </Label>
        <Button variant="outline" size="sm" onClick={resetAvatar}>
          Reset
        </Button>
      </div>
    </div>
  );
}
