import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import DreamScene from '../scenes/DreamScene';
import { SceneConfig } from '../types';

interface SceneViewerProps {
  config: SceneConfig | null;
}

export default function SceneViewer({ config }: SceneViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 75 }}
      style={{ background: config?.environment.skyColor || '#0a0a0a' }}
    >
      {/* Lighting */}
      <ambientLight
        color={config?.lighting.ambient.color || '#404040'}
        intensity={config?.lighting.ambient.intensity || 0.5}
      />
      {config?.lighting.directional && (
        <directionalLight
          color={config.lighting.directional.color}
          intensity={config.lighting.directional.intensity}
          position={config.lighting.directional.position}
          castShadow
        />
      )}

      {/* Background Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Dream Scene Objects */}
      {config && <DreamScene config={config} />}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />

      {/* Fog */}
      {config?.environment.fogColor && (
        <fog
          attach="fog"
          args={[
            config.environment.fogColor,
            10,
            config.environment.fogDensity ? 100 / config.environment.fogDensity : 50
          ]}
        />
      )}
    </Canvas>
  );
}
