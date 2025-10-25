import axios from 'axios';

interface SceneObject {
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  properties?: Record<string, any>;
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

export class RekaService {
  private apiKey: string;
  private baseUrl = 'https://api.reka.ai/v1';

  constructor() {
    this.apiKey = process.env.REKA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  REKA_API_KEY not set. Using mock responses.');
    }
  }

  /**
   * Generate a 3D scene configuration from a dream description
   */
  async generateSceneConfig(description: string): Promise<SceneConfig> {
    if (!this.apiKey) {
      return this.getMockSceneConfig();
    }

    try {
      const prompt = `You are a 3D scene generator. Given a dream description, generate a JSON configuration for a Three.js scene.

Dream description: "${description}"

Generate a JSON object with this structure:
{
  "objects": [
    {
      "type": "sphere|box|cylinder|cone|torus",
      "position": [x, y, z],
      "rotation": [x, y, z],
      "scale": [x, y, z],
      "color": "#hexcolor",
      "properties": {}
    }
  ],
  "lighting": {
    "ambient": { "color": "#hexcolor", "intensity": 0.0-1.0 },
    "directional": { "color": "#hexcolor", "intensity": 0.0-2.0, "position": [x, y, z] }
  },
  "camera": {
    "position": [x, y, z],
    "lookAt": [x, y, z]
  },
  "environment": {
    "skyColor": "#hexcolor",
    "fogColor": "#hexcolor",
    "fogDensity": 0.0-1.0
  }
}

Create 5-15 objects that represent the dream. Use creative positioning and colors. Respond with ONLY the JSON, no other text.`;

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'reka-core',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse scene configuration from response');
    } catch (error: any) {
      console.error('Reka API error:', error.response?.data || error.message);
      console.log('Falling back to mock scene config');
      return this.getMockSceneConfig();
    }
  }

  /**
   * Generate a poetic summary of the dream
   */
  async generatePoeticSummary(description: string): Promise<string> {
    if (!this.apiKey) {
      return this.getMockPoeticSummary(description);
    }

    try {
      const prompt = `You are a poetic narrator. Transform this dream description into a beautiful, atmospheric narration (2-3 sentences):

"${description}"

Create an evocative, dreamlike narration that captures the essence and mood. Keep it concise and poetic.`;

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'reka-core',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error: any) {
      console.error('Reka API error:', error.response?.data || error.message);
      console.log('Falling back to mock poetic summary');
      return this.getMockPoeticSummary(description);
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
  private getMockPoeticSummary(description: string): string {
    return `In the realm between sleep and waking, where reality bends and dreams take form, you find yourself suspended in an ethereal space. Colors dance and shapes float, each element a fragment of your subconscious, weaving together a tapestry of wonder and mystery.`;
  }
}
