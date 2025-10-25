# Quick Start Guide

Get Dream-to-Scene running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for Reka AI and Fish Audio (optional for testing)

## Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to the project
cd dream-to-scene

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development
REKA_API_KEY=your_reka_api_key_here
FISH_AUDIO_API_KEY=your_fish_audio_api_key_here
FRONTEND_URL=http://localhost:5173
```

**Note:** The app works without API keys using mock data for development!

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Dream-to-Scene backend running on http://localhost:3001
📝 Environment: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open the App

Visit `http://localhost:5173` in your browser.

## First Test

1. In the text area at the bottom, type:
   ```
   I was floating in a purple sky with golden stars all around me
   ```

2. Click the send button (arrow icon)

3. Watch as:
   - The loading animation appears
   - A 3D scene is generated
   - A poetic summary appears below the input
   - Audio narration plays automatically

4. Use your mouse to:
   - **Rotate**: Left-click and drag
   - **Zoom**: Scroll wheel
   - **Pan**: Right-click and drag

## Try More Examples

```
A crystal tower rising from clouds of pink mist

An underwater city with bioluminescent coral buildings

A desert made of gold dust with floating hourglasses

A forest where giant glowing mushrooms light the path
```

## API Testing

Test the backend directly:

```bash
# Health check
curl http://localhost:3001/health

# Process a dream
curl -X POST http://localhost:3001/api/dream/process \
  -H "Content-Type: application/json" \
  -d '{"description": "A magical forest with glowing trees"}'
```

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and run `npm install` again

### Frontend won't start
- Check if port 5173 is available
- Clear browser cache
- Try `npm run build` to check for TypeScript errors

### 3D scene not rendering
- Check browser console for errors
- Ensure WebGL is supported: Visit `https://get.webgl.org/`
- Try a different browser (Chrome/Firefox recommended)

### API errors
- Verify backend is running on port 3001
- Check CORS settings in backend
- Review backend console logs

### No audio playing
- Check browser audio permissions
- Verify audio URL in network tab
- Try clicking the audio player controls manually

## Next Steps

- Read [EXAMPLES.md](./EXAMPLES.md) for more dream descriptions
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for customization
- Add your real API keys for full functionality
- Experiment with different dream descriptions

## Getting API Keys

### Reka AI
1. Visit https://reka.ai
2. Sign up for an account
3. Navigate to API settings
4. Generate an API key

### Fish Audio
1. Visit https://fish.audio
2. Create an account
3. Go to API credentials
4. Generate your API key

## Support

If you encounter issues:
1. Check the console logs (backend and browser)
2. Review the error messages
3. Verify all dependencies are installed
4. Ensure ports 3001 and 5173 are available

Happy dreaming! 🌙✨
