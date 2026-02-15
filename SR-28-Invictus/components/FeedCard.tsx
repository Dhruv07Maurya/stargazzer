import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface FeedCardProps {
  title: string
  description: string
  category: string
  timestamp?: string
  image?: string
  likes?: number
  comments?: number
}

export default function FeedCard({
  title,
  description,
  category,
  timestamp = 'Just now',
  image,
  likes = 0,
  comments = 0,
}: FeedCardProps) {
  return (
    <Card className="cosmic-glow cosmic-border hover-cosmic overflow-hidden border bg-card p-4 transition-all duration-300">
      {/* Category Badge and Timestamp */}
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground">
          {category}
        </Badge>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
        {description}
      </p>

      {/* Image placeholder */}
      {image ? (
        <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-muted">
          {/* Image would go here */}
        </div>
      ) : (
        <div className="mb-4 h-40 w-full rounded-lg bg-gradient-to-br from-primary/20 to-accent/20" />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <button className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
          <Heart className="h-4 w-4" />
          <span>{likes > 0 ? likes : ''}</span>
        </button>
        <button className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
          <MessageCircle className="h-4 w-4" />
          <span>{comments > 0 ? comments : ''}</span>
        </button>
        <button className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
