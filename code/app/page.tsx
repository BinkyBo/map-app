import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MapPin, MessageCircle, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Share your emotions with the world</span>
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              How are you feeling{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">right now?</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              A global map where you can share your emotions, connect with others, and find support. Every feeling
              matters, and you're never alone.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/map">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore the Map
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/my-journey">View My Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Why share your emotions?</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Connect with a global community that understands what you're going through
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Express Yourself</h3>
            <p className="text-pretty text-muted-foreground">
              Share how you're feeling in a safe, anonymous space. Your emotions are valid and deserve to be heard.
            </p>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">See the World</h3>
            <p className="text-pretty text-muted-foreground">
              Explore emotions from around the globe. Discover that people everywhere share similar feelings and
              experiences.
            </p>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Find Support</h3>
            <p className="text-pretty text-muted-foreground">
              Receive kind words from others who understand. Send encouragement to those who need it most.
            </p>
          </Card>
        </div>
      </section>

      {/* Emotions Grid */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">All emotions are welcome</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Whether you're on top of the world or going through a tough time
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 md:grid-cols-3 lg:gap-6">
            {[
              { name: "Happy", color: "emotion-happy" },
              { name: "Sad", color: "emotion-sad" },
              { name: "Calm", color: "emotion-calm" },
              { name: "Anxious", color: "emotion-anxious" },
              { name: "Tired", color: "emotion-tired" },
              { name: "Excited", color: "emotion-excited" },
              { name: "Proud", color: "emotion-proud" },
              { name: "Lonely", color: "emotion-lonely" },
              { name: "Grateful", color: "emotion-grateful" },
            ].map((emotion) => (
              <div
                key={emotion.name}
                className="flex items-center justify-center rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50"
              >
                <div className="text-center">
                  <div
                    className={`mx-auto mb-2 h-8 w-8 rounded-full`}
                    style={{ backgroundColor: `var(--${emotion.color})` }}
                  />
                  <p className="font-medium">{emotion.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Ready to share your story?</h2>
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Join thousands of people around the world expressing their emotions and supporting each other
          </p>
          <Button asChild size="lg">
            <Link href="/map">
              <MapPin className="mr-2 h-5 w-5" />
              Start Exploring
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made with care for emotional wellbeing</p>
        </div>
      </footer>
    </div>
  )
}
