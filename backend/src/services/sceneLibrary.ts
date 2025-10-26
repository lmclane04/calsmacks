interface SceneObject {
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  properties?: Record<string, unknown>;
}

interface SceneConfig {
  objects: SceneObject[];
  lighting: {
    ambient: { color: string; intensity: number };
    directional?: { color: string; intensity: number; position: [number, number, number] };
  };
  camera: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
  environment: {
    skyColor?: string;
    fogColor?: string;
    fogDensity?: number;
  };
}

export type SceneType = 'cosmic' | 'garden' | 'underwater';

export class SceneLibrary {
  /**
   * Classify dream description into scene type
   */
  static classifyScene(description: string): SceneType {
    const text = description.toLowerCase();
    
    // Cosmic keywords
    const cosmicKeywords = ['star', 'space', 'galaxy', 'nebula', 'planet', 'cosmic', 'universe', 'constellation', 'meteor', 'comet', 'void', 'celestial', 'aurora', 'moon', 'orbit'];
    
    // Garden keywords  
    const gardenKeywords = ['flower', 'tree', 'garden', 'forest', 'leaf', 'petal', 'bloom', 'grass', 'vine', 'stem', 'branch', 'meadow', 'rose', 'lily', 'sunflower', 'tulip'];
    
    // Underwater keywords
    const underwaterKeywords = ['ocean', 'sea', 'water', 'fish', 'coral', 'wave', 'underwater', 'deep', 'current', 'bubble', 'kelp', 'reef', 'whale', 'dolphin', 'seaweed'];
    
    const cosmicScore = cosmicKeywords.filter(word => text.includes(word)).length;
    const gardenScore = gardenKeywords.filter(word => text.includes(word)).length;
    const underwaterScore = underwaterKeywords.filter(word => text.includes(word)).length;
    
    if (cosmicScore >= gardenScore && cosmicScore >= underwaterScore) return 'cosmic';
    if (gardenScore >= underwaterScore) return 'garden';
    return 'underwater';
  }

  /**
   * Generate curated scene configuration based on scene type
   */
  static generateCuratedScene(sceneType: SceneType, description: string): SceneConfig {
    switch (sceneType) {
      case 'cosmic':
        return this.generateCosmicScene(description);
      case 'garden':
        return this.generateGardenScene(description);
      case 'underwater':
        return this.generateUnderwaterScene(description);
      default:
        return this.generateCosmicScene(description);
    }
  }

  /**
   * Generate cosmic scene with stars, planets, nebulae
   */
  private static generateCosmicScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add central celestial body
    objects.push({
      type: 'sphere',
      position: [0, 0, -5],
      scale: [3, 3, 3],
      color: '#4a90e2',
      properties: { emissive: '#1a4480', metalness: 0.8 }
    });
    
