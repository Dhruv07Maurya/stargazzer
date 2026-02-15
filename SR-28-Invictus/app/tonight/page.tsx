import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Moon, MapPin } from 'lucide-react'

export default function TonightPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Moon className="h-8 w-8 text-primary" />
            Tonight's Sky
          </h1>
          <p className="text-muted-foreground">
            Location-based astronomical events visible from your area tonight
          </p>
        </div>

        {/* Location Selector */}
        <Card className="cosmic-glow cosmic-border mb-8 border bg-card p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Your Location</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent/20">
              Change
            </Button>
          </div>
        </Card>

        {/* Sky Events */}
        <div className="space-y-4">
          <FeedCard
            title="Jupiter at Opposition"
            description="Jupiter reaches opposition tonight, appearing at its brightest and largest in the sky. Best viewing time: 10 PM - 4 AM."
            category="Planetary Event"
            timestamp="Tonight"
            likes={156}
            comments={28}
          />
          <FeedCard
            title="Perseids Meteor Shower"
            description="Peak activity of the Perseid meteor shower. Expect 50-60 meteors per hour. Best viewed in dark sky areas away from light pollution."
            category="Meteor Shower"
            timestamp="Tonight"
            likes={412}
            comments={73}
          />
          <FeedCard
            title="ISS Visible Pass"
            description="The International Space Station will make a visible pass overhead at 9:45 PM PT. Duration: 4 minutes."
            category="Space Station"
            timestamp="Tonight"
            likes={234}
            comments={42}
          />
          <FeedCard
            title="Moon Phase: Waxing Crescent"
            description="The Moon will be in a waxing crescent phase. Lunar altitude peak at 8:30 PM. Good time for lunar detail observation."
            category="Lunar"
            timestamp="Tonight"
            likes={178}
            comments={31}
          />
          <FeedCard
            title="Venus & Saturn Conjunction"
            description="Venus and Saturn will be in close conjunction in the western sky after sunset. Separation: 3 degrees."
            category="Planetary"
            timestamp="Tonight"
            likes={267}
            comments={48}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
