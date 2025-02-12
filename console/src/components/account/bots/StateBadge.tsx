import type { BotState } from "@/types/bot"

interface StateBadgeProps {
  state: BotState
}

export default function StateBadge({ state }: StateBadgeProps) {
  const getColorClass = (state: BotState) => {
    switch (state) {
      case "Created":
        return "bg-blue-100 text-blue-800"
      case "Starting":
        return "bg-yellow-100 text-yellow-800"
      case "Running":
        return "bg-green-100 text-green-800"
      case "Stopping":
        return "bg-orange-100 text-orange-800"
      case "Stopped":
        return "bg-gray-100 text-gray-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClass(state)}`}>{state}</span>
}

