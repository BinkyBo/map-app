import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { EmotionProvider } from "@/lib/emotion-context"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Emotion Map - Share how you feel",
  description: "A global map where you can share your emotions and support others",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <EmotionProvider>
          {children}
          <Toaster />
        </EmotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
