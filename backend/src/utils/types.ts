export interface SceneObject {
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  properties?: Record<string, any>;
}

export interface SceneConfig {
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

export interface DreamProcessResponse {
  sceneConfig: SceneConfig;
  summary: string;
  narrationUrl: string;
  timestamp: string;
}
