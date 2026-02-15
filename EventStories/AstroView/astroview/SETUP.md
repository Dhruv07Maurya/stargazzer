# 🚀 Setup & Installation Guide

This guide provides detailed instructions to set up the AstroView development environment.

## 📦 Prerequisites

Ensure you have the following installed on your system:
1.  **Node.js** (v16.x or higher)
2.  **npm** (comes with Node.js)
3.  **Git** (optional, but recommended)

---

## 🔑 API Keys Setup

AstroView relies on external data sources. Some require a free API key.

### 1. NASA API Key (Required)
-   Visit [api.nasa.gov](https://api.nasa.gov/).
-   Signup for a free key (takes less than a minute).
-   This key powers the missions, Mars photos, and space weather data.

### 2. Other APIs (No Key Needed)
The following data sources are used via open endpoints or calculated client-side:
-   **Launch Library 2**: Upcoming rocket launches.
-   **ISRO API**: ISRO satellite and launchpad data.
-   **Astronomy Engine**: Real-time celestial calculations (computed locally).
-   **NOAA SWPC**: Real-time solar wind and aurora data.

---

## 🛠️ Step-by-Step Installation

### 1. Environment Configuration
Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and paste your **NASA API Key**:
```env
NASA_API_KEY=your_actual_key_here
```

### 2. Backend Setup (Server)
Navigate to the server directory, install dependencies, and start the development server:
```bash
cd server
npm install
npm run dev
```
The backend includes:
-   **API Proxying**: Fetches data from NASA/NOAA to avoid CORS issues.
-   **Caching Layer**: Prevents hitting rate limits and ensures high performance.

### 3. Frontend Setup (Client)
In a new terminal, navigate to the client directory, install dependencies, and start the Vite server:
```bash
cd ../client
npm install
npm run dev
```
The application will open at `http://localhost:5173`.

---

## 🧪 Verification & Testing

Once both servers are running:
1.  Open `http://localhost:5173`.
2.  Check the **Home** dashboard for live cards.
3.  Go to the **Sky Map** and ensure icons appear on the dome.
4.  Visit **Explore Data** to verify real-time Sidereal Time and coordinate tracking.

## ❓ Troubleshooting

-   **ECONNREFUSED**: Ensure the backend server (`npm run dev` in `server/`) is actually running.
-   **403 Forbidden on NASA APIs**: Double-check your `NASA_API_KEY` in the `.env` file.
-   **CORS Issues**: Ensure you are calling `/api/...` endpoints on the backend proxy rather than directly calling external URLs from the frontend.
