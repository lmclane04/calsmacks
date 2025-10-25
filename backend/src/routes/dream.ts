import { Router, Request, Response } from 'express';
import { RekaService } from '../services/reka';
import { FishAudioService } from '../services/fishAudio';

const router = Router();
const rekaService = new RekaService();
const fishAudioService = new FishAudioService();

/**
 * POST /api/dream/process
 * Process a dream description and generate scene configuration + narration
 */
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    console.log('Processing dream:', description.substring(0, 100) + '...');

    // Step 1: Generate scene configuration using Reka
    const sceneConfig = await rekaService.generateSceneConfig(description);
    console.log('✓ Scene config generated');

    // Step 2: Generate poetic summary using Reka
    const summary = await rekaService.generatePoeticSummary(description);
    console.log('✓ Poetic summary generated');

    // Step 3: Generate narration audio using Fish Audio
    const narrationUrl = await fishAudioService.synthesizeSpeech(summary);
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

    const sceneConfig = await rekaService.generateSceneConfig(description);

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
