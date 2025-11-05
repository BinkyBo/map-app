"use client"

import { useState } from "react"
import Link from "next/link"
import { useEmotions } from "@/lib/emotion-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmotionDetailsModal } from "@/components/emotion-details-modal"
import type { EmotionEntry } from "@/lib/emotion-context"
import { Home, MapPin, Clock, MessageCircle, Map } from "lucide-react"

const emotionColors: Record<string, string> = {
  Happy: "#d4c84a",
  Sad: "#6b8dd6",
  Calm: "#5eb3c4",
  Anxious: "#9d7bc4",
  Tired: "#7a7d8a",
  Excited: "#d66b9d",
  Proud: "#8bc46b",
  Lonely: "#8a6bc4",
  Grateful: "#a4c46b",
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function MyJourneyPage() {
  const { myEntries } = useEmotions()
  const [selectedEntry, setSelectedEntry] = useState<EmotionEntry | null>(null)

  // Calculate emotion statistics
  const emotionCounts = myEntries.reduce(
    (acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostFrequentEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Home className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">My Journey</h1>
                <p className="text-sm text-muted-foreground">Your emotional timeline</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/map">
                <Map className="mr-2 h-4 w-4" />
                View Map
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {myEntries.length === 0 ? (
          // Empty State
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">No emotions shared yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Start your emotional journey by sharing how you're feeling on the map
            </p>
            <Button asChild size="lg">
              <Link href="/map">Go to Map</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground">Total Emotions</div>
                <div className="mt-2 text-3xl font-bold">{myEntries.length}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground">Most Frequent</div>
                <div className="mt-2 flex items-center gap-3">
                  {mostFrequentEmotion && (
                    <>
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: emotionColors[mostFrequentEmotion[0]] }}
                      />
                      <span className="text-2xl font-bold">{mostFrequentEmotion[0]}</span>
                    </>
                  )}
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground">Total Support</div>
                <div className="mt-2 text-3xl font-bold">
                  {myEntries.reduce((sum, entry) => sum + entry.replies.length, 0)}
                </div>
              </Card>
            </div>

            {/* Emotion Timeline */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Your Timeline</h2>
              <div className="space-y-4">
                {myEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="cursor-pointer p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="h-12 w-12 shrink-0 rounded-full"
                        style={{ backgroundColor: emotionColors[entry.emotion] }}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{entry.emotion}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.text}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {entry.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTimeAgo(entry.timestamp)}
                          </span>
                          {entry.replies.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {entry.replies.length} {entry.replies.length === 1 ? "reply" : "replies"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <EmotionDetailsModal entry={selectedEntry} open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)} />
    </div>
  )
}
