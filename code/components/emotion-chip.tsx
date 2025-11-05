"use client"

import type { Emotion } from "@/lib/emotion-context"
import { getEmotionColor, getEmotionIcon } from "@/lib/emotion-utils"
import { cn } from "@/lib/utils"

interface EmotionChipProps {
  emotion: Emotion
  selected?: boolean
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}

export function EmotionChip({ emotion, selected, onClick, size = "md" }: EmotionChipProps) {
  const color = getEmotionColor(emotion)
  const icon = getEmotionIcon(emotion)

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
        "border-2 hover:scale-105 active:scale-95",
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-4 py-2 text-base",
        selected ? "border-current shadow-lg" : "border-transparent bg-card hover:border-current/50",
      )}
      style={{
        color: selected ? color : undefined,
        backgroundColor: selected ? `${color}20` : undefined,
      }}
      aria-label={`${emotion} emotion`}
    >
      <span className="text-base" aria-hidden="true">
        {icon}
      </span>
      <span>{emotion}</span>
    </button>
  )
}
