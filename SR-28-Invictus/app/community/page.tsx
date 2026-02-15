import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Community
          </h1>
          <p className="text-muted-foreground">
            Connect with astronomy enthusiasts, share discoveries, and collaborate on observations
          </p>
        </div>

        {/* Community Stats */}
        <div className="mb-8 grid gap-4 grid-cols-3">
          <Card className="cosmic-glow cosmic-border border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">12.5K</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </Card>
          <Card className="cosmic-glow cosmic-border border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-secondary">8.9K</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </Card>
          <Card className="cosmic-glow cosmic-border border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">34.2K</p>
            <p className="text-xs text-muted-foreground">Interactions</p>
          </Card>
        </div>

        {/* Community Posts */}
        <div className="space-y-4">
          <FeedCard
            title="Shared my first astrophotography capture!"
            description="Finally managed to get a clear shot of Saturn with my new telescope. Spent 3 hours learning the equipment. So excited with the results!"
            category="Astrophotography"
            timestamp="1 hour ago"
            likes={456}
            comments={78}
          />
          <FeedCard
            title="Observation Challenge: Andromeda Galaxy"
            description="Starting a community challenge to capture Andromeda Galaxy this month. Prizes for best photos. Who wants to participate?"
            category="Challenge"
            timestamp="3 hours ago"
            likes={234}
            comments={42}
          />
          <FeedCard
            title="Tips for beginners starting stargazing"
            description="I compiled a guide with essential equipment, best practices, and common mistakes to avoid. Check out the full guide in the resources section."
            category="Guide"
            timestamp="1 day ago"
            likes={912}
            comments={156}
          />
          <FeedCard
            title="Meteor shower viewing locations near major cities"
            description="Created a map of the best light pollution-free viewing spots within 50 miles of SF, LA, NYC, and Chicago. Updated with 2024 recommendations."
            category="Resources"
            timestamp="2 days ago"
            likes={678}
            comments={112}
          />
          <FeedCard
            title="Discussion: Is space exploration worth the cost?"
            description="Open forum discussion about the societal impact and ROI of space exploration programs. Many perspectives welcome!"
            category="Discussion"
            timestamp="3 days ago"
            likes={523}
            comments={234}
          />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
