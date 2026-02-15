# AstroView Backend API

Real-time space intelligence backend API server for AstroView.

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- External API Keys (NASA, N2YO, NOAA, AI provider)

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Configuration

1. Copy `.env` file and add your API keys:
   ```bash
   cp .env.example .env
   ```

2. Update environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NASA_API_KEY`: From NASA API Portal
   - `N2YO_API_KEY`: From N2YO Satellite API
   - `GROQ_API_KEY` or other AI provider keys

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Posts & Feed
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `GET /api/events/location/:location` - Get location-based events

### Missions
- `GET /api/missions` - Get all missions
- `GET /api/missions/:id` - Get mission details
- `GET /api/missions/agency/:agency` - Get missions by agency

### Solar Activity
- `GET /api/solar` - Get current solar activity
- `GET /api/solar/forecast` - Get solar forecast
- `GET /api/solar/historical` - Get historical data

### Satellite Tracking
- `GET /api/satellites` - List tracked satellites
- `GET /api/satellites/:id/position` - Get satellite position
- `GET /api/satellites/:id/passes` - Get visible passes

### Chat (Ask Astro)
- `POST /api/chat` - Send message
- `GET /api/chat/history/:conversationId` - Get conversation history

### Gamification
- `GET /api/points/:userId` - Get user points
- `POST /api/points/:userId/activity` - Log activity
- `GET /api/points/leaderboard` - Get leaderboard

### AR
- `POST /api/ar/coordinates` - Get AR coordinates
- `GET /api/ar/constellations` - Get constellation data
- `GET /api/ar/objects` - Get visible objects

## Database Schema

### Collections
- **Users** - User accounts and profiles
- **Posts** - Community posts and space events
- **Events** - Astronomical events
- **Missions** - Space missions
- **Points** - User gamification data

See `/src/models/` for detailed schema definitions.

## External API Integration

### NASA APIs
- [Astronomical Events API](https://api.nasa.gov)
- [Solar Data API](https://api.nasa.gov)
- [Mars Rover API](https://api.nasa.gov)

### NOAA Space Weather
- [Space Weather Prediction Center](https://swpc.noaa.gov/products/alerts-watches-warnings)

### N2YO Satellite Tracking
- [Satellite Tracking API](https://www.n2yo.com/api/)

### AI Chat Integration
Options:
- **Groq** (Recommended - Fast, free tier available)
- **OpenAI** (ChatGPT API)
- **Anthropic** (Claude API)
- **Google** (Gemini API)

## CORS Configuration

Frontend URLs allowed:
- `http://localhost:3000` (development)
- Update `FRONTEND_URL` in `.env` for production

## Error Handling

All endpoints return:
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, error: "message" }`

## Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Streaming API responses
- [ ] Advanced authentication with OAuth
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] GraphQL API option
- [ ] Email notifications
- [ ] User subscription management

## Development Notes

- All route files are placeholders - implement business logic in `/src/routes/`
- Database models are defined in `/src/models/`
- External API calls should be abstracted to `/src/services/`
- Use environment variables for all configuration

## License

MIT
