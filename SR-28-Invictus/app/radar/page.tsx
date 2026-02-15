import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Card } from '@/components/ui/card'
import { Radar as RadarIcon, AlertCircle } from 'lucide-react'

export default function RadarPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <RadarIcon className="h-8 w-8 text-primary" />
            Live Radar
          </h1>
          <p className="text-muted-foreground">
            Real-time tracking of near-Earth objects, satellites, and space debris
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="cosmic-glow cosmic-border mb-8 border border-accent/50 bg-accent/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">3 Near-Earth Objects being tracked</p>
              <p className="text-sm text-muted-foreground">All objects safe distance from Earth - No collision risk</p>
            </div>
          </div>
        </Card>

        {/* Real-time Tracking Data */}
        <div className="space-y-4">
          <FeedCard
            title="Asteroid 2024 BX15 - Closest Approach"
            description="Closest approach distance: 2.1 million km. Velocity: 18 km/s. Size: ~500 meters. Status: Safe passage confirmed."
            category="Asteroid Tracking"
            timestamp="Real-time"
            likes={89}
            comments={12}
          />
          <FeedCard
            title="ISS Current Orbit Status"
            description="International Space Station altitude: 408 km. Orbital period: 92 minutes. Current position: Over Indian Ocean. Crew: 7 astronauts."
            category="Space Station"
            timestamp="Real-time"
            likes={156}
            comments={28}
          />
          <FeedCard
            title="SpaceX Starlink Constellation Update"
            description="4,800+ operational Starlink satellites providing global internet coverage. New launch scheduled for tomorrow. Slight increase in space debris."
            category="Satellite Network"
            timestamp="2 hours ago"
            likes={234}
            comments={42}
          />
          <FeedCard
            title="Geostationary Satellite Anomaly"
            description="Communication satellite temporarily lost signal due to solar particle event. Recovery protocol activated. Expected restoration: 3 hours."
            category="Satellite"
            timestamp="4 hours ago"
            likes={112}
            comments={19}
          />
          <FeedCard
            title="Space Debris Tracking Update"
            description="100+ pieces of tracked debris from Chinese rocket body collision in 2007. Continued monitoring to prevent collision chain reactions."
            category="Space Debris"
            timestamp="6 hours ago"
            likes={178}
            comments={31}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
