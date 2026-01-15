# FitVision AI - Real-time Exercise Analysis

A Next.js PWA for real-time exercise analysis using AI-powered pose detection.

## Features

- 🏋️ Real-time exercise tracking (Squats, Push-ups, Sit-ups, etc.)
- 🎯 AI-powered pose detection and feedback
- 📊 Live rep counting and form analysis
- 📱 PWA - installable on mobile devices
- 🌙 Premium dark theme with glassmorphism

## Getting Started

### Prerequisites

- Node.js 18+
- FastAPI backend running on `http://localhost:8000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-api.railway.app`)
4. Deploy!

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: CSS Modules with Glassmorphism
- **Real-time**: WebSocket for video streaming
- **Backend**: FastAPI + YOLO pose detection
