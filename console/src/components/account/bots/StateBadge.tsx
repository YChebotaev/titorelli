import type { BotState } from "@/types/bot";

interface StateBadgeProps {
  state: BotState;
}

const getColorClass = (state: BotState) => {
  switch (state) {
    case "created":
      return "bg-blue-100 text-blue-800";
    case "starting":
      return "bg-yellow-100 text-yellow-800";
    case "running":
      return "bg-green-100 text-green-800";
    case "stopping":
      return "bg-orange-100 text-orange-800";
    case "stopped":
      return "bg-gray-100 text-gray-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStateText = (state: BotState) => {
  switch (state) {
    case "created":
      return "Создан";
    case "starting":
      return "Запускается";
    case "running":
      return "Работает";
    case "stopping":
      return "Останавливается";
    case "stopped":
      return "Остановлен";
    case "failed":
      return "Упал";
    default:
      return "Не понятно";
  }
};

export default function StateBadge({ state }: StateBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClass(state)}`}
    >
      {getStateText(state)}
    </span>
  );
}
