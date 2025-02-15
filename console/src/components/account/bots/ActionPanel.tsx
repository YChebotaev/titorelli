"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Trash2, Edit, BarChart } from "lucide-react";
import type { BotState } from "@/types/bot";
import ConfirmationModal from "./ConfirmationModal";

interface ActionPanelProps {
  botState: BotState;
  onEdit: () => void;
  onDelete: () => void;
  onStateChange: (state: BotState) => void;
  onViewStats: () => void;
}

export default function ActionPanel({
  botState,
  onEdit,
  onDelete,
  onStateChange,
  onViewStats,
}: ActionPanelProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const createChangeStateHandler = (state: BotState) => () =>
    onStateChange(state);

  const getStateChangeButton = () => {
    switch (botState) {
      case "created":
      case "stopped":
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <Play className="w-4 h-4 mr-1" /> Запустить
          </Button>
        );
      case "running":
        return (
          <Button size="sm" onClick={createChangeStateHandler("stopped")}>
            <Square className="w-4 h-4 mr-1" /> Остановить
          </Button>
        );
      case "starting":
      case "stopping":
        return (
          <Button size="sm" onClick={createChangeStateHandler("stopped")}>
            Отменить
          </Button>
        );
      case "failed":
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Перезагрузить
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Сделать что-нибудь
          </Button>
        );
    }
  };

  const isDeleteDisabled = !["created", "stopped", "failed"].includes(botState);

  return (
    <div className="flex space-x-2">
      {getStateChangeButton()}
      <Button size="sm" variant="outline" onClick={onEdit}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isDeleteDisabled}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={onViewStats}>
        <BarChart className="w-4 h-4" />
      </Button>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDelete();
        }}
        title="Delete Bot"
        message="Are you sure you want to delete this bot? This action cannot be undone."
      />
    </div>
  );
}
