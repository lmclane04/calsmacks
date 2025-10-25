# Dream-to-Scene Frontend

React + Three.js application for rendering dream descriptions as interactive 3D scenes.

## Features

- **3D Scene Rendering**: Real-time Three.js visualization
- **Interactive Controls**: Orbit, zoom, and pan camera
- **Voice Input**: Record dream descriptions (placeholder)
- **Audio Playback**: Narration with built-in player
- **Responsive UI**: Modern, gradient-based design
- **TypeScript**: Fully typed components

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful Three.js helpers
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## Development

```bash
npm run dev
```

App runs on `http://localhost:5173`

## Build

```bash
npm run build
```

Outputs to `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.tsx              # App entry point
├── App.tsx               # Main app component
├── index.css             # Global styles
├── types.ts              # TypeScript types
├── components/           # React components
│   ├── DreamInput.tsx    # Dream description input
│   └── SceneViewer.tsx   # 3D scene container
└── scenes/               # Three.js scene logic
    └── DreamScene.tsx    # 3D object rendering
```

## Components

### App.tsx
Main application component that:
- Manages scene state
- Handles API communication
- Coordinates UI and 3D rendering

### DreamInput.tsx
Input component with:
- Text area for dream descriptions
- Voice input button (placeholder)
- Submit button with loading state
- Animated loading indicator

### SceneViewer.tsx
3D scene container that:
- Sets up Three.js canvas
- Configures lighting
- Adds background stars
- Provides orbit controls
- Applies fog effects

### DreamScene.tsx
Renders 3D objects with:
- Dynamic geometry based on type
- Animated floating motion
- Material properties
- Color and scale support

## 3D Scene Configuration

The app renders scenes based on JSON configuration:

```typescript
{
  objects: [
    {
      type: 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus',
      position: [x, y, z],
      rotation: [x, y, z],
      scale: [x, y, z],
      color: '#hexcolor'
    }
  ],
  lighting: {
    ambient: { color: '#hex', intensity: 0-1 },
    directional: { color: '#hex', intensity: 0-2, position: [x,y,z] }
  },
  camera: {
    position: [x, y, z],
    lookAt: [x, y, z]
  },
  environment: {
    skyColor: '#hex',
    fogColor: '#hex',
    fogDensity: 0-1
  }
}
```

## Controls

- **Rotate**: Left-click and drag
- **Zoom**: Mouse wheel
- **Pan**: Right-click and drag

## Styling

Uses Tailwind CSS with custom configuration:
- Dark theme by default
- Gradient accents (purple to pink)
- Backdrop blur effects
- Responsive design

## Browser Support

Requires:
- WebGL support
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled

## Performance

Optimizations:
- Lazy component loading
- Efficient Three.js rendering
- Minimal re-renders with React hooks
- Optimized materials and geometries

## Customization

### Adding New 3D Shapes

Edit `src/scenes/DreamScene.tsx`:

```typescript
case 'newShape':
  return <newGeometry args={[...]} />;
```

### Changing Colors

Edit `src/index.css` or Tailwind config:

```css
/* Custom gradient */
.bg-gradient-to-r {
  from-purple-400 to-pink-600
}
```

### Modifying Camera

Edit `src/components/SceneViewer.tsx`:

```typescript
<Canvas camera={{ position: [x, y, z], fov: 75 }}>
```

## Troubleshooting

### 3D scene not rendering
- Check browser console for errors
- Verify WebGL support
- Ensure backend is running

### Styles not applying
- Run `npm run build` to rebuild
- Clear browser cache
- Check Tailwind config

### API errors
- Verify backend URL in `.env`
- Check network tab in dev tools
- Ensure CORS is configured

## Dependencies

- **react**: UI library
- **react-dom**: React DOM renderer
- **@react-three/fiber**: React Three.js renderer
- **@react-three/drei**: Three.js helpers
- **three**: 3D library
- **axios**: HTTP client
- **lucide-react**: Icons
- **tailwindcss**: CSS framework
- **vite**: Build tool
