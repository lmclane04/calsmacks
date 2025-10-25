# Development Guide

## Project Structure

```
dream-to-scene/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API route handlers
│   │   │   ├── dream.ts       # Dream processing endpoints
│   │   │   └── audio.ts       # Audio transcription/synthesis
│   │   ├── services/          # External API integrations
│   │   │   ├── reka.ts        # Reka AI service
│   │   │   └── fishAudio.ts   # Fish Audio service
│   │   └── utils/             # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/                   # React + Three.js app
    ├── src/
    │   ├── main.tsx           # App entry point
    │   ├── App.tsx            # Main app component
    │   ├── types.ts           # TypeScript types
    │   ├── components/        # React components
    │   │   ├── DreamInput.tsx # Dream description input
    │   │   └── SceneViewer.tsx # 3D scene container
    │   └── scenes/            # Three.js scene logic
    │       └── DreamScene.tsx # 3D object rendering
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
REKA_API_KEY=your_reka_api_key
FISH_AUDIO_API_KEY=your_fish_audio_api_key
```

Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Integration Details

### Reka AI Integration

The Reka service (`backend/src/services/reka.ts`) provides:

1. **Scene Generation**: Converts dream descriptions to 3D scene configurations
2. **Poetic Summaries**: Creates atmospheric narration text

**Key Methods:**
- `generateSceneConfig(description: string)`: Returns scene JSON
- `generatePoeticSummary(description: string)`: Returns narration text

**API Endpoint**: `https://api.reka.ai/v1`

**Model Used**: `reka-core`

### Fish Audio Integration

The Fish Audio service (`backend/src/services/fishAudio.ts`) provides:

1. **Speech-to-Text**: Transcribes voice recordings
2. **Text-to-Speech**: Generates narration audio

**Key Methods:**
- `transcribeAudio(audioBuffer: Buffer)`: Returns transcription
- `synthesizeSpeech(text: string, voiceId?: string)`: Returns audio URL

**API Endpoint**: `https://api.fish.audio/v1`

## Development Workflow

### Adding New Scene Objects

To add a new 3D object type:

1. Update the type in `frontend/src/types.ts`:
```typescript
export type SceneObjectType = 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus' | 'YOUR_NEW_TYPE';
```

2. Add the geometry in `frontend/src/scenes/DreamScene.tsx`:
```typescript
case 'YOUR_NEW_TYPE':
  return <yourGeometry args={[...]} />;
```

3. Update the Reka prompt in `backend/src/services/reka.ts` to include the new type

### Customizing the Scene Renderer

The scene renderer uses React Three Fiber. Key customization points:

- **Camera**: Edit `SceneViewer.tsx` camera position and FOV
- **Lighting**: Modify ambient/directional lights in `SceneViewer.tsx`
- **Animation**: Update `useFrame` hook in `DreamScene.tsx`
- **Materials**: Change `meshStandardMaterial` properties

### Mock Mode

Both services include mock responses for development without API keys:

- **Reka**: Returns a predefined scene configuration
- **Fish Audio**: Returns placeholder audio URL

This allows you to develop the frontend without API access.

## Testing

### Backend Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Process dream
curl -X POST http://localhost:3001/api/dream/process \
  -H "Content-Type: application/json" \
  -d '{"description": "test dream"}'
```

### Frontend Testing

1. Open `http://localhost:5173` in your browser
2. Enter a dream description
3. Click submit and verify:
   - Loading state appears
   - 3D scene renders
   - Audio player appears
   - Summary displays

## Common Issues

### CORS Errors

If you see CORS errors, verify:
- Backend is running on port 3001
- Frontend `.env` has correct API URL
- Backend CORS is configured for frontend URL

### 3D Scene Not Rendering

Check:
- Browser console for Three.js errors
- Scene config is valid JSON
- All required Three.js packages are installed

### API Key Issues

If API calls fail:
- Verify keys are in backend `.env`
- Check API key validity
- Review service console logs
- Confirm mock mode is working as fallback

## Performance Optimization

### Backend
- Add caching for repeated dream descriptions
- Implement rate limiting
- Use streaming for large audio files

### Frontend
- Lazy load 3D objects
- Implement scene object pooling
- Optimize material shaders
- Add loading states

## Deployment

### Backend Deployment

1. Build the TypeScript:
```bash
npm run build
```

2. Deploy `dist/` folder to your hosting service
3. Set environment variables in hosting dashboard

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)
3. Update API URL in environment variables

## Future Enhancements

- [ ] Add voice recording functionality
- [ ] Implement scene animation sequences
- [ ] Add VR/AR support
- [ ] Create scene sharing/export
- [ ] Add more 3D object types
- [ ] Implement scene transitions
- [ ] Add user accounts and saved dreams
- [ ] Create mobile app version
