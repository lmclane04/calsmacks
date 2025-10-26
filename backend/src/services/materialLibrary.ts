import { MaterialProperties } from '../utils/types';

export type MaterialPreset = 
  // Cosmic Materials
  | 'cosmic_star' | 'cosmic_planet' | 'cosmic_nebula' | 'cosmic_crystal' | 'cosmic_ring'
  // Garden Materials  
  | 'garden_flower' | 'garden_leaf' | 'garden_bark' | 'garden_ground' | 'garden_stone'
  // Underwater Materials
  | 'underwater_coral' | 'underwater_fish' | 'underwater_kelp' | 'underwater_water' | 'underwater_sand'
  // Universal Materials
  | 'glass' | 'metal' | 'organic' | 'luminous' | 'ethereal';

export class MaterialLibrary {
  /**
   * Get material properties for a specific preset
   */
  static getMaterial(preset: MaterialPreset): MaterialProperties {
    const materials: Record<MaterialPreset, MaterialProperties> = {
      // Cosmic Materials
      cosmic_star: {
        metalness: 0.1,
        roughness: 0.1,
        emissive: '#ffff88',
        emissiveIntensity: 0.8,
        pulsate: true,
        pulsateSpeed: 2,
        envMapIntensity: 0.5
      },
      
      cosmic_planet: {
        metalness: 0.2,
        roughness: 0.8,
        envMapIntensity: 0.7,
        rotate: true,
        rotateSpeed: [0, 0.002, 0]
      },
      
      cosmic_nebula: {
        metalness: 0,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        emissive: '#9b59b6',
        emissiveIntensity: 0.4,
        float: true,
        floatAmplitude: 0.5,
        floatSpeed: 0.8
      },
      
      cosmic_crystal: {
        metalness: 0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: '#4a90e2',
        emissiveIntensity: 0.3,
        envMapIntensity: 1
      },
      
      cosmic_ring: {
        metalness: 0.8,
        roughness: 0.3,
        transparent: true,
        opacity: 0.7,
        emissive: '#7A288A',
        emissiveIntensity: 0.2,
        rotate: true,
        rotateSpeed: [0, 0.01, 0]
      },
      
      // Garden Materials
      garden_flower: {
        metalness: 0,
        roughness: 0.6,
        emissive: '#ff69b4',
        emissiveIntensity: 0.1,
        float: true,
        floatAmplitude: 0.1,
        floatSpeed: 1.5
      },
      
      garden_leaf: {
        metalness: 0,
        roughness: 0.8,
        transparent: true,
        opacity: 0.9,
        float: true,
        floatAmplitude: 0.05,
        floatSpeed: 0.5
      },
      
      garden_bark: {
        metalness: 0,
        roughness: 0.9,
        envMapIntensity: 0.2
      },
      
      garden_ground: {
        metalness: 0,
        roughness: 1,
        envMapIntensity: 0.1
      },
      
      garden_stone: {
        metalness: 0.1,
        roughness: 0.9,
        envMapIntensity: 0.3
      },
      
      // Underwater Materials
      underwater_coral: {
        metalness: 0,
        roughness: 0.7,
        emissive: '#ff7f50',
        emissiveIntensity: 0.2,
        float: true,
        floatAmplitude: 0.02,
        floatSpeed: 0.3
      },
      
      underwater_fish: {
        metalness: 0.4,
        roughness: 0.2,
        envMapIntensity: 0.8,
        float: true,
        floatAmplitude: 0.3,
        floatSpeed: 2
      },
      
      underwater_kelp: {
        metalness: 0,
        roughness: 0.8,
        transparent: true,
        opacity: 0.9,
        float: true,
        floatAmplitude: 0.8,
        floatSpeed: 0.4
      },
      
      underwater_water: {
        metalness: 0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.3,
        envMapIntensity: 1,
        float: true,
        floatAmplitude: 0.1,
        floatSpeed: 1
      },
      
      underwater_sand: {
        metalness: 0.1,
        roughness: 0.9,
        envMapIntensity: 0.2
      },
      
      // Universal Materials
      glass: {
        metalness: 0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1
      },
      
      metal: {
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1
      },
      
      organic: {
        metalness: 0,
        roughness: 0.8,
        envMapIntensity: 0.3
      },
      
      luminous: {
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#ffffff',
        emissiveIntensity: 0.5,
        pulsate: true,
        pulsateSpeed: 1
      },
      
      ethereal: {
        metalness: 0,
        roughness: 0.2,
        transparent: true,
        opacity: 0.4,
        emissive: '#e6e6fa',
        emissiveIntensity: 0.3,
        float: true,
        floatAmplitude: 0.2,
        floatSpeed: 0.8
      }
    };
    
    return materials[preset];
  }
  
  /**
   * Get a material variant with color override
   */
  static getMaterialWithColor(preset: MaterialPreset, color: string): MaterialProperties {
    const baseMaterial = this.getMaterial(preset);
    
    // For emissive materials, tint the emissive color
    if (baseMaterial.emissive) {
      return {
        ...baseMaterial,
        emissive: color
      };
    }
    
    return baseMaterial;
  }
  
  /**
   * Create dynamic material based on scene context
   */
  static createContextualMaterial(
    sceneType: 'cosmic' | 'garden' | 'underwater',
    objectRole: 'background' | 'midground' | 'foreground' | 'focal' | 'detail',
    objectType: string
  ): MaterialProperties {
    const intensity = this.getIntensityByRole(objectRole);
    
    if (sceneType === 'cosmic') {
      if (objectType === 'sphere' && objectRole === 'focal') {
        return { ...this.getMaterial('cosmic_planet'), emissiveIntensity: intensity };
      }
      if (objectType === 'sphere' && objectRole === 'background') {
        return { ...this.getMaterial('cosmic_star'), emissiveIntensity: intensity * 0.3 };
      }
      if (objectType === 'torus') {
        return { ...this.getMaterial('cosmic_ring'), opacity: intensity };
      }
    }
    
    if (sceneType === 'garden') {
      if (objectType === 'sphere' && objectRole === 'foreground') {
        return { ...this.getMaterial('garden_flower'), emissiveIntensity: intensity };
      }
      if (objectType === 'cylinder') {
        return this.getMaterial('garden_bark');
      }
      if (objectType === 'box' && objectRole === 'background') {
        return this.getMaterial('garden_ground');
      }
    }
    
    if (sceneType === 'underwater') {
      if (objectType === 'cone') {
        return { ...this.getMaterial('underwater_coral'), emissiveIntensity: intensity };
      }
      if (objectType === 'sphere' && objectRole === 'foreground') {
        return { ...this.getMaterial('underwater_fish'), envMapIntensity: intensity };
      }
      if (objectType === 'cylinder') {
        return this.getMaterial('underwater_kelp');
      }
    }
    
    // Fallback to universal materials
    return this.getMaterial('organic');
  }
  
  /**
   * Get intensity modifier based on object role
   */
  private static getIntensityByRole(role: string): number {
    const intensities = {
      focal: 1.0,
      foreground: 0.8,
      midground: 0.6,
      background: 0.4,
      detail: 0.3
    };
    
    return intensities[role as keyof typeof intensities] || 0.5;
  }
}