    // Add scattered stars
    for (let i = 0; i < 8; i++) {
      objects.push({
        type: 'sphere',
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 20
        ],
        scale: [0.1, 0.1, 0.1],
        color: '#ffffff',
        properties: { emissive: '#ffff88' }
      });
    }
    
    // Add orbiting objects
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const radius = 8 + i * 2;
      objects.push({
        type: 'sphere',
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * 2,
          Math.sin(angle) * radius
        ],
        scale: [0.8, 0.8, 0.8],
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1'][i],
        properties: { metalness: 0.9 }
      });
    }
    
    // Add cosmic rings/torus
    objects.push({
      type: 'torus',
      position: [0, 0, -5],
      rotation: [Math.PI / 4, 0, Math.PI / 6],
      scale: [5, 5, 5],
      color: '#9b59b6',
      properties: { transparent: true, opacity: 0.6 }
    });
    
    return {
      objects,
      lighting: {
        ambient: { color: '#1a1a2e', intensity: 0.3 },
        directional: { color: '#4a90e2', intensity: 0.8, position: [5, 10, 10] }
      },
      camera: {
        position: [0, 5, 15],
        lookAt: [0, 0, -5]
      },
      environment: {
        skyColor: '#0f0f23',
        fogColor: '#1a1a2e',
        fogDensity: 0.01
      }
    };
  }

  /**
   * Generate garden scene with flowers, trees, nature elements
   */
  private static generateGardenScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add ground plane
    objects.push({
      type: 'box',
      position: [0, -2, 0],
      scale: [20, 0.2, 20],
      color: '#2d5016',
      properties: { roughness: 0.8 }
    });
    
    // Add flowers (spheres on stems)
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      
      // Flower stem
      objects.push({
        type: 'cylinder',
        position: [x, -0.5, z],
        scale: [0.1, 1.5, 0.1],
        color: '#4a7c59'
      });
      
      // Flower bloom
      objects.push({
        type: 'sphere',
        position: [x, 0.7, z],
        scale: [0.8, 0.8, 0.8],
        color: ['#ff6b9d', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff3838'][i],
        properties: { roughness: 0.3 }
      });
    }
    
    // Add trees (cylinders with sphere tops)
    for (let i = 0; i < 3; i++) {
      const x = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;
      
      // Tree trunk
      objects.push({
        type: 'cylinder',
        position: [x, 1, z],
        scale: [0.3, 3, 0.3],
        color: '#8b4513'
      });
      
      // Tree foliage
      objects.push({
        type: 'sphere',
        position: [x, 3.5, z],
        scale: [2, 2, 2],
        color: '#228b22',
        properties: { roughness: 0.7 }
      });
    }
    
    // Add decorative mushrooms
    for (let i = 0; i < 4; i++) {
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      
      objects.push({
        type: 'cylinder',
        position: [x, -1.3, z],
        scale: [0.1, 0.4, 0.1],
        color: '#f5f5dc'
      });
      
      objects.push({
        type: 'sphere',
        position: [x, -0.7, z],
        scale: [0.5, 0.3, 0.5],
        color: '#dc143c',
        properties: { roughness: 0.4 }
      });
    }
    
    return {
      objects,
      lighting: {
        ambient: { color: '#87ceeb', intensity: 0.6 },
        directional: { color: '#ffd700', intensity: 1.2, position: [5, 10, 5] }
      },
      camera: {
        position: [0, 8, 12],
        lookAt: [0, 0, 0]
      },
      environment: {
        skyColor: '#87ceeb',
        fogColor: '#98fb98',
        fogDensity: 0.005
      }
    };
  }

  /**
   * Generate underwater scene with fish, coral, bubbles
   */
  private static generateUnderwaterScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add seafloor
    objects.push({
      type: 'box',
      position: [0, -3, 0],
      scale: [25, 0.5, 25],
      color: '#8b7355',
      properties: { roughness: 0.9 }
    });
    
    // Add coral formations
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      objects.push({
        type: 'cone',
        position: [x, -1.5, z],
        scale: [1, 2, 1],
        color: ['#ff7f50', '#ff6347', '#ffa500', '#ff1493', '#da70d6'][i],
        properties: { roughness: 0.6 }
      });
    }
    
    // Add kelp (tall cylinders)
    for (let i = 0; i < 4; i++) {
      const x = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      
      objects.push({
        type: 'cylinder',
        position: [x, 1, z],
        scale: [0.2, 6, 0.2],
        color: '#556b2f',
        properties: { roughness: 0.8 }
      });
    }
    
    // Add fish (ellipsoid shapes)
    for (let i = 0; i < 8; i++) {
      objects.push({
        type: 'sphere',
        position: [
          (Math.random() - 0.5) * 18,
          Math.random() * 6 - 1,
          (Math.random() - 0.5) * 18
        ],
        scale: [1.2, 0.6, 0.4],
        color: ['#ff6b35', '#f7931e', '#40e0d0', '#ff69b4', '#9370db', '#00ced1', '#32cd32', '#ff4500'][i],
        properties: { metalness: 0.5, roughness: 0.2 }
      });
    }
    
    // Add bubbles
    for (let i = 0; i < 12; i++) {
      objects.push({
        type: 'sphere',
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 8,
          (Math.random() - 0.5) * 20
        ],
        scale: [0.2, 0.2, 0.2],
        color: '#ffffff',
        properties: { transparent: true, opacity: 0.3 }
      });
    }
    
    // Add sea rocks
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 18;
      
      objects.push({
        type: 'sphere',
        position: [x, -2.2, z],
        scale: [1.5, 1, 1.5],
        color: '#696969',
        properties: { roughness: 0.9 }
      });
    }
    
    return {
      objects,
      lighting: {
        ambient: { color: '#4682b4', intensity: 0.7 },
        directional: { color: '#87ceeb', intensity: 0.9, position: [2, 8, 3] }
      },
      camera: {
        position: [0, 3, 15],
        lookAt: [0, 0, 0]
      },
      environment: {
        skyColor: '#4682b4',
        fogColor: '#5f9ea0',
        fogDensity: 0.02
      }
    };
  }
}