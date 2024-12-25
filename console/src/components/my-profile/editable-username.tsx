"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditableUsername({
  initialUsername,
}: {
  initialUsername: string;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const checkAvailability = async () => {
      // Simulating an API call to check username availability
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();
      setIsAvailable(data.available);
    };

    if (isEditing && username !== initialUsername) {
      checkAvailability();
    }
  }, [username, initialUsername, isEditing]);

  const handleSave = () => {
    // Here you would typically save the new username to your backend
    setIsEditing(false);
  };

  return (
    <div className="">
      <Label htmlFor="username">Username</Label>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={isAvailable ? "border-green-500" : "border-red-500"}
            />
            <Button onClick={handleSave} disabled={!isAvailable}>
              Save
            </Button>
          </>
        ) : (
          <>
            <span>{username}</span>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </>
        )}
      </div>
      {isEditing && !isAvailable && (
        <p className="text-sm text-red-500">This username is not available</p>
      )}
    </div>
  );
}
