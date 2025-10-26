import { Router, Request, Response } from 'express';
import { RekaService } from '../services/reka';
import { GroqService } from '../services/groq';
import { FishAudioService } from '../services/fishAudio';

const router = Router();

// Lazy load services to ensure environment variables are loaded
let rekaService: RekaService | null = null;
let groqService: GroqService | null = null;
let fishAudioService: FishAudioService | null = null;

// Determine which LLM service to use based on environment variable
const USE_GROQ = process.env.USE_GROQ === 'true';

// Log which service will be used on startup with detailed debugging
console.log('='.repeat(60));
console.log('🤖 LLM SERVICE CONFIGURATION');
console.log(`   Environment Variable: USE_GROQ="${process.env.USE_GROQ}"`);
console.log(`   Evaluated to: ${USE_GROQ}`);
console.log(`   Active Service: ${USE_GROQ ? '✓ Groq (Fast)' : '✓ Reka'}`);
console.log('='.repeat(60));

function getLLMService() {
  if (USE_GROQ) {
    if (!groqService) {
      groqService = new GroqService();
      console.log('✓ Groq service initialized');
    }
    return groqService;
  } else {
    if (!rekaService) {
      rekaService = new RekaService();
      console.log('✓ Reka service initialized');
    }
    return rekaService;
  }
}

function getFishAudioService() {
  if (!fishAudioService) {
    fishAudioService = new FishAudioService();
  }
  return fishAudioService;
}

/**
 * POST /api/dream/process
 * Process a dream description and generate scene configuration + narration
 */
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { description, voiceId } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    console.log('\n' + '='.repeat(60));
    console.log('🌙 PROCESSING DREAM REQUEST');
    console.log(`   Description: ${description.substring(0, 100)}...`);
    console.log(`   LLM Service: ${USE_GROQ ? '⚡ Groq (llama-3.3-70b)' : '🔮 Reka (reka-core)'}`);
    console.log('='.repeat(60));

    // Step 1: Generate scene configuration using LLM (Groq or Reka)
    const sceneConfig = await getLLMService().generateSceneConfig(description);
    console.log('✓ Scene config generated');

    // Step 2: Generate poetic summary using LLM (Groq or Reka)
    const summary = await getLLMService().generatePoeticSummary(description);
    console.log('✓ Poetic summary generated');

    // Step 3: Generate narration audio using Fish Audio with optional voiceId
    const narrationUrl = await getFishAudioService().synthesizeSpeech(summary, voiceId);
    console.log('✓ Narration audio generated');

    res.json({
      sceneConfig,
      summary,
      narrationUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing dream:', error);
    res.status(500).json({
      error: 'Failed to process dream',
      details: errorMessage
    });
  }
});

/**
 * POST /api/dream/scene
 * Generate only the scene configuration (no narration)
 */
router.post('/scene', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    const sceneConfig = await getLLMService().generateSceneConfig(description);

    res.json({ sceneConfig });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating scene:', error);
    res.status(500).json({
      error: 'Failed to generate scene',
      details: errorMessage
    });
  }
});

export default router;
