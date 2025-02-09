import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegenerateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerateToken: () => void;
}

export function RegenerateTokenModal({
  isOpen,
  onClose,
  onRegenerateToken,
}: RegenerateTokenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerate Token</DialogTitle>
          <DialogDescription>
            Are you sure you want to regenerate this token? The old token will
            be invalidated, but all related statistics will be preserved. You
            will be shown the new token after regeneration.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onRegenerateToken}>Regenerate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
