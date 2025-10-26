import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Cloud, 
  Sparkles, 
  Float, 
  useHelper,
  BakeShadows
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  Vignette, 
  ChromaticAberration,
  LUT
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import DreamScene from '../scenes/DreamScene';
import { SceneConfig } from '../types';
import { useRef } from 'react';
import { DirectionalLightHelper, SpotLightHelper, HemisphereLightHelper } from 'three';

interface SceneViewerProps {
  config: SceneConfig | null;
}

// Advanced Lighting Setup component with helpers
function SceneLighting({ config }: { config: SceneConfig }) {
  // Create refs for lights to use with helpers (helpful during development)
  const dirLightRef = useRef();
  const spotLightRef = useRef();
  const hemiLightRef = useRef();
  
  // Light type detection based on environment
  const skyColor = config.environment.skyColor || '#000000';
  const isCosmic = skyColor.toLowerCase().includes('0f') || skyColor.toLowerCase().includes('1a');
  const isUnderwater = skyColor.toLowerCase().includes('468') || skyColor.toLowerCase().includes('5f9');
  const isGarden = !isCosmic && !isUnderwater;
  
  // Add volumetric spotlights for cosmic scenes
  const useDynamicLights = isCosmic || config.environment.fogDensity > 0.015;
  
  // Uncomment to enable helpers during development
  // useHelper(dirLightRef, DirectionalLightHelper, 2, 'red');
  // useHelper(spotLightRef, SpotLightHelper, 'blue');
  // useHelper(hemiLightRef, HemisphereLightHelper, 2, 'green');

  return (
    <>
      {/* Base ambient light */}
      <ambientLight
        color={config.lighting.ambient.color || '#404040'}
        intensity={config.lighting.ambient.intensity || 0.5}
      />
      
      {/* Main directional light */}
      {config.lighting.directional && (
        <directionalLight
          ref={dirLightRef}
          color={config.lighting.directional.color}
          intensity={config.lighting.directional.intensity}
          position={config.lighting.directional.position}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        >
          {/* Increase shadow camera size for better shadows */}
          <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
        </directionalLight>
      )}
      
      {/* Scene-specific lighting */}
      {useDynamicLights && (
        <spotLight
          ref={spotLightRef}
          position={[5, 10, 2]}
          angle={0.5}
          penumbra={0.8}
          intensity={1.5}
          color={config.lighting.directional?.color || '#ffffff'}
          castShadow
        />
      )}
      
      {/* Hemisphere light for more natural lighting in outdoor scenes */}
      {isGarden && (
        <hemisphereLight
          ref={hemiLightRef}
          color={config.lighting.ambient.color}
          groundColor={config.environment.fogColor || '#554433'}
          intensity={0.7}
        />
      )}
      
      {/* Bake shadows for performance */}
      <BakeShadows />
    </>
  );
}

// Scene Atmosphere effects based on scene type
function SceneAtmosphere({ config }: { config: SceneConfig }) {
  const skyColor = config.environment.skyColor || '#000000';
  const isCosmic = skyColor.toLowerCase().includes('0f') || skyColor.toLowerCase().includes('1a');
  const isUnderwater = skyColor.toLowerCase().includes('468') || skyColor.toLowerCase().includes('5f9');
  
  return (
    <>
      {/* Stars for cosmic scenes */}
      {isCosmic && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}
      
      {/* Clouds for garden scenes */}
      {!isCosmic && !isUnderwater && (
        <>
          <Cloud 
            opacity={0.4} 
            speed={0.3} 
            width={20} 
            depth={1.5} 
            segments={20} 
            position={[0, 15, -15]} 
          />
          <Cloud 
            opacity={0.3} 
            speed={0.2} 
            width={15} 
            depth={1} 
            segments={15} 
            position={[-10, 10, -10]} 
          />
        </>
      )}
      
      {/* Sparkles for underwater and cosmic scenes */}
      {(isUnderwater || isCosmic) && (
        <Sparkles
          count={50}
          scale={20}
          size={4}
          speed={0.3}
          color={config.lighting.directional?.color || '#ffffff'}
        />
      )}
      
      {/* Fog effect */}
      {config.environment.fogColor && (
        <fog
          attach="fog"
          args={[
            config.environment.fogColor,
            10,
            config.environment.fogDensity ? 100 / config.environment.fogDensity : 50
          ]}
        />
      )}
    </>
  );
}

// Post processing effects to enhance visuals
function PostProcessingEffects({ config }: { config: SceneConfig }) {
  // Determine scene type to adjust effects
  const skyColor = config.environment.skyColor || '#000000';
  const isCosmic = skyColor.toLowerCase().includes('0f') || skyColor.toLowerCase().includes('1a');
  const isUnderwater = skyColor.toLowerCase().includes('468') || skyColor.toLowerCase().includes('5f9');
  
  return (
    <EffectComposer>
      {/* Bloom effect for glowing elements */}
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={isUnderwater ? 0.8 : isCosmic ? 1.2 : 0.4}
        blendFunction={BlendFunction.SCREEN}
      />
      
      {/* Depth of field for dreamy effect */}
      <DepthOfField
        focusDistance={0}
        focalLength={isCosmic ? 0.02 : 0.05}
        bokehScale={isUnderwater ? 6 : isCosmic ? 3 : 2}
      />
      
      {/* Vignette for dream-like edge darkening */}
      <Vignette
        offset={0.5}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export default function SceneViewer({ config }: SceneViewerProps) {
  if (!config) {
    return (
      <Canvas style={{ background: '#0a0a0a' }}>
        <ambientLight intensity={0.5} />
        <Stars />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    );
  }
  
  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 75 }}
      style={{ background: config.environment.skyColor || '#0a0a0a' }}
      shadows
    >
      {/* Advanced lighting setup */}
      <SceneLighting config={config} />
      
      {/* Atmospheric effects */}
      <SceneAtmosphere config={config} />
      
      {/* Dream Scene Objects */}
      <DreamScene config={config} />
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Post processing effects */}
      <PostProcessingEffects config={config} />
    </Canvas>
  );
}
