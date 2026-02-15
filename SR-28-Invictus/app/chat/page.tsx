import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 max-w-2xl border-r border-border px-6 py-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Ask Astro
          </h1>
          <p className="text-muted-foreground">
            AI-powered astronomy assistant powered by advanced language models
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {/* Welcome Message */}
          <Card className="cosmic-glow cosmic-border self-start max-w-xs border bg-card p-4">
            <p className="text-sm text-foreground">
              Hello! I'm Astro, your AI-powered astronomy assistant. Ask me anything about space, stars, planets, or cosmic phenomena!
            </p>
          </Card>

          {/* Example Questions */}
          <div className="space-y-2 mt-8">
            <p className="text-sm text-muted-foreground">Try asking:</p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              <Card className="cosmic-glow cosmic-border hover-cosmic border bg-card p-3 cursor-pointer">
                <p className="text-sm font-medium text-foreground">What's visible tonight?</p>
              </Card>
              <Card className="cosmic-glow cosmic-border hover-cosmic border bg-card p-3 cursor-pointer">
                <p className="text-sm font-medium text-foreground">How far is Mars?</p>
              </Card>
              <Card className="cosmic-glow cosmic-border hover-cosmic border bg-card p-3 cursor-pointer">
                <p className="text-sm font-medium text-foreground">Explain black holes</p>
              </Card>
              <Card className="cosmic-glow cosmic-border hover-cosmic border bg-card p-3 cursor-pointer">
                <p className="text-sm font-medium text-foreground">When's the next eclipse?</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border pt-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me about astronomy, space, or cosmic phenomena..."
              className="flex-1 bg-input/50 border-border text-foreground placeholder:text-muted-foreground/50"
            />
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This is a placeholder. Real AI integration coming soon via backend API.
          </p>
        </div>
      </div>
    </div>
  )
}
