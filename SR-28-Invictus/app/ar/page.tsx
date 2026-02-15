import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Glasses } from 'lucide-react'

export default function ARPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Glasses className="h-8 w-8 text-primary" />
            AR Sky Visualization
          </h1>
          <p className="text-muted-foreground">
            Augmented reality experience for identifying celestial objects in real-time
          </p>
        </div>

        {/* AR Viewer */}
        <Card className="cosmic-glow cosmic-border mb-8 border bg-gradient-to-br from-primary/20 to-accent/20 p-8 h-64 flex items-center justify-center">
          <div className="text-center">
            <Glasses className="h-16 w-16 mx-auto text-primary mb-4 opacity-50" />
            <p className="text-foreground font-medium mb-2">AR Viewer Coming Soon</p>
            <p className="text-sm text-muted-foreground mb-4">Three.js integration in development</p>
            <Button className="bg-primary hover:bg-primary/90">Enable AR Camera</Button>
          </div>
        </Card>

        {/* AR Features */}
        <div className="space-y-4">
          <FeedCard
            title="Star Identification in Real-time"
            description="Point your device at the night sky to instantly identify stars, constellations, and planets. Real-time AR overlay shows object names and details."
            category="AR Feature"
            timestamp="Coming Soon"
            likes={234}
            comments={42}
          />
          <FeedCard
            title="Constellation Visualization"
            description="See constellation lines and mythology overlaid on the night sky. Interactive exploration of 88 official constellations with detailed information."
            category="AR Feature"
            timestamp="Coming Soon"
            likes={178}
            comments={31}
          />
          <FeedCard
            title="Satellite Tracking in AR"
            description="Track the International Space Station and Starlink satellites in real-time through your device camera. Get notifications of visible passes."
            category="AR Feature"
            timestamp="Coming Soon"
            likes={312}
            comments={54}
          />
          <FeedCard
            title="Meteor Shower Prediction"
            description="AR compass overlay shows meteor shower radiant points. Real-time predictions of meteor activity and intensity during active meteor showers."
            category="AR Feature"
            timestamp="Coming Soon"
            likes={267}
            comments={48}
          />
          <FeedCard
            title="3D Planet Models"
            description="Interactive 3D models of planets, moons, and asteroids. Scale adjustments to show relative sizes and orbital positions."
            category="AR Feature"
            timestamp="Coming Soon"
            likes={145}
            comments={23}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
