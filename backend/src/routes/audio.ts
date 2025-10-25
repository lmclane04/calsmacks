import { Router, Request, Response } from 'express';
import multer from 'multer';
import { FishAudioService } from '../services/fishAudio';

const router = Router();
const fishAudioService = new FishAudioService();

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

    console.log('Transcribing audio:', req.file.originalname);

    const transcription = await fishAudioService.transcribeAudio(req.file.buffer);

    res.json({
      text: transcription,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error transcribing audio:', error);
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

    const audioUrl = await fishAudioService.synthesizeSpeech(text, voice);

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
