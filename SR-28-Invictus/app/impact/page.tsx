import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Card } from '@/components/ui/card'
import { Zap, Leaf, Users } from 'lucide-react'

export default function ImpactPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Cosmic Impact
          </h1>
          <p className="text-muted-foreground">
            Explore how space phenomena affect climate, agriculture, and life on Earth
          </p>
        </div>

        {/* Impact Categories */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="cosmic-glow cosmic-border border bg-gradient-to-br from-primary/20 to-accent/20 p-4">
            <Zap className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-foreground">Climate</h3>
            <p className="text-xs text-muted-foreground">Solar cycles & weather patterns</p>
          </Card>
          <Card className="cosmic-glow cosmic-border border bg-gradient-to-br from-secondary/20 to-primary/20 p-4">
            <Leaf className="h-6 w-6 text-secondary mb-2" />
            <h3 className="font-semibold text-foreground">Agriculture</h3>
            <p className="text-xs text-muted-foreground">Cosmic rays & crop yields</p>
          </Card>
          <Card className="cosmic-glow cosmic-border border bg-gradient-to-br from-accent/20 to-secondary/20 p-4">
            <Users className="h-6 w-6 text-accent mb-2" />
            <h3 className="font-semibold text-foreground">Life</h3>
            <p className="text-xs text-muted-foreground">Evolution & radiation effects</p>
          </Card>
        </div>

        {/* Impact Stories */}
        <div className="space-y-4">
          <FeedCard
            title="Solar Activity Affects Global Temperature"
            description="Research reveals that 11-year solar cycles correlate with measurable changes in Earth's average temperature and precipitation patterns."
            category="Climate Impact"
            timestamp="3 days ago"
            likes={423}
            comments={67}
          />
          <FeedCard
            title="Cosmic Rays Influence Cloud Formation"
            description="New studies show cosmic ray variations can affect aerosol nucleation, influencing cloud cover and albedo effect on climate."
            category="Climate Science"
            timestamp="5 days ago"
            likes={312}
            comments={54}
          />
          <FeedCard
            title="Agricultural Yield and Solar Flares"
            description="Analysis of 50 years of crop data shows correlation between solar minimum periods and reduced agricultural productivity in key regions."
            category="Agriculture"
            timestamp="1 week ago"
            likes={234}
            comments={42}
          />
          <FeedCard
            title="Radiation Belt Dynamics and Life"
            description="Research explores how magnetospheric disturbances from solar wind might affect biological systems and evolution over geological timescales."
            category="Biology"
            timestamp="1 week ago"
            likes={178}
            comments={31}
          />
          <FeedCard
            title="Geomagnetic Storms Impact Infrastructure"
            description="Power grids and communications systems face potential disruption during extreme geomagnetic events. Preparedness measures outlined."
            category="Impact"
            timestamp="2 weeks ago"
            likes={567}
            comments={89}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
