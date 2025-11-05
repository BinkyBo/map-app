"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Emotion = "Happy" | "Sad" | "Calm" | "Anxious" | "Tired" | "Excited" | "Proud" | "Lonely" | "Grateful"

export interface Reply {
  id: string
  name: string
  text: string
  timestamp: number
}

export interface EmotionEntry {
  id: string
  emotion: Emotion
  text: string
  name: string
  city: string
  lat: number
  lng: number
  timestamp: number
  replies: Reply[]
}

interface EmotionContextType {
  entries: EmotionEntry[]
  addEntry: (entry: Omit<EmotionEntry, "id" | "timestamp" | "replies">) => void
  addReply: (entryId: string, reply: Omit<Reply, "id" | "timestamp">) => void
  myEntries: EmotionEntry[]
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined)

// Sample seed data
const seedData: EmotionEntry[] = [
  {
    id: "1",
    emotion: "Happy",
    text: "Just got my dream job! Feeling on top of the world.",
    name: "Sarah",
    city: "New York",
    lat: 40.7128,
    lng: -74.006,
    timestamp: Date.now() - 1000 * 60 * 30,
    replies: [],
  },
  {
    id: "2",
    emotion: "Calm",
    text: "Watching the sunset by the beach. Pure peace.",
    name: "Anonymous",
    city: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    replies: [
      {
        id: "r1",
        name: "Mike",
        text: "Sounds beautiful! Enjoy the moment.",
        timestamp: Date.now() - 1000 * 60 * 45,
      },
    ],
  },
  {
    id: "3",
    emotion: "Anxious",
    text: "Big presentation tomorrow. Heart racing but trying to stay positive.",
    name: "Alex",
    city: "London",
    lat: 51.5074,
    lng: -0.1278,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    replies: [],
  },
  {
    id: "4",
    emotion: "Grateful",
    text: "My family surprised me for my birthday. Feeling so loved.",
    name: "Maria",
    city: "Barcelona",
    lat: 41.3851,
    lng: 2.1734,
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    replies: [],
  },
  {
    id: "5",
    emotion: "Excited",
    text: "Moving to a new city next week! Adventure awaits!",
    name: "James",
    city: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    replies: [],
  },
  {
    id: "6",
    emotion: "Sad",
    text: "Missing my best friend who moved away. Distance is hard.",
    name: "Anonymous",
    city: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    timestamp: Date.now() - 1000 * 60 * 60 * 15,
    replies: [],
  },
  {
    id: "7",
    emotion: "Proud",
    text: "Finished my first marathon today! Never giving up pays off.",
    name: "Emma",
    city: "Berlin",
    lat: 52.52,
    lng: 13.405,
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    replies: [],
  },
  {
    id: "8",
    emotion: "Lonely",
    text: "New in town and finding it hard to connect. Hope it gets easier.",
    name: "Anonymous",
    city: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    replies: [],
  },
  {
    id: "9",
    emotion: "Tired",
    text: "Long week at work. Looking forward to rest and recharge.",
    name: "David",
    city: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    replies: [],
  },
  {
    id: "10",
    emotion: "Happy",
    text: "My garden is blooming! Small joys make life beautiful.",
    name: "Lisa",
    city: "Amsterdam",
    lat: 52.3676,
    lng: 4.9041,
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    replies: [],
  },
]

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<EmotionEntry[]>(seedData)
  const [myEntries, setMyEntries] = useState<EmotionEntry[]>([])

  useEffect(() => {
    // Load my entries from localStorage
    const stored = localStorage.getItem("emotion-map-my-entries")
    if (stored) {
      try {
        setMyEntries(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored entries:", e)
      }
    }
  }, [])

  const addEntry = (entry: Omit<EmotionEntry, "id" | "timestamp" | "replies">) => {
    const newEntry: EmotionEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      replies: [],
    }

    setEntries((prev) => [newEntry, ...prev])

    // Add to my entries
    const updatedMyEntries = [newEntry, ...myEntries]
    setMyEntries(updatedMyEntries)
    localStorage.setItem("emotion-map-my-entries", JSON.stringify(updatedMyEntries))
  }

  const addReply = (entryId: string, reply: Omit<Reply, "id" | "timestamp">) => {
    const newReply: Reply = {
      ...reply,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId && entry.replies.length < 3) {
          return {
            ...entry,
            replies: [...entry.replies, newReply],
          }
        }
        return entry
      }),
    )
  }

  return (
    <EmotionContext.Provider value={{ entries, addEntry, addReply, myEntries }}>{children}</EmotionContext.Provider>
  )
}

export function useEmotions() {
  const context = useContext(EmotionContext)
  if (!context) {
    throw new Error("useEmotions must be used within EmotionProvider")
  }
  return context
}
