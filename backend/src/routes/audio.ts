import { Router, Request, Response } from 'express';
import multer from 'multer';
import { FishAudioService } from '../services/fishAudio';
import { DeepgramService } from '../services/deepgram';

const router = Router();

// Lazy load services to ensure environment variables are loaded
let fishAudioService: FishAudioService | null = null;
let deepgramService: DeepgramService | null = null;

function getFishAudioService() {
  if (!fishAudioService) {
    fishAudioService = new FishAudioService();
  }
  return fishAudioService;
}

function getDeepgramService() {
  if (!deepgramService) {
    deepgramService = new DeepgramService();
  }
  return deepgramService;
}

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/audio/transcribe
 * Transcribe audio to text
 */
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    console.log('\n' + '🎙️'.repeat(30));
    console.log('📥 AUDIO TRANSCRIPTION ENDPOINT HIT');
    console.log(`   File: ${req.file.originalname}`);
    console.log(`   Size: ${(req.file.size / 1024).toFixed(2)} KB`);
    console.log(`   MIME Type: ${req.file.mimetype}`);
    console.log(`   Service: Deepgram (Nova-2)`);
    console.log('🎙️'.repeat(30));

    // Use Deepgram for transcription (more accurate than Fish Audio)
    const transcription = await getDeepgramService().transcribeAudio(
      req.file.buffer,
      req.file.originalname
    );

    console.log('✅ TRANSCRIPTION ENDPOINT COMPLETE');
    console.log(`   Preview: "${transcription.substring(0, 80)}${transcription.length > 80 ? '...' : ''}"`);
    console.log('🎙️'.repeat(30) + '\n');

    res.json({
      text: transcription,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ ERROR in transcription endpoint:', error);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      details: errorMessage
    });
  }
});

/**
 * POST /api/audio/synthesize
 * Generate speech from text
 */
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Synthesizing speech for:', text.substring(0, 50) + '...');

    const audioUrl = await getFishAudioService().synthesizeSpeech(text, voice);

    res.json({
      audioUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error synthesizing speech:', error);
    res.status(500).json({
      error: 'Failed to synthesize speech',
      details: errorMessage
    });
  }
});

export default router;
