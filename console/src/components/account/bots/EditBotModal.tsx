"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { BotVm } from "@/types/bot"

interface EditBotModalProps {
  isOpen: boolean
  onClose: () => void
  bot: BotVm
}

export default function EditBotModal({ isOpen, onClose, bot }: EditBotModalProps) {
  const [name, setName] = useState(bot.name)
  const [description, setDescription] = useState(bot.description)
  const [telemetryEnabled, setTelemetryEnabled] = useState(bot.bypassTelemetry)

  useEffect(() => {
    setName(bot.name)
    setDescription(bot.description)
    setTelemetryEnabled(bot.bypassTelemetry)
  }, [bot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ name, description, telemetryEnabled })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Bot Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="telemetry"
              checked={!telemetryEnabled}
              onCheckedChange={(checked) => setTelemetryEnabled(!checked)}
            />
            <Label htmlFor="telemetry">Do not send telemetry</Label>
          </div>
          <div>
            <Label>Model</Label>
            <Input value={bot.model} disabled />
          </div>
          <div>
            <Label>Access Token</Label>
            <Input value={bot.accessToken} disabled />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

