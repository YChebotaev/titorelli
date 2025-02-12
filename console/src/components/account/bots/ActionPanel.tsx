"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Trash2, Edit, BarChart } from "lucide-react"
import type { BotState } from "@/types/bot"
import ConfirmationModal from "./ConfirmationModal"

interface ActionPanelProps {
  botState: BotState
  onEdit: () => void
  onDelete: () => void
  onStateChange: () => void
  onViewStats: () => void
}

export default function ActionPanel({ botState, onEdit, onDelete, onStateChange, onViewStats }: ActionPanelProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const getStateChangeButton = () => {
    switch (botState) {
      case "Created":
      case "Stopped":
        return (
          <Button size="sm" onClick={onStateChange}>
            <Play className="w-4 h-4 mr-1" /> Start
          </Button>
        )
      case "Running":
        return (
          <Button size="sm" onClick={onStateChange}>
            <Square className="w-4 h-4 mr-1" /> Stop
          </Button>
        )
      case "Starting":
      case "Stopping":
        return (
          <Button size="sm" onClick={onStateChange}>
            Abort
          </Button>
        )
      case "Failed":
        return (
          <Button size="sm" onClick={onStateChange}>
            <RotateCcw className="w-4 h-4 mr-1" /> Restart
          </Button>
        )
      default:
        return null
    }
  }

  const isDeleteDisabled = !["Created", "Stopped", "Failed"].includes(botState)

  return (
    <div className="flex space-x-2">
      {getStateChangeButton()}
      <Button size="sm" variant="outline" onClick={onEdit}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleteDisabled}>
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={onViewStats}>
        <BarChart className="w-4 h-4" />
      </Button>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false)
          onDelete()
        }}
        title="Delete Bot"
        message="Are you sure you want to delete this bot? This action cannot be undone."
      />
    </div>
  )
}

