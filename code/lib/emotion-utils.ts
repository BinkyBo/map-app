import type { Emotion } from "./emotion-context"

export const emotionColors: Record<Emotion, string> = {
  Happy: "#f59e0b",
  Sad: "#3b82f6",
  Calm: "#14b8a6",
  Anxious: "#a855f7",
  Tired: "#6b7280",
  Excited: "#ec4899",
  Proud: "#10b981",
  Lonely: "#6366f1",
  Grateful: "#84cc16",
}

export const emotionIcons: Record<Emotion, string> = {
  Happy: "😊",
  Sad: "😢",
  Calm: "😌",
  Anxious: "😰",
  Tired: "😴",
  Excited: "🤩",
  Proud: "💪",
  Lonely: "🥺",
  Grateful: "🙏",
}

export function getEmotionColor(emotion: Emotion): string {
  return emotionColors[emotion]
}

export function getEmotionIcon(emotion: Emotion): string {
  return emotionIcons[emotion]
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function containsProfanity(text: string): boolean {
  const profanityList = ["badword1", "badword2"] // Simplified for MVP
  const lowerText = text.toLowerCase()
  return profanityList.some((word) => lowerText.includes(word))
}
