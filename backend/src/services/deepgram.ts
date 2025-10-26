import { createClient, DeepgramClient } from '@deepgram/sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

export class DeepgramService {
  private client: DeepgramClient | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DEEPGRAM_API_KEY || '';
    console.log('='.repeat(60));
    console.log('🎤 DEEPGRAM SERVICE INITIALIZATION');
    console.log(`   API Key Present: ${this.apiKey ? '✅ Yes' : '❌ No'}`);
    if (this.apiKey) {
      this.client = createClient(this.apiKey);
      console.log('   Status: ✅ Deepgram client created successfully');
    } else {
      console.log('   Status: ⚠️  No API key - will use mock transcription');
    }
    console.log('='.repeat(60));
  }

  /**
   * Transcribe audio using Deepgram
   */
  async transcribeAudio(audioBuffer: Buffer, filename: string = 'audio.webm'): Promise<string> {
    console.log('\n' + '='.repeat(60));
    console.log('🎤 DEEPGRAM TRANSCRIPTION REQUEST');
    console.log(`   Filename: ${filename}`);
    console.log(`   Buffer Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   Client Status: ${this.client ? '✅ Active' : '❌ Not initialized'}`);
    console.log('='.repeat(60));

    if (!this.client) {
      console.log('⚠️  No Deepgram client - returning mock transcription');
      return this.getMockTranscription();
    }

    try {
      // Deepgram can work with buffers directly, but we'll use a temp file for reliability
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `deepgram-${Date.now()}-${filename}`);
      
      console.log(`📁 Writing audio to temp file: ${tempFilePath}`);
      // Write buffer to temp file
      fs.writeFileSync(tempFilePath, audioBuffer);

      console.log('🔄 Calling Deepgram API (Nova-2 model)...');
      const startTime = Date.now();

      // Transcribe the audio file
      const { result, error } = await this.client.listen.prerecorded.transcribeFile(
        fs.createReadStream(tempFilePath),
        {
          model: 'nova-2',
          smart_format: true,
          punctuate: true,
          diarize: false,
          language: 'en',
        }
      );

      const duration = Date.now() - startTime;
      console.log(`⏱️  Deepgram API response time: ${duration}ms`);

      // Clean up temp file
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️  Temp file cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️  Failed to cleanup temp file:', cleanupError);
      }

      if (error) {
        throw new Error(`Deepgram error: ${error.message}`);
      }

      // Extract transcription text
      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      
      if (!transcript) {
        throw new Error('No transcription returned from Deepgram');
      }

      console.log('✅ DEEPGRAM TRANSCRIPTION SUCCESS');
      console.log(`   Result: "${transcript}"`);
      console.log(`   Length: ${transcript.length} characters`);
      console.log('='.repeat(60) + '\n');
      
      return transcript;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Deepgram transcription error:', errorMessage);
      console.log('Falling back to mock transcription');
      return this.getMockTranscription();
    }
  }

  /**
   * Transcribe audio from URL
   */
  async transcribeAudioUrl(audioUrl: string): Promise<string> {
    if (!this.client) {
      return this.getMockTranscription();
    }

    try {
      console.log('🎤 Transcribing audio from URL with Deepgram...');

      const { result, error } = await this.client.listen.prerecorded.transcribeUrl(
        { url: audioUrl },
        {
          model: 'nova-2',
          smart_format: true,
          punctuate: true,
          diarize: false,
          language: 'en',
        }
      );

      if (error) {
        throw new Error(`Deepgram error: ${error.message}`);
      }

      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      
      if (!transcript) {
        throw new Error('No transcription returned from Deepgram');
      }

      console.log('✓ Deepgram transcription successful');
      return transcript;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Deepgram transcription error:', errorMessage);
      console.log('Falling back to mock transcription');
      return this.getMockTranscription();
    }
  }

  /**
   * Mock transcription for development/testing
   */
  private getMockTranscription(): string {
    return 'I was floating in a purple sky with golden stars all around me.';
  }
}
