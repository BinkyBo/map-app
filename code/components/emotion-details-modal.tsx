"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useEmotions, type EmotionEntry } from "@/lib/emotion-context"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Clock, MessageCircle } from "lucide-react"

interface EmotionDetailsModalProps {
  entry: EmotionEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

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
  return `${days}d ago`
}

export function EmotionDetailsModal({ entry, open, onOpenChange }: EmotionDetailsModalProps) {
  const [replyName, setReplyName] = useState("")
  const [replyText, setReplyText] = useState("")
  const { addReply } = useEmotions()
  const { toast } = useToast()

  if (!entry) return null

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyText.trim()) {
      toast({
        title: "Empty reply",
        description: "Please write a message",
        variant: "destructive",
      })
      return
    }

    if (entry.replies.length >= 3) {
      toast({
        title: "Reply limit reached",
        description: "This emotion has reached the maximum number of replies",
        variant: "destructive",
      })
      return
    }

    addReply(entry.id, {
      name: replyName || "Anonymous",
      text: replyText,
    })

    toast({
      title: "Reply sent!",
      description: "Your message of support has been added",
    })

    setReplyName("")
    setReplyText("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: emotionColors[entry.emotion] }} />
            <span>{entry.emotion}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entry Details */}
          <div className="space-y-3">
            <p className="text-lg leading-relaxed">{entry.text}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{entry.name}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {entry.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimeAgo(entry.timestamp)}
              </span>
            </div>
          </div>

          {/* Replies */}
          {entry.replies.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <MessageCircle className="h-4 w-4" />
                Supportive Messages ({entry.replies.length}/3)
              </h3>
              <div className="space-y-2">
                {entry.replies.map((reply) => (
                  <Card key={reply.id} className="bg-muted/50 p-4">
                    <p className="mb-2 text-sm leading-relaxed">{reply.text}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium">{reply.name}</span>
                      <span>{formatTimeAgo(reply.timestamp)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reply Form */}
          {entry.replies.length < 3 && (
            <form onSubmit={handleReplySubmit} className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold">Send a supportive message</h3>
              <div className="space-y-2">
                <Label htmlFor="reply-name">Your name (optional)</Label>
                <Input
                  id="reply-name"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  placeholder="Anonymous"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-text">Your message</Label>
                <Textarea
                  id="reply-text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share words of encouragement..."
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Support
              </Button>
            </form>
          )}

          {entry.replies.length >= 3 && (
            <p className="text-center text-sm text-muted-foreground">
              This emotion has reached the maximum number of supportive messages
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
