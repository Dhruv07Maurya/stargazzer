# AstroView - Real-time Space Intelligence Platform

A full-stack monorepo application for exploring real-time space events, asteroid tracking, and the cosmic impact on Earth. Built with Next.js 16 (frontend) and Express.js (backend).

## 🚀 Features

### Frontend
- **AstroFeed**: Real-time space event updates
- **Tonight's Sky**: Location-based astronomical events
- **Discover**: Curated space discoveries and research
- **Cosmic Impact**: Climate and agricultural effects of space phenomena
- **Live Radar**: Real-time tracking of satellites and asteroids
- **AR Sky Visualization**: Augmented reality for celestial object identification (coming soon)
- **Ask Astro**: AI-powered astronomy assistant
- **Community**: Connect with astronomy enthusiasts
- **Desi Space**: India's space program highlights
- **User Profiles**: Personal accounts and gamification

### Backend
- RESTful API with Express.js
- MongoDB database for data persistence
- Integration with external APIs:
  - NASA Astronomical Events and Solar Data
  - NOAA Space Weather Prediction
  - N2YO Satellite Tracking
  - AI Chat providers (Groq, OpenAI, Anthropic, Google)
- CORS enabled for frontend communication
- Modular route structure for scalability

## 📁 Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js frontend
│   ├── layout.tsx               # Main layout with sidebar
│   ├── page.tsx                 # Home page (AstroFeed)
│   ├── login/                   # Authentication pages
│   ├── signup/
│   ├── tonight/                 # Tonight's Sky
│   ├── discover/                # Discover Space
│   ├── impact/                  # Cosmic Impact
│   ├── radar/                   # Live Radar
│   ├── ar/                      # AR Sky (Three.js placeholder)
│   ├── chat/                    # Ask Astro AI
│   ├── community/               # Community features
│   ├── desi/                    # Desi Space
│   ├── profile/                 # User profiles
│   └── globals.css              # Cosmic dark theme
├── components/                   # React components
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── TopNavbar.tsx            # Mobile top bar
│   ├── RightPanel.tsx           # Right sidebar widgets
│   ├── FeedCard.tsx             # Post card component
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── api.ts                   # Frontend API client
│   └── utils.ts                 # Utilities
├── backend/                      # Express.js backend
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── posts.routes.js
│   │   │   ├── events.routes.js
│   │   │   ├── missions.routes.js
│   │   │   ├── solar.routes.js
│   │   │   ├── satellites.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── points.routes.js
│   │   │   └── ar.routes.js
│   │   └── models/              # MongoDB schemas
│   │       ├── User.js
│   │       ├── Post.js
│   │       ├── Event.js
│   │       ├── Mission.js
│   │       └── Points.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## 🎨 Design System

**Cosmic Dark Theme**
- Primary: Deep Purple (`#8A2BE2`)
- Secondary: Sky Blue (`#4169E1`)
- Accent: Violet (`#9370DB`)
- Background: Deep Space (`#0F0821`)
- Cards: Subtle glow effect with cosmic borders

**Typography**
- Headings: Geist font
- Body: Geist Sans
- Mono: Geist Mono

**Components**
- Built with shadcn/ui
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or pnpm

### Frontend Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Frontend will be available at http://localhost:3000
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env with your API keys

# Run development server
npm run dev

# Backend will be available at http://localhost:5000
```

## 🔌 Integration Points

### Frontend API Client (`lib/api.ts`)
All API functions are organized by feature:
- `fetchPosts()` - Get feed posts
- `fetchEvents()` - Get astronomical events
- `fetchMissions()` - Get space missions
- `fetchSolarData()` - Get solar activity
- `fetchSatelliteData()` - Get satellite positions
- `loginUser()` - User authentication
- `signupUser()` - User registration
- `sendChatMessage()` - AI chat
- `fetchUserPoints()` - Gamification
- `fetchARCoordinates()` - AR visualization

### External API Integrations

**NASA APIs**
- Real-time space events
- Solar data and flare tracking
- Near-Earth object tracking

**NOAA Space Weather**
- Solar wind data
- Geomagnetic storm alerts
- Space weather forecasts

**N2YO Satellite Tracking**
- ISS position tracking
- Starlink constellation data
- Satellite visibility predictions

**AI Chat Integration**
- Groq (recommended for speed)
- OpenAI
- Anthropic Claude
- Google Gemini

## 📊 Database Models

### User
- Profile information (name, email, phone, location)
- Authentication credentials
- Preferences and settings
- Engagement statistics

### Post
- Community posts and space event updates
- Author and engagement tracking
- Category and tagging system

### Event
- Astronomical events (meteor showers, eclipses, etc.)
- Location-based visibility data
- Source tracking (NASA, NOAA, etc.)

### Mission
- Space missions from various agencies
- Launch details and timeline
- Crew and payload information

### Points
- User gamification system
- Achievement tracking
- Leaderboard rankings

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create Frontend Components** (`components/`)
2. **Create Frontend Page** (`app/[feature]/page.tsx`)
3. **Create API Client Function** (`lib/api.ts`)
4. **Create Backend Route** (`backend/src/routes/[feature].routes.js`)
5. **Create Database Model** (`backend/src/models/[Model].js`)
6. **Add Integration Comments** for external APIs

### Code Organization
- Each page has its own folder under `app/`
- Components are reusable and placed in `components/`
- API client functions grouped by feature in `lib/api.ts`
- Backend routes follow REST conventions
- Database models define schema structure

## 🔐 Security Considerations

**TODO Implementation:**
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only secure cookies
- CORS validation
- Input sanitization
- SQL injection prevention (parameterized queries)
- Rate limiting
- CSRF protection

## 📱 Responsive Design

- **Mobile**: Collapsible sidebar, full-width content
- **Tablet**: Adjusted spacing and touch-friendly buttons
- **Desktop**: Full layout with fixed sidebar and right panel

## 🎯 Future Enhancements

- [ ] Real-time WebSocket updates for live events
- [ ] Streaming API responses for faster data delivery
- [ ] Advanced user authentication with OAuth
- [ ] Email notifications system
- [ ] Advanced search and filtering
- [ ] Data export capabilities (CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] GraphQL API option
- [ ] Advanced analytics dashboard
- [ ] Subscription management system

## 📝 Notes

This is a **skeleton implementation** with:
- ✅ Clean folder structure
- ✅ All pages and routes created
- ✅ API client layer ready
- ✅ Database models defined
- ✅ Integration points clearly marked
- ❌ No actual business logic (placeholder responses)
- ❌ No real API integrations (ready for implementation)
- ❌ No authentication implementation
- ❌ No data persistence (MongoDB connection needed)

## 🤝 Contributing

To implement features:
1. Follow the established folder structure
2. Add TODO comments for future work
3. Keep components small and reusable
4. Use semantic HTML and ARIA labels
5. Test responsive design on mobile

## 📄 License

MIT License - Feel free to use for your projects!

---

**Built for the hackathon** 🚀✨

For more details on backend setup, see [backend/README.md](backend/README.md)
