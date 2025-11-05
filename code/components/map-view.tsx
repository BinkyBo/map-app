"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import { useEmotions, type EmotionEntry } from "@/lib/emotion-context"

interface MapViewProps {
  onMarkerClick: (entry: EmotionEntry) => void
  onMapClick?: (lat: number, lng: number) => void
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

export function MapView({ onMarkerClick, onMapClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])
  const popups = useRef<maplibregl.Popup[]>([])
  const { entries } = useEmotions()

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [0, 20],
      zoom: 2,
    })

    map.current.addControl(new maplibregl.NavigationControl(), "top-right")

    if (onMapClick) {
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat
        onMapClick(lat, lng)
      })
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [onMapClick])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers and popups
    markers.current.forEach((marker) => marker.remove())
    markers.current = []
    popups.current.forEach((popup) => popup.remove())
    popups.current = []

    // Add markers for each entry
    entries.forEach((entry) => {
      const el = document.createElement("div")
      el.className = "emotion-marker"
      el.style.width = "24px"
      el.style.height = "24px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = emotionColors[entry.emotion] || "#888"
      el.style.border = "3px solid rgba(255, 255, 255, 0.8)"
      el.style.cursor = "pointer"
      el.style.boxShadow = `0 0 20px ${emotionColors[entry.emotion]}80`
      el.style.transition = "all 0.3s ease"
      el.style.willChange = "box-shadow, border-width"

      const popupContent = document.createElement("div")
      popupContent.style.minWidth = "280px"
      popupContent.style.maxWidth = "320px"
      popupContent.innerHTML = `
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${emotionColors[entry.emotion]};"></div>
            <span style="font-weight: 600; font-size: 14px; color: oklch(0.95 0.01 250);">${entry.emotion}</span>
          </div>
          <p style="margin-bottom: 12px; line-height: 1.5; font-size: 14px; color: oklch(0.95 0.01 250);">${entry.text}</p>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: oklch(0.65 0.01 250); margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span><strong>${entry.name}</strong> from ${entry.city}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${formatTimeAgo(entry.timestamp)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <span>${entry.replies.length} ${entry.replies.length === 1 ? "reply" : "replies"}</span>
            </div>
          </div>
          <button 
            id="view-details-${entry.id}"
            style="
              width: 100%;
              padding: 8px 16px;
              background-color: oklch(0.75 0.15 180);
              color: oklch(0.12 0.01 250);
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: opacity 0.2s;
            "
            onmouseover="this.style.opacity='0.9'"
            onmouseout="this.style.opacity='1'"
          >
            ${entry.replies.length < 3 ? "Reply" : "View Details"}
          </button>
        </div>
      `

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: "emotion-popup",
      }).setDOMContent(popupContent)

      popups.current.push(popup)

      el.addEventListener("mouseenter", () => {
        el.style.boxShadow = `0 0 30px ${emotionColors[entry.emotion]}`
        el.style.borderWidth = "4px"
        popup.setLngLat([entry.lng, entry.lat]).addTo(map.current!)

        // Add click handler to the button after popup is added to DOM
        setTimeout(() => {
          const button = document.getElementById(`view-details-${entry.id}`)
          if (button) {
            button.onclick = () => {
              popup.remove()
              onMarkerClick(entry)
            }
          }
        }, 0)
      })

      el.addEventListener("mouseleave", () => {
        el.style.boxShadow = `0 0 20px ${emotionColors[entry.emotion]}80`
        el.style.borderWidth = "3px"
        popup.remove()
      })

      el.addEventListener("click", () => {
        popup.remove()
        onMarkerClick(entry)
      })

      const marker = new maplibregl.Marker({ element: el }).setLngLat([entry.lng, entry.lat]).addTo(map.current!)

      markers.current.push(marker)
    })
  }, [entries, onMarkerClick])

  return <div ref={mapContainer} className="h-full w-full" />
}
