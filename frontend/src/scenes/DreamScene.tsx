import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneConfig, SceneObject } from '../types';

interface DreamSceneProps {
  config: SceneConfig;
}

function SceneObjectComponent({ obj }: { obj: SceneObject }) {
  const meshRef = useRef<Mesh>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = obj.position[1] + Math.sin(state.clock.elapsedTime + obj.position[0]) * 0.1;
    }
  });

  const position = obj.position;
  const rotation = obj.rotation || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const color = obj.color || '#ffffff';

  const renderGeometry = () => {
    switch (obj.type) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 100]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      {renderGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function DreamScene({ config }: DreamSceneProps) {
  return (
    <group>
      {config.objects.map((obj, index) => (
        <SceneObjectComponent key={index} obj={obj} />
      ))}
    </group>
  );
}
