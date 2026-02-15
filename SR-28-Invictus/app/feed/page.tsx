'use client';

import FeedCard from '@/components/FeedCard'
import RightPanel from '@/components/RightPanel'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function FeedPage() {
    return (
        <div className="flex">
            {/* Main Feed */}
            <div className="flex-1 max-w-2xl border-r border-border px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        AstroFeed
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time updates on space events, asteroid tracking, and astronomical discoveries
                    </p>
                </div>

                {/* Featured Banner */}
                <div className="cosmic-glow cosmic-border hover-cosmic mb-8 overflow-hidden rounded-lg border bg-gradient-to-r from-primary/20 to-accent/20 p-6">
                    <h2 className="mb-2 text-xl font-semibold text-foreground">Welcome to AstroView</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Explore real-time space events, track near-Earth objects, and discover how cosmic phenomena affects life on Earth.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90">Explore Now</Button>
                </div>

                {/* Feed Items */}
                <div className="space-y-4">
                    <FeedCard
                        title="Solar Flare Activity Detected"
                        description="NASA's Solar Dynamics Observatory has detected significant solar flare activity. Potential impact on satellite communications expected."
                        category="Space Event"
                        timestamp="2 hours ago"
                        likes={234}
                        comments={45}
                    />
                    <FeedCard
                        title="Near-Earth Asteroid Passes By"
                        description="Asteroid 2024 BX12 safely passed Earth at a distance of 1.2 million kilometers. No collision risk detected."
                        category="Astronomy"
                        timestamp="4 hours ago"
                        likes={512}
                        comments={89}
                    />
                    <FeedCard
                        title="International Space Station Maintenance"
                        description="Astronauts conducted successful external maintenance on the ISS solar panels, expected to increase power generation by 15%."
                        category="Space Mission"
                        timestamp="6 hours ago"
                        likes={178}
                        comments={32}
                    />
                    <FeedCard
                        title="Climate Impact Study: Solar Cycles"
                        description="New research shows correlation between solar cycles and Earth's climate patterns. Implications for long-term weather prediction."
                        category="Climate Impact"
                        timestamp="8 hours ago"
                        likes={423}
                        comments={67}
                    />
                    <FeedCard
                        title="Meteorite Collection from Antarctica"
                        description="Scientists recovered rare meteorite samples from Antarctica. Preliminary analysis suggests extraterrestrial origin from Mars."
                        category="Discovery"
                        timestamp="12 hours ago"
                        likes={312}
                        comments={54}
                    />
                </div>
            </div>

            {/* Right Panel */}
            <RightPanel />
        </div>
    )
}
