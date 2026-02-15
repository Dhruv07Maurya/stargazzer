# 🌌 AstroView

AstroView is a stunning, high-performance space exploration dashboard built for advanced learners and stargazers. It provides real-time data on satellite missions, celestial events, space weather, and Earth insights, all wrapped in a premium glassmorphic interface.

![AstroView Logo](client/public/logo.png) *(Note: Add your logo here)*

---

## ✨ Key Features

AstroView is divided into several specialized modules:

1.  **🚀 Missions & Launches**: Live countdowns and details for upcoming missions from NASA, ISRO, SpaceX, and more.
2.  **🌌 Sky Events**: Track meteor showers, planetary alignments, and lunar phases.
3.  **🗺️ Sky Map**: An interactive circular dome projection showing real-time positions of stars, planets, and constellations.
4.  **☀️ Space Weather**: Real-time solar wind data, Kp Index, and CME (Coronal Mass Ejection) tracking from NOAA.
5.  **🌍 Earth Insights**: Satellite-based tracking of natural events like wildfires, storms, and floods.
6.  **📊 Explore Data**: Deep-dive into raw astronomical metrics like Sidereal Time, Julian Date, and J2000 coordinates.
7.  **📚 Learn**: A curated library of space knowledge and glossary of terms.

---

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Recharts (Data Viz), Lucide/IO Icons.
-   **Backend**: Node.js & Express (API Proxy & Caching).
-   **Astronomy Libs**: `astronomy-engine`, `suncalc`.
-   **Styling**: Vanilla CSS (Global variables, Glassmorphism, Animations).

---

## 🚦 Quick Start

Follow these steps to get the project running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- A NASA API Key (Get a free one at [api.nasa.gov](https://api.nasa.gov/))

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd astroview
```

### 2. Configure Environment Variables
Create a `.env` file in the **root** and the **server** directory (or copy `.env.example`).
```env
PORT=5000
NASA_API_KEY=YOUR_FREE_NASA_KEY_HERE
```

### 3. Install & Start Backend
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Install & Start Frontend
```bash
cd ../client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📖 In-depth Documentation

For detailed guides, please see:
- [🚀 Setup & Installation](docs/SETUP.md)
- [🏗️ Architecture Overview](docs/ARCHITECTURE.md) *(Coming Soon)*

---

## 📜 License
This project is developed for the Invictus '26 Hackathon.
