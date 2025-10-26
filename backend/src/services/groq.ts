import Groq from 'groq-sdk';
import { SceneLibrary, SceneType } from './sceneLibrary';

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

export class GroqService {
  private client: Groq | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    if (this.apiKey) {
      this.client = new Groq({ apiKey: this.apiKey });
      console.log('✅ Groq API initialized with API key');
    } else {
      console.warn('⚠️  GROQ_API_KEY not set. Using mock responses.');
    }
  }

  /**
   * Generate a 3D scene configuration from a dream description using curated scene types
   */
  async generateSceneConfig(description: string): Promise<SceneConfig> {
    try {
      console.log(`🎯 CURATED SCENE GENERATION`);
      console.log(`   Input: "${description.substring(0, 80)}..."`);
      
      // Step 1: Classify the scene type
      const sceneType = SceneLibrary.classifyScene(description);
      console.log(`   Classified as: ${sceneType.toUpperCase()} scene`);
      
      // Step 2: Generate curated scene
      const sceneConfig = SceneLibrary.generateCuratedScene(sceneType, description);
      console.log(`   Generated ${sceneConfig.objects.length} curated objects`);
      
      // Step 3: Use AI to add creative variations if API is available
      if (this.client) {
        try {
          const enhancedConfig = await this.enhanceSceneWithAI(sceneConfig, sceneType, description);
          console.log(`   ✨ Enhanced with AI variations`);
          return enhancedConfig;
        } catch (error) {
          console.log(`   ⚠️  AI enhancement failed, using base curated scene`);
          return sceneConfig;
        }
      }
      
      return sceneConfig;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Scene generation error:', errorMessage);
      console.log('Falling back to mock scene config');
      return this.getMockSceneConfig();
    }
  }

  /**
   * Use AI to add creative variations to the curated scene
   */
  private async enhanceSceneWithAI(baseConfig: SceneConfig, sceneType: SceneType, description: string): Promise<SceneConfig> {
    if (!this.client) return baseConfig;

    const scenePrompts = {
      cosmic: `You are enhancing a cosmic scene. The base scene has planets, stars, and celestial objects. Add 2-3 creative variations based on: "${description}"
      
Available cosmic elements: nebula wisps (torus), asteroid belt (small spheres), cosmic rings (torus), glowing orbs (sphere with emissive), space crystals (cone/cylinder).`,
      
      garden: `You are enhancing a garden scene. The base scene has flowers, trees, and mushrooms. Add 2-3 creative variations based on: "${description}"
      
Available garden elements: butterfly paths (small moving spheres), garden stones (sphere), fountain center (cylinder), flower petals (small spheres), hanging fruits (sphere).`,
      
      underwater: `You are enhancing an underwater scene. The base scene has fish, coral, and kelp. Add 2-3 creative variations based on: "${description}"
      
Available underwater elements: treasure chest (box), sea anemone (cone), school of fish (multiple small spheres), water currents (cylinder), sea shells (cone).`
    };

    const prompt = `${scenePrompts[sceneType]}

Add ONLY 2-3 objects in this JSON format:
[
  {
    "type": "sphere|box|cylinder|cone|torus",
    "position": [x, y, z],
    "scale": [x, y, z],
    "color": "#hexcolor",
    "properties": {}
  }
]

Respond with ONLY the JSON array of new objects.`;

    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const newObjects = JSON.parse(jsonMatch[0]);
      return {
        ...baseConfig,
        objects: [...baseConfig.objects, ...newObjects]
      };
    }

    return baseConfig;
  }

  /**
   * Generate a poetic summary of the dream using Groq
   */
  async generatePoeticSummary(description: string): Promise<string> {
    if (!this.client) {
      return this.getMockPoeticSummary();
    }

    try {
      const prompt = `You are a poetic narrator. Transform this dream description into a beautiful, atmospheric narration (2-3 sentences):

"${description}"

Create an evocative, dreamlike narration that captures the essence and mood. Keep it concise and poetic.`;

      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content?.trim() || this.getMockPoeticSummary();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Groq API error:', errorMessage);
      console.log('Falling back to mock poetic summary');
      return this.getMockPoeticSummary();
    }
  }

  /**
   * Mock scene configuration for development/testing
   */
  private getMockSceneConfig(): SceneConfig {
    return {
      objects: [
        {
          type: 'sphere',
          position: [0, 2, 0],
          scale: [2, 2, 2],
          color: '#9b59b6'
        },
        {
          type: 'box',
          position: [-3, 0, -2],
          rotation: [0, Math.PI / 4, 0],
          scale: [1, 1, 1],
          color: '#3498db'
        },
        {
          type: 'torus',
          position: [3, 1, -1],
          rotation: [Math.PI / 2, 0, 0],
          scale: [1.5, 1.5, 1.5],
          color: '#f39c12'
        },
        {
          type: 'cone',
          position: [0, -1, -3],
          scale: [1, 2, 1],
          color: '#e74c3c'
        },
        {
          type: 'cylinder',
          position: [-2, 0, 2],
          scale: [0.5, 3, 0.5],
          color: '#2ecc71'
        }
      ],
      lighting: {
        ambient: { color: '#404040', intensity: 0.5 },
        directional: { color: '#ffffff', intensity: 1.0, position: [5, 10, 5] }
      },
      camera: {
        position: [0, 3, 10],
        lookAt: [0, 0, 0]
      },
      environment: {
        skyColor: '#1a1a2e',
        fogColor: '#16213e',
        fogDensity: 0.02
      }
    };
  }

  /**
   * Mock poetic summary for development/testing
   */
  private getMockPoeticSummary(): string {
    return `In the realm between sleep and waking, where reality bends and dreams take form, you find yourself suspended in an ethereal space. Colors dance and shapes float, each element a fragment of your subconscious, weaving together a tapestry of wonder and mystery.`;
  }
}
