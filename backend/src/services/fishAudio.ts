import axios from 'axios';
import FormData from 'form-data';

export class FishAudioService {
  private apiKey: string;
  private baseUrl = 'https://api.fish.audio/v1';

  constructor() {
    this.apiKey = process.env.FISH_AUDIO_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  FISH_AUDIO_API_KEY not set. Using mock responses.');
    }
  }

  /**
   * Transcribe audio to text using Fish Audio ASR
   */
  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    if (!this.apiKey) {
      return this.getMockTranscription();
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBuffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
      });

      const response = await axios.post(
        `${this.baseUrl}/asr`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      return response.data.text || response.data.transcription;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Fish Audio ASR error:', errorMessage);
      console.log('Falling back to mock transcription');
      return this.getMockTranscription();
    }
  }

  /**
   * Synthesize speech from text using Fish Audio TTS
   */
  async synthesizeSpeech(text: string, voiceId?: string): Promise<string> {
    if (!this.apiKey) {
      return this.getMockAudioUrl();
    }

    try {
      // Fish Audio TTS endpoint
      const response = await axios.post(
        `${this.baseUrl}/tts`,
        {
          text,
          temperature: 0.9,
          top_p: 0.9,
          format: 'mp3',
          model: 's1'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      // In production, you'd upload this to cloud storage (S3, etc.)
      // For now, return a base64 data URL
      const base64Audio = Buffer.from(response.data).toString('base64');
      return `data:audio/mp3;base64,${base64Audio}`;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Fish Audio TTS error:', errorMessage);
      console.log('Falling back to mock audio URL');
      return this.getMockAudioUrl();
    }
  }

  /**
   * List available voices
   */
  async listVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    if (!this.apiKey) {
      return this.getMockVoices();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.voices || response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Fish Audio voices error:', errorMessage);
      return this.getMockVoices();
    }
  }

  /**
   * Mock transcription for development/testing
   */
  private getMockTranscription(): string {
    return "I was floating in a purple sky with golden stars all around me. There was a giant crystal tower in the distance, and I could hear soft music playing.";
  }

  /**
   * Mock audio URL for development/testing
   */
  private getMockAudioUrl(): string {
    // Return a placeholder audio URL
    return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  }

  /**
   * Mock voices for development/testing
   */
  private getMockVoices(): Array<{ id: string; name: string; language: string }> {
    return [
      { id: 'default', name: 'Default Voice', language: 'en-US' },
      { id: 'dreamy', name: 'Dreamy Narrator', language: 'en-US' },
      { id: 'ethereal', name: 'Ethereal Voice', language: 'en-US' }
    ];
  }
}
