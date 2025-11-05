"use client"

import { useState } from "react"
import { MapView } from "@/components/map-view"
import { AddEmotionModal } from "@/components/add-emotion-modal"
import { EmotionDetailsModal } from "@/components/emotion-details-modal"
import { Button } from "@/components/ui/button"
import { Plus, Home } from "lucide-react"
import Link from "next/link"
import type { EmotionEntry } from "@/lib/emotion-context"

export default function MapPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<EmotionEntry | null>(null)
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handleMapClick = (lat: number, lng: number) => {
    setClickedCoordinates({ lat, lng })
    setIsAddModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setIsAddModalOpen(open)
    if (!open) {
      setClickedCoordinates(null)
    }
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Emotion Map</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/my-journey">My Journey</Link>
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Emotion
            </Button>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapView onMarkerClick={setSelectedEntry} onMapClick={handleMapClick} />

      {/* Modals */}
      <AddEmotionModal open={isAddModalOpen} onOpenChange={handleModalClose} initialCoordinates={clickedCoordinates} />
      <EmotionDetailsModal entry={selectedEntry} open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)} />
    </div>
  )
}
