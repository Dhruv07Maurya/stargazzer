import { Card } from '@/components/ui/card'
import { TrendingUp, Users, Zap } from 'lucide-react'

export default function RightPanel() {
  return (
    <div className="hidden lg:block w-80 border-l border-border bg-card/50 p-6 space-y-6">
      {/* Trending Events */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending Events
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="cosmic-glow cosmic-border bg-sidebar/50 p-3 cursor-pointer hover:bg-sidebar transition-colors"
            >
              <p className="text-sm font-medium text-foreground">Event #{i}</p>
              <p className="text-xs text-muted-foreground">Details loading...</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Statistics */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
          <Zap className="h-4 w-4 text-accent" />
          Live Stats
        </h3>
        <Card className="cosmic-glow cosmic-border space-y-3 bg-sidebar/50 p-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Active Events</span>
            <span className="font-semibold text-foreground">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Community Posts</span>
            <span className="font-semibold text-foreground">1.2K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Users Online</span>
            <span className="font-semibold text-foreground">523</span>
          </div>
        </Card>
      </div>

      {/* Community Pulse */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
          <Users className="h-4 w-4 text-secondary" />
          Community Pulse
        </h3>
        <Card className="cosmic-glow cosmic-border bg-sidebar/50 p-4">
          <p className="text-xs text-muted-foreground">
            Join thousands of astronomy enthusiasts tracking real-time space events!
          </p>
        </Card>
      </div>
    </div>
  )
}
