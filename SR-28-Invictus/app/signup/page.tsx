import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="cosmic-glow cosmic-border w-full max-w-md bg-card">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Join AstroView</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create your account to explore space</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="mt-2 bg-input/50 border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-2 bg-input/50 border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="mt-2 bg-input/50 border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-2 bg-input/50 border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-foreground">
                Role
              </Label>
              <Select>
                <SelectTrigger className="mt-2 bg-input/50 border-border text-foreground">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar border-border">
                  <SelectItem value="enthusiast">Astronomy Enthusiast</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
