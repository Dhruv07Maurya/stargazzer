import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Compass, Filter } from 'lucide-react'

export default function DiscoverPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            Discover Space
          </h1>
          <p className="text-muted-foreground">
            Explore the cosmos with curated astronomical discoveries and educational content
          </p>
        </div>

        {/* Filter Section */}
        <Card className="cosmic-glow cosmic-border mb-8 border bg-card p-4">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-primary" />
            <div className="flex flex-wrap gap-2">
              {['All', 'Galaxies', 'Nebulae', 'Stars', 'Exoplanets'].map((filter) => (
                <Button
                  key={filter}
                  variant={filter === 'All' ? 'default' : 'outline'}
                  size="sm"
                  className={filter === 'All' ? 'bg-primary hover:bg-primary/90' : 'border-border text-foreground hover:bg-accent/20'}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Discovery Feed */}
        <div className="space-y-4">
          <FeedCard
            title="Andromeda Galaxy in High Resolution"
            description="Hubble Space Telescope captures the most detailed image of Andromeda Galaxy yet. Contains over 1 billion stars in a single image."
            category="Discovery"
            timestamp="1 day ago"
            likes={892}
            comments={156}
          />
          <FeedCard
            title="New Exoplanet in the Habitable Zone"
            description="Astronomers discover TRAPPIST-1e, a potentially habitable exoplanet 39 light-years away in the constellation Aquarius."
            category="Exoplanet"
            timestamp="2 days ago"
            likes={1203}
            comments={234}
          />
          <FeedCard
            title="Supernova SN 2024 Outburst"
            description="Spectacular supernova explosion observed in nearby galaxy. Peak brightness expected in 3 weeks. Update your telescope settings!"
            category="Phenomenon"
            timestamp="3 days ago"
            likes={756}
            comments={112}
          />
          <FeedCard
            title="Black Hole Image Sharpened"
            description="Event Horizon Telescope releases higher resolution image of M87* black hole. New details emerge about its structure."
            category="Discovery"
            timestamp="4 days ago"
            likes={945}
            comments={178}
          />
          <FeedCard
            title="Aurora Borealis Surge Expected"
            description="Solar activity increase predicted to cause spectacular northern lights displays across northern latitudes this week."
            category="Phenomenon"
            timestamp="5 days ago"
            likes={567}
            comments={89}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
