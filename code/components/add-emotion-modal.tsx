"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEmotions, type Emotion } from "@/lib/emotion-context"
import { useToast } from "@/hooks/use-toast"

interface AddEmotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCoordinates?: { lat: number; lng: number } | null
}

const emotions: Emotion[] = ["Happy", "Sad", "Calm", "Anxious", "Tired", "Excited", "Proud", "Lonely", "Grateful"]

const emotionColors: Record<Emotion, string> = {
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

export function AddEmotionModal({ open, onOpenChange, initialCoordinates }: AddEmotionModalProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addEntry } = useEmotions()
  const { toast } = useToast()

  useEffect(() => {
    if (initialCoordinates && open) {
      const { lat, lng } = initialCoordinates
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((res) => res.json())
        .then((data) => {
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Unknown location"
          setCity(cityName)
        })
        .catch(() => {
          setCity("Unknown location")
        })
    }
  }, [initialCoordinates, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEmotion || !text) {
      toast({
        title: "Missing information",
        description: "Please select an emotion and share your thoughts",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let lat: number
      let lng: number
      const finalCity = city

      if (initialCoordinates) {
        lat = initialCoordinates.lat
        lng = initialCoordinates.lng
      } else {
        if (!city) {
          toast({
            title: "Missing city",
            description: "Please enter a city name",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        // Get coordinates from city name using a geocoding API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
        )
        const data = await response.json()

        if (data.length === 0) {
          toast({
            title: "City not found",
            description: "Please enter a valid city name",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        lat = Number.parseFloat(data[0].lat)
        lng = Number.parseFloat(data[0].lon)
      }

      addEntry({
        emotion: selectedEmotion,
        text,
        name: name || "Anonymous",
        city: finalCity,
        lat,
        lng,
      })

      toast({
        title: "Emotion shared!",
        description: "Your emotion has been added to the map",
      })

      // Reset form
      setSelectedEmotion(null)
      setText("")
      setName("")
      setCity("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add emotion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share how you're feeling</DialogTitle>
          <DialogDescription>
            {initialCoordinates
              ? "Your emotion will be added at the location you clicked on the map"
              : "Your emotion will be added to the global map for others to see and support"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emotion Selection */}
          <div className="space-y-3">
            <Label>How are you feeling?</Label>
            <div className="grid grid-cols-3 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                    selectedEmotion === emotion
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: emotionColors[emotion] }} />
                  <span className="text-sm font-medium">{emotion}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <Label htmlFor="text">What's on your mind? *</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts and feelings..."
              rows={4}
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous" />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City {!initialCoordinates && "*"}</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., New York, London, Tokyo"
              required={!initialCoordinates}
              readOnly={!!initialCoordinates}
              disabled={!!initialCoordinates}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share Emotion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
