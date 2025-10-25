# Dream-to-Scene Examples

## Example Dream Descriptions

Here are some example dream descriptions you can use to test the system:

### Example 1: Floating Islands
```
I was standing on a floating island made of crystal. Around me were other islands connected by bridges of light. The sky was a deep purple with swirling galaxies visible above.
```

### Example 2: Underwater City
```
I found myself in an underwater city with buildings made of coral and glass. Bioluminescent fish swam between the structures, and everything glowed with a soft blue-green light.
```

### Example 3: Desert Dreamscape
```
I was walking through a desert where the sand was made of gold dust. Giant hourglasses floated in the air, and the sun was setting, painting everything in shades of orange and pink.
```

### Example 4: Forest of Giants
```
I wandered through a forest where the trees were impossibly tall, reaching into the clouds. Glowing mushrooms the size of houses dotted the landscape, and the air shimmered with magic.
```

### Example 5: Space Station
```
I was in a space station orbiting a ringed planet. Through the windows, I could see asteroids drifting by and distant stars. Everything inside was sleek and metallic with holographic displays.
```

## API Usage Examples

### Process a Dream (Full Pipeline)

```bash
curl -X POST http://localhost:3001/api/dream/process \
  -H "Content-Type: application/json" \
  -d '{
    "description": "I was floating in a purple sky with golden stars all around me"
  }'
```

**Response:**
```json
{
  "sceneConfig": {
    "objects": [
      {
        "type": "sphere",
        "position": [0, 2, 0],
        "scale": [2, 2, 2],
        "color": "#9b59b6"
      }
    ],
    "lighting": {
      "ambient": { "color": "#404040", "intensity": 0.5 },
      "directional": { "color": "#ffffff", "intensity": 1.0, "position": [5, 10, 5] }
    },
    "camera": {
      "position": [0, 3, 10],
      "lookAt": [0, 0, 0]
    },
    "environment": {
      "skyColor": "#1a1a2e",
      "fogColor": "#16213e",
      "fogDensity": 0.02
    }
  },
  "summary": "In the realm between sleep and waking...",
  "narrationUrl": "https://...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Generate Scene Only

```bash
curl -X POST http://localhost:3001/api/dream/scene \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A crystal tower in the clouds"
  }'
```

### Synthesize Speech

```bash
curl -X POST http://localhost:3001/api/audio/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to your dream world",
    "voice": "dreamy"
  }'
```

### Transcribe Audio

```bash
curl -X POST http://localhost:3001/api/audio/transcribe \
  -F "audio=@dream_recording.wav"
```

## Frontend Integration Example

```typescript
import { useState } from 'react';

function DreamApp() {
  const [sceneData, setSceneData] = useState(null);

  const processDream = async (description: string) => {
    const response = await fetch('/api/dream/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });
    
    const data = await response.json();
    setSceneData(data);
    
    // Play narration
    const audio = new Audio(data.narrationUrl);
    audio.play();
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Describe your dream..."
        onSubmit={(e) => processDream(e.target.value)}
      />
      {sceneData && <SceneViewer config={sceneData.sceneConfig} />}
    </div>
  );
}
```

## Scene Configuration Format

The scene configuration uses a JSON format that's easy to work with:

```typescript
interface SceneConfig {
  objects: Array<{
    type: 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus';
    position: [x, y, z];
    rotation?: [x, y, z];
    scale?: [x, y, z];
    color?: string;  // Hex color
  }>;
  lighting: {
    ambient: { color: string; intensity: number };
    directional?: {
      color: string;
      intensity: number;
      position: [x, y, z];
    };
  };
  camera: {
    position: [x, y, z];
    lookAt: [x, y, z];
  };
  environment: {
    skyColor?: string;
    fogColor?: string;
    fogDensity?: number;
  };
}
```

## Tips for Best Results

1. **Be Descriptive**: Include colors, lighting, and spatial relationships
2. **Use Vivid Language**: Metaphors and sensory details help the AI generate better scenes
3. **Specify Scale**: Mention if things are large, small, near, or far
4. **Include Atmosphere**: Describe the mood, lighting, and environmental effects
5. **Keep it Focused**: 2-3 sentences work best for coherent scenes
