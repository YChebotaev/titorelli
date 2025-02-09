import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RevokeTokenModalProps {
  isOpen: boolean
  onClose: () => void
  onRevokeToken: () => void
}

export function RevokeTokenModal({ isOpen, onClose, onRevokeToken }: RevokeTokenModalProps) {
  const handleRevokeToken = () => {
    onRevokeToken()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke Token</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this token? This action cannot be undone, and all related data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRevokeToken}>
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

