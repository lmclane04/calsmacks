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

export type SceneType = 'cosmic' | 'garden' | 'underwater' | 'lantern' | 'jellyfish' | 'glass';

export class SceneLibrary {
  /**
   * Classify dream description into scene type
   */
  static classifyScene(description: string): SceneType {
    const text = description.toLowerCase();
    
    // Check for specific dream types from examples first
    if (text.includes('lantern') && (text.includes('garden') || text.includes('tree'))) {
      return 'lantern';
    }
    
    if (text.includes('jellyfish') && (text.includes('underwater') || text.includes('cave'))) {
      return 'jellyfish';
    }
    
    if (text.includes('glass') && text.includes('planet') && text.includes('space')) {
      return 'glass';
    }
    
    // General keywords for broader categories
    const cosmicKeywords = ['star', 'space', 'galaxy', 'nebula', 'planet', 'cosmic', 'universe', 'constellation', 
      'meteor', 'comet', 'void', 'celestial', 'aurora', 'moon', 'orbit', 'astral', 'light'];
    
    // Garden keywords  
    const gardenKeywords = ['flower', 'tree', 'garden', 'forest', 'leaf', 'petal', 'bloom', 'grass', 'vine', 
      'stem', 'branch', 'meadow', 'rose', 'lily', 'sunflower', 'tulip', 'lantern', 'floating', 'nature'];
    
    // Underwater keywords
    const underwaterKeywords = ['ocean', 'sea', 'water', 'fish', 'coral', 'wave', 'underwater', 'deep', 'current', 
      'bubble', 'kelp', 'reef', 'whale', 'dolphin', 'seaweed', 'jellyfish', 'pulsing', 'bioluminescent', 'glow'];
    
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
      // Special scenes from sample prompts
      case 'lantern':
        return this.generateLanternGardenScene(description);
      case 'jellyfish':
        return this.generateJellyfishCaveScene(description);
      case 'glass':
        return this.generateGlassPlanetScene(description);
      default:
        return this.generateCosmicScene(description);
    }
  }

  /**
   * Generate cosmic scene with stars, planets, nebulae
   */
  // Generate scene specifically for the "Garden Dream" prompt with floating lanterns
  private static generateLanternGardenScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add ground plane
    objects.push({
      type: 'box',
      position: [0, -2, 0],
      scale: [25, 0.2, 25],
      color: '#243010',
      properties: { roughness: 0.8 }
    });
    
    // Add trees
    for (let i = 0; i < 7; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      // Tree trunk
      objects.push({
        type: 'cylinder',
        position: [x, 1, z],
        scale: [0.4, 5, 0.4],
        color: '#3d2817',
        properties: { roughness: 0.9 }
      });
      
      // Tree foliage
      objects.push({
        type: 'sphere',
        position: [x, 4.5, z],
        scale: [2.5, 3, 2.5],
        color: '#114322',
        properties: { roughness: 0.7 }
      });
    }
    
    // Add floating lanterns with specific properties for trails
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = Math.random() * 5 + 2; // Varying heights
      const z = (Math.random() - 0.5) * 18;
      
      // Lantern body
      objects.push({
        type: 'sphere',
        position: [x, y, z],
        scale: [0.7, 1, 0.7],
        color: ['#ff9c41', '#ffc641', '#ff7c41', '#ffe141'][Math.floor(Math.random() * 4)],
        properties: { 
          emissive: '#ff5e00', 
          emissiveIntensity: 0.8,
          hasTrail: true,
          hasParticles: true
        }
      });
    }
    
    // Add path
    for (let i = -10; i < 10; i += 1) {
      objects.push({
        type: 'box',
        position: [i, -1.9, i*0.5],
        scale: [1, 0.05, 1],
        color: '#85714e',
        properties: { roughness: 1.0 }
      });
    }
    
    // Add decorative flowers
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      objects.push({
        type: 'sphere',
        position: [x, -1.2, z],
        scale: [0.3, 0.3, 0.3],
        color: ['#ff4081', '#e040fb', '#7c4dff', '#ff5252', '#ffeb3b'][Math.floor(Math.random() * 5)],
        properties: { roughness: 0.3 }
      });
    }
    
    return {
      objects,
      lighting: {
        ambient: { color: '#3b2f4a', intensity: 0.4 },
        directional: { color: '#fffbe8', intensity: 0.8, position: [5, 8, 5] }
      },
      camera: {
        position: [0, 6, 15],
        lookAt: [0, 3, 0]
      },
      environment: {
        skyColor: '#12131e',
        fogColor: '#2e284a',
        fogDensity: 0.02
      }
    };
  }
  
  // Generate scene specifically for the "Underwater Dream" prompt with glowing jellyfish
  private static generateJellyfishCaveScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add cave walls (surrounding cylinders)
    objects.push({
      type: 'cylinder',
      position: [0, 0, 0],
      scale: [25, 20, 25],
      rotation: [0, 0, 0],
      color: '#162037',
      properties: { 
        roughness: 1.0,
        side: 'back' // Display on the inside only
      }
    });
    
    // Add cave floor
    objects.push({
      type: 'box',
      position: [0, -9.5, 0],
      scale: [40, 1, 40],
      color: '#0a1625',
      properties: { roughness: 0.9 }
    });
    
    // Add cave ceiling with stalactites
    objects.push({
      type: 'box',
      position: [0, 10, 0],
      scale: [40, 1, 40],
      color: '#0a1625',
      properties: { roughness: 0.9 }
    });
    
    // Add stalactites
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const height = Math.random() * 3 + 2;
      
      objects.push({
        type: 'cone',
        position: [x, 8.5 - height/2, z],
        scale: [0.5, height, 0.5],
        rotation: [Math.PI, 0, 0], // Flip the cone
        color: '#19293b',
        properties: { roughness: 0.9 }
      });
    }
    
    // Add stalagmites
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const height = Math.random() * 3 + 1.5;
      
      objects.push({
        type: 'cone',
        position: [x, -9 + height/2, z],
        scale: [0.6, height, 0.6],
        color: '#19293b',
        properties: { roughness: 0.9 }
      });
    }
    
    // Add jellyfish with glowing properties
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = Math.random() * 14 - 4;
      const z = (Math.random() - 0.5) * 18;
      const size = Math.random() * 0.6 + 0.4;
      
      // Jellyfish dome
      objects.push({
        type: 'sphere',
        position: [x, y, z],
        scale: [size, size*0.7, size],
        color: ['#4cc9f0', '#4895ef', '#4361ee', '#3f37c9', '#f72585'][Math.floor(Math.random() * 5)],
        properties: { 
          emissive: '#4cc9f0',
          emissiveIntensity: 1.0,
          transparent: true,
          opacity: 0.8,
          hasTrail: true,
          hasParticles: true
        }
      });
      
      // Jellyfish tentacles (multiple small cylinders)
      const tentacleCount = Math.floor(Math.random() * 3) + 3;
      for (let j = 0; j < tentacleCount; j++) {
        const angle = (j / tentacleCount) * Math.PI * 2;
        const tx = x + Math.cos(angle) * size * 0.4;
        const tz = z + Math.sin(angle) * size * 0.4;
        const tentacleLength = size * (Math.random() * 0.5 + 0.8);
        
        objects.push({
          type: 'cylinder',
          position: [tx, y - tentacleLength/2, tz],
          scale: [size*0.05, tentacleLength, size*0.05],
          color: ['#4cc9f0', '#4895ef', '#4361ee'][Math.floor(Math.random() * 3)],
          properties: { 
            transparent: true,
            opacity: 0.6
          }
        });
      }
    }
    
    // Add underwater rocks
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const size = Math.random() * 1.5 + 0.5;
      
      objects.push({
        type: 'sphere',
        position: [x, -8, z],
        scale: [size, size*0.6, size],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: '#243b47',
        properties: { roughness: 1.0 }
      });
    }
    
    return {
      objects,
      lighting: {
        ambient: { color: '#0a3a64', intensity: 0.3 },
        directional: { color: '#4cc9f0', intensity: 0.5, position: [0, 5, 5] }
      },
      camera: {
        position: [0, 0, 15],
        lookAt: [0, 0, 0]
      },
      environment: {
        skyColor: '#0a1625',
        fogColor: '#0a2540',
        fogDensity: 0.04
      }
    };
  }
  
  // Generate scene specifically for the "Space Dream" prompt with glass planets
  private static generateGlassPlanetScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    
    // Add central glass planet
    objects.push({
      type: 'sphere',
      position: [0, 0, -5],
      scale: [4, 4, 4],
      color: '#a7c5eb',
      properties: { 
        transparent: true, 
        opacity: 0.6, 
        refractionRatio: 0.98, 
        reflectivity: 1,
        emissive: '#a7c5eb',
        emissiveIntensity: 0.2,
        hasParticles: true
      }
    });
    
    // Add smaller glass planets
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const radius = 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = Math.random() * 1.5 + 0.8;
      
      objects.push({
        type: 'sphere',
        position: [x, (Math.random() - 0.5) * 6, z],
        scale: [size, size, size],
        color: ['#88c6db', '#c0fdff', '#a0ced9', '#97d8ec', '#acd8aa'][i],
        properties: { 
          transparent: true, 
          opacity: 0.7, 
          refractionRatio: 0.95,
          hasParticles: true 
        }
      });
    }
    
    // Add rings of light around planets
    for (let i = 0; i < 3; i++) {
      const ringScale = i * 1.2 + 5;
      objects.push({
        type: 'torus',
        position: [0, 0, -5],
        rotation: [Math.PI/3 * i, Math.PI/4, 0],
        scale: [ringScale, ringScale, 0.1],
        color: ['#ffcc00', '#ff5e5b', '#d65bd1'][i],
        properties: { 
          transparent: true, 
          opacity: 0.4, 
          emissive: ['#ffcc00', '#ff5e5b', '#d65bd1'][i],
          emissiveIntensity: 0.8,
          hasTrail: true
        }
      });
    }
    
    // Add smaller rings of light around outer planets
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const radius = 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 6;
      const size = Math.random() * 1.5 + 1;
      
      objects.push({
        type: 'torus',
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: [size, size, 0.05],
        color: ['#84dfff', '#91f5ad', '#fdffab', '#ffd3ba', '#fca3cc'][i],
        properties: { 
          transparent: true, 
          opacity: 0.5, 
          emissive: ['#84dfff', '#91f5ad', '#fdffab', '#ffd3ba', '#fca3cc'][i],
          emissiveIntensity: 0.6
        }
      });
    }
    
    // Add distant stars
    for (let i = 0; i < 20; i++) {
      objects.push({
        type: 'sphere',
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 40
        ],
        scale: [0.1, 0.1, 0.1],
        color: '#ffffff',
        properties: { emissive: '#ffffff', emissiveIntensity: 1 }
      });
    }
    
    return {
      objects,
      lighting: {
        ambient: { color: '#050c24', intensity: 0.2 },
        directional: { color: '#ffffff', intensity: 0.6, position: [10, 10, 10] }
      },
      camera: {
        position: [0, 0, 20],
        lookAt: [0, 0, 0]
      },
      environment: {
        skyColor: '#000000',
        fogColor: '#050a1c',
        fogDensity: 0.01
      }
    };
  }

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