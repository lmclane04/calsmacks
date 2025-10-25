# Dream-to-Scene Backend

Express.js API server for processing dream descriptions and generating 3D scene configurations.

## Features

- **Dream Processing**: Convert natural language dream descriptions into 3D scene JSON
- **AI Integration**: Uses Reka AI for scene generation and poetic summaries
- **Audio Services**: Fish Audio integration for voice transcription and TTS
- **Mock Mode**: Works without API keys for development
- **TypeScript**: Fully typed for better DX

## API Endpoints

### Dream Processing

#### `POST /api/dream/process`
Process a dream description and generate complete scene with narration.

**Request:**
```json
{
  "description": "I was floating in a purple sky..."
}
```

**Response:**
```json
{
  "sceneConfig": { /* 3D scene configuration */ },
  "summary": "Poetic narration text",
  "narrationUrl": "https://...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/dream/scene`
Generate only the 3D scene configuration (no audio).

### Audio Services

#### `POST /api/audio/transcribe`
Transcribe audio file to text.

**Request:** Multipart form data with `audio` file

**Response:**
```json
{
  "text": "Transcribed text",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/audio/synthesize`
Generate speech from text.

**Request:**
```json
{
  "text": "Text to speak",
  "voice": "dreamy" // optional
}
```

**Response:**
```json
{
  "audioUrl": "https://...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Health Check

#### `GET /health`
Check if the server is running.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
REKA_API_KEY=your_key_here
FISH_AUDIO_API_KEY=your_key_here
FRONTEND_URL=http://localhost:5173
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Build

```bash
npm run build
```

Outputs to `dist/` folder.

## Production

```bash
npm start
```

## Project Structure

```
src/
├── index.ts           # Server entry point
├── routes/            # API route handlers
│   ├── dream.ts       # Dream processing
│   └── audio.ts       # Audio services
├── services/          # External API integrations
│   ├── reka.ts        # Reka AI service
│   └── fishAudio.ts   # Fish Audio service
└── utils/             # Utility functions
    └── types.ts       # TypeScript types
```

## Services

### Reka Service
- Generates 3D scene configurations from text
- Creates poetic summaries for narration
- Falls back to mock data if no API key

### Fish Audio Service
- Transcribes voice recordings to text
- Synthesizes speech from text
- Supports multiple voice options
- Falls back to mock data if no API key

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `500`: Server error

Error response format:
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## CORS

CORS is configured to allow requests from the frontend URL specified in `.env`.

## Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **axios**: HTTP client
- **multer**: File upload handling
- **form-data**: Multipart form data
- **tsx**: TypeScript execution
- **typescript**: TypeScript compiler
