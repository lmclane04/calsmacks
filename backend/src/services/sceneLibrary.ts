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
    const cosmicKeywords = ['star', 'space', 'galaxy', 'nebula', 'planet', 'cosmic', 'universe', 'constellation', 'meteor', 'comet', 'void', 'celestial', 'aurora', 'moon', 'orbit', 'soar', 'soaring', 'flying through space', 'emoji'];

    // Garden keywords
    const gardenKeywords = ['flower', 'tree', 'garden', 'forest', 'leaf', 'petal', 'bloom', 'grass', 'vine', 'stem', 'branch', 'meadow', 'rose', 'lily', 'sunflower', 'tulip', 'lantern', 'small', 'tiny'];

    // Underwater keywords
    const underwaterKeywords = ['ocean', 'sea', 'water', 'fish', 'coral', 'wave', 'underwater', 'deep', 'current', 'bubble', 'kelp', 'reef', 'whale', 'dolphin', 'seaweed', 'swim', 'swimming', 'basketball'];

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
    const text = description.toLowerCase();

    // Check for special keywords
    const hasEmojis = text.includes('emoji');

    if (hasEmojis) {
      // Create playful, emoji-like planets with bright colors and fun features
      const emojiPlanetColors = [
        { base: '#ffeb3b', emissive: '#fdd835' }, // Yellow (happy face emoji)
        { base: '#ff6b9d', emissive: '#ff1744' }, // Pink (heart emoji)
        { base: '#4ecdc4', emissive: '#00acc1' }, // Cyan (water emoji)
        { base: '#9b59b6', emissive: '#7b1fa2' }, // Purple (grape emoji)
        { base: '#ff9800', emissive: '#f57c00' }, // Orange (orange emoji)
        { base: '#4caf50', emissive: '#2e7d32' }, // Green (earth emoji)
        { base: '#f06292', emissive: '#c2185b' }, // Hot pink (flower emoji)
        { base: '#64b5f6', emissive: '#1976d2' }  // Blue (ocean emoji)
      ];

      // Add lots of emoji-like planets scattered around
      for (let i = 0; i < 12; i++) {
        const colorScheme = emojiPlanetColors[i % emojiPlanetColors.length];
        const size = 1.5 + Math.random() * 2; // Varied sizes

        objects.push({
          type: 'sphere',
          position: [
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 25 - 5
          ],
          scale: [size, size, size],
          color: colorScheme.base,
          properties: {
            emissive: colorScheme.emissive,
            emissiveIntensity: 0.6,
            metalness: 0.2,
            roughness: 0.3
          }
        });
      }

      // Add some planets with rings (like Saturn emoji)
      for (let i = 0; i < 3; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 20 - 5;
        const ringColor = ['#ff6b6b', '#4ecdc4', '#ffd93d'][i];

        // Planet
        objects.push({
          type: 'sphere',
          position: [x, y, z],
          scale: [2, 2, 2],
          color: ['#8e44ad', '#3498db', '#e74c3c'][i],
          properties: {
            emissive: ['#6c3483', '#2471a3', '#c0392b'][i],
            emissiveIntensity: 0.5
          }
        });

        // Ring
        objects.push({
          type: 'torus',
          position: [x, y, z],
          rotation: [Math.PI / 3, 0, Math.PI / 6],
          scale: [3.5, 3.5, 3.5],
          color: ringColor,
          properties: {
            transparent: true,
            opacity: 0.7,
            emissive: ringColor,
            emissiveIntensity: 0.4
          }
        });
      }

      // Add bright glowing stars
      for (let i = 0; i < 15; i++) {
        objects.push({
          type: 'sphere',
          position: [
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 30
          ],
          scale: [0.15, 0.15, 0.15],
          color: '#ffffff',
          properties: {
            emissive: ['#ffff00', '#ff00ff', '#00ffff', '#ffffff'][i % 4],
            emissiveIntensity: 2.0
          }
        });
      }
    } else {
      // Regular cosmic scene
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
    }

    return {
      objects,
      lighting: {
        ambient: { color: '#1a1a2e', intensity: hasEmojis ? 0.5 : 0.3 },
        directional: { color: '#4a90e2', intensity: 0.8, position: [5, 10, 10] }
      },
      camera: {
        position: [0, 5, 15],
        lookAt: [0, 0, -5]
      },
      environment: {
        skyColor: hasEmojis ? '#1a1a3e' : '#0f0f23',
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
    const text = description.toLowerCase();

    // Check for special keywords
    const hasLanterns = text.includes('lantern');
    const isSmall = text.includes('small') || text.includes('tiny');

    // Adjust scale multiplier if user feels small (make everything bigger)
    const scaleMultiplier = isSmall ? 2.5 : 1.0;

    // Add ground plane
    objects.push({
      type: 'box',
      position: [0, -2, 0],
      scale: [20 * scaleMultiplier, 0.2, 20 * scaleMultiplier],
      color: '#2d5016',
      properties: { roughness: 0.8 }
    });

    // Add flowers (spheres on stems) - bigger if user is small
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 15 * scaleMultiplier;
      const z = (Math.random() - 0.5) * 15 * scaleMultiplier;

      // Flower stem
      objects.push({
        type: 'cylinder',
        position: [x, -0.5 * scaleMultiplier, z],
        scale: [0.1 * scaleMultiplier, 1.5 * scaleMultiplier, 0.1 * scaleMultiplier],
        color: '#4a7c59'
      });

      // Flower bloom
      objects.push({
        type: 'sphere',
        position: [x, 0.7 * scaleMultiplier, z],
        scale: [0.8 * scaleMultiplier, 0.8 * scaleMultiplier, 0.8 * scaleMultiplier],
        color: ['#ff6b9d', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff3838'][i],
        properties: { roughness: 0.3 }
      });
    }

    // Add trees (cylinders with sphere tops)
    for (let i = 0; i < 3; i++) {
      const x = (Math.random() - 0.5) * 12 * scaleMultiplier;
      const z = (Math.random() - 0.5) * 12 * scaleMultiplier;

      // Tree trunk
      objects.push({
        type: 'cylinder',
        position: [x, 1 * scaleMultiplier, z],
        scale: [0.3 * scaleMultiplier, 3 * scaleMultiplier, 0.3 * scaleMultiplier],
        color: '#8b4513'
      });

      // Tree foliage
      objects.push({
        type: 'sphere',
        position: [x, 3.5 * scaleMultiplier, z],
        scale: [2 * scaleMultiplier, 2 * scaleMultiplier, 2 * scaleMultiplier],
        color: '#228b22',
        properties: { roughness: 0.7 }
      });
    }

    // Add floating lanterns if mentioned
    if (hasLanterns) {
      const lanternColors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da'];
      for (let i = 0; i < 12; i++) {
        const x = (Math.random() - 0.5) * 16 * scaleMultiplier;
        const y = Math.random() * 8 * scaleMultiplier + 1;
        const z = (Math.random() - 0.5) * 16 * scaleMultiplier;
        const color = lanternColors[i % lanternColors.length];

        // Lantern body (box)
        objects.push({
          type: 'box',
          position: [x, y, z],
          scale: [0.6, 0.8, 0.6],
          color: color,
          properties: {
            emissive: color,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.85
          }
        });

        // Lantern glow (sphere inside)
        objects.push({
          type: 'sphere',
          position: [x, y, z],
          scale: [0.4, 0.4, 0.4],
          color: '#ffffff',
          properties: {
            emissive: '#ffffe0',
            emissiveIntensity: 1.2
          }
        });
      }
    } else {
      // Add decorative mushrooms if no lanterns
      for (let i = 0; i < 4; i++) {
        const x = (Math.random() - 0.5) * 10 * scaleMultiplier;
        const z = (Math.random() - 0.5) * 10 * scaleMultiplier;

        objects.push({
          type: 'cylinder',
          position: [x, -1.3 * scaleMultiplier, z],
          scale: [0.1 * scaleMultiplier, 0.4 * scaleMultiplier, 0.1 * scaleMultiplier],
          color: '#f5f5dc'
        });

        objects.push({
          type: 'sphere',
          position: [x, -0.7 * scaleMultiplier, z],
          scale: [0.5 * scaleMultiplier, 0.3 * scaleMultiplier, 0.5 * scaleMultiplier],
          color: '#dc143c',
          properties: { roughness: 0.4 }
        });
      }
    }

    // Adjust camera position based on if user is small
    const cameraHeight = isSmall ? 2 : 8;
    const cameraDistance = isSmall ? 8 : 12;

    return {
      objects,
      lighting: {
        ambient: { color: hasLanterns ? '#4a5568' : '#87ceeb', intensity: hasLanterns ? 0.4 : 0.6 },
        directional: { color: '#ffd700', intensity: hasLanterns ? 0.6 : 1.2, position: [5, 10, 5] }
      },
      camera: {
        position: [0, cameraHeight, cameraDistance],
        lookAt: [0, isSmall ? 0 : 0, 0]
      },
      environment: {
        skyColor: hasLanterns ? '#2d3748' : '#87ceeb',
        fogColor: hasLanterns ? '#4a5568' : '#98fb98',
        fogDensity: 0.005
      }
    };
  }

  /**
   * Generate underwater scene with fish, coral, bubbles
   */
  private static generateUnderwaterScene(description: string): SceneConfig {
    const objects: SceneObject[] = [];
    const text = description.toLowerCase();

    // Check for special keywords
    const hasBasketballs = text.includes('basketball');

    // Add seafloor
    objects.push({
      type: 'box',
      position: [0, -3, 0],
      scale: [25, 0.5, 25],
      color: '#8b7355',
      properties: { roughness: 0.9 }
    });

    if (hasBasketballs) {
      // Add LOTS of basketballs floating around
      for (let i = 0; i < 25; i++) {
        objects.push({
          type: 'sphere',
          position: [
            (Math.random() - 0.5) * 22,
            Math.random() * 10 - 2,
            (Math.random() - 0.5) * 22
          ],
          scale: [1.2, 1.2, 1.2],
          color: '#ff8c00',
          properties: {
            roughness: 0.4,
            metalness: 0.1
          }
        });
      }

      // Add some coral formations (fewer than usual)
      for (let i = 0; i < 3; i++) {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;

        objects.push({
          type: 'cone',
          position: [x, -1.5, z],
          scale: [1, 2, 1],
          color: ['#ff7f50', '#ff6347', '#ffa500'][i],
          properties: { roughness: 0.6 }
        });
      }
    } else {
      // Regular underwater scene
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

    // Add bubbles (more if basketballs)
    const bubbleCount = hasBasketballs ? 20 : 12;
    for (let i = 0; i < bubbleCount; i++) {
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