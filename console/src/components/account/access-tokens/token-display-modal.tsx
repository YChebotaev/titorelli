"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TokenDisplayModalProps {
  token: string | null;
  onClose: () => void;
}

export function TokenDisplayModal({ token, onClose }: TokenDisplayModalProps) {
  if (!token) return null;

  return (
    <Dialog open={!!token} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Token Created</DialogTitle>
          <DialogDescription>
            Please copy this token and store it safely. You won't be able to see
            it again:
          </DialogDescription>
        </DialogHeader>
        <pre className="bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
          {token}
        </pre>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
