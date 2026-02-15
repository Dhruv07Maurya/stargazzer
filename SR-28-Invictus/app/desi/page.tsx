import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function DesiPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Desi Space
          </h1>
          <p className="text-muted-foreground">
            India's space programs, achievements, and contributions to astronomy and space exploration
          </p>
        </div>

        {/* Featured Section */}
        <Card className="cosmic-glow cosmic-border mb-8 border bg-gradient-to-r from-primary/20 to-accent/20 p-6">
          <h2 className="mb-2 text-xl font-semibold text-foreground">ISRO's Chandrayaan-3 Success</h2>
          <p className="text-sm text-muted-foreground">
            India becomes the 4th country to achieve a soft landing on the Moon. The Chandrayaan-3 mission successfully deployed its lander and rover on the lunar south pole.
          </p>
        </Card>

        {/* Desi Space Updates */}
        <div className="space-y-4">
          <FeedCard
            title="Aditya-L1 Solar Mission Update"
            description="ISRO's Aditya-L1 spacecraft successfully deployed its solar coronagraph to study the Sun's corona. Key scientific insights expected soon."
            category="ISRO Mission"
            timestamp="1 week ago"
            likes={567}
            comments={89}
          />
          <FeedCard
            title="Mangalyaan Still Operating on Mars"
            description="India's Mars Orbiter Mission continues to provide valuable data after 10 years in operation. One of the most cost-effective space missions ever."
            category="Achievement"
            timestamp="2 weeks ago"
            likes={823}
            comments={134}
          />
          <FeedCard
            title="NextGen Satellite Launch by ISRO"
            description="ISRO successfully launched GSAT-20 communication satellite. Enhanced capabilities for broadband services across India and neighboring regions."
            category="Satellite"
            timestamp="3 weeks ago"
            likes={412}
            comments={67}
          />
          <FeedCard
            title="Indian Private Space Industry Growth"
            description="Skyroot Aerospace and Axiom Space announce collaboration. India's emerging space startup ecosystem attracting global attention and investment."
            category="Space Industry"
            timestamp="1 month ago"
            likes={678}
            comments={112}
          />
          <FeedCard
            title="Lunar South Pole Resources Discovery"
            description="Analysis of Chandrayaan-3 rover data reveals significant water ice deposits at lunar south pole. Critical for future human missions."
            category="Discovery"
            timestamp="1 month ago"
            likes={945}
            comments={178}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
