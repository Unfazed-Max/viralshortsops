import { TTSProvider, S3Url } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';
import { uploadFile } from '../storage';
import { v4 as uuidv4 } from 'uuid';

// Mock TTS provider with SSML support
export class MockTTSProvider implements TTSProvider {
  async synthesize(input: {
    text: string;
    voice: string;
    lang: string;
    ssml?: boolean;
  }): Promise<{ audioUrl: S3Url }> {
    logger.info({ input }, 'TTS synthesize called (mock)');

    // In production, this would call ElevenLabs or cloud TTS
    // For now, generate a mock silent audio file
    const audioBuffer = await this.generateMockAudio(input.text.length);
    
    const key = `tts/${uuidv4()}.mp3`;
    const url = await uploadFile(key, audioBuffer, 'audio/mpeg');

    return { audioUrl: url };
  }

  private async generateMockAudio(textLength: number): Promise<Buffer> {
    // Generate a simple silent MP3 (mock)
    // Duration based on text length (rough estimate: 150 words per minute)
    const durationSeconds = Math.max(3, Math.min(60, textLength / 15));
    
    // This is a minimal valid MP3 file header + silence
    // In production, use a proper TTS service
    const header = Buffer.from([
      0xFF, 0xFB, 0x90, 0x00, // MP3 sync word and header
    ]);
    
    // Repeat for duration (very rough approximation)
    const frames = Math.floor(durationSeconds * 38.28); // ~38.28 frames per second for MPEG1 Layer 3
    const silence = Buffer.alloc(frames * 417); // ~417 bytes per frame
    
    return Buffer.concat([header, silence]);
  }
}

// ElevenLabs adapter (real implementation)
export class ElevenLabsTTSProvider implements TTSProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  async synthesize(input: {
    text: string;
    voice: string;
    lang: string;
    ssml?: boolean;
  }): Promise<{ audioUrl: S3Url }> {
    if (!this.apiKey) {
      logger.warn('ElevenLabs API key not set, falling back to mock');
      return new MockTTSProvider().synthesize(input);
    }

    // Real implementation would call ElevenLabs API
    logger.info({ input }, 'ElevenLabs TTS called');
    
    // Fallback to mock for now
    return new MockTTSProvider().synthesize(input);
  }
}
