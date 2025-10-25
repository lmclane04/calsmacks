# Dream-to-Scene

A voice-to-AR system that turns dream descriptions into narrated 3D scenes in real time.

## Project Overview

Dream-to-Scene allows users to describe their dreams through voice input, which are then transformed into immersive 3D scenes with AI-generated narration. The system uses:

- **Reka AI**: For LLM-based JSON scene generation and poetic dream summaries
- **Fish Audio**: For voice-to-text and text-to-speech narration
- **Three.js**: For 3D scene rendering in the browser

## Architecture

```
calsmacks/
├── backend/          # Express.js API server
│   ├── routes/       # API endpoints
│   ├── services/     # External API integrations
│   └── utils/        # Helper functions
└── frontend/         # React + Three.js app
    ├── components/   # React components
    ├── scenes/       # 3D scene logic
    └── utils/        # Frontend utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for:
  - Reka AI (https://reka.ai)
  - Fish Audio (https://fish.audio)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### POST `/api/dream/process`
Process a dream description and generate a 3D scene configuration.

**Request:**
```json
{
  "description": "I was floating in a purple sky with golden stars..."
}
```

**Response:**
```json
{
  "sceneConfig": {
    "objects": [...],
    "lighting": {...},
    "camera": {...}
  },
  "summary": "A poetic summary of the dream...",
  "narrationUrl": "https://..."
}
```

### POST `/api/audio/transcribe`
Transcribe voice input to text.

### POST `/api/audio/synthesize`
Generate narration audio from text.

## Development

- Backend uses Express.js with TypeScript
- Frontend uses React, Vite, and Three.js
- Both support hot reloading for rapid development

## Documentation

- **QUICKSTART.md** - Get running in 5 minutes
- **DEVELOPMENT.md** - Detailed architecture and customization
- **EXAMPLES.md** - API usage and dream description examples

## License

MIT