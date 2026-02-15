import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Award, Calendar, LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">User Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <Card className="cosmic-glow cosmic-border md:col-span-2 border bg-card p-6">
          <div className="mb-6">
            <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                defaultValue="John Astronomy"
                className="mt-2 bg-input/50 border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="john@astroview.com"
                className="mt-2 bg-input/50 border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                defaultValue="+1 (555) 123-4567"
                className="mt-2 bg-input/50 border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground">
                Location
              </Label>
              <Input
                id="location"
                defaultValue="San Francisco, CA"
                className="mt-2 bg-input/50 border-border text-foreground"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent/20">
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          {/* User Stats */}
          <Card className="cosmic-glow cosmic-border border bg-card p-4">
            <h3 className="mb-3 font-semibold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts</span>
                <span className="font-medium text-foreground">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers</span>
                <span className="font-medium text-foreground">342</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Following</span>
                <span className="font-medium text-foreground">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Observations</span>
                <span className="font-medium text-foreground">89</span>
              </div>
            </div>
          </Card>

          {/* Join Date */}
          <Card className="cosmic-glow cosmic-border border bg-card p-4">
            <h3 className="mb-3 font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary" />
              Member Since
            </h3>
            <p className="text-sm text-muted-foreground">January 15, 2024</p>
          </Card>

          {/* Logout */}
          <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 grid gap-6">
        {/* Preferences */}
        <Card className="cosmic-glow cosmic-border border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-foreground">Email notifications for space events</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-foreground">Subscribe to weekly space digest</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-foreground">Show profile publicly</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}
