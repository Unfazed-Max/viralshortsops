import { VideoProvider, ScriptParts, OverlaySpec, S3Url } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';
import { v4 as uuidv4 } from 'uuid';

// Mock Sora API adapter (feature-flagged)
export class SoraProvider implements VideoProvider {
  private enabled: boolean;

  constructor(_apiKey?: string, enabled = false) {
    this.enabled = enabled;
  }

  async createRender(input: {
    script: ScriptParts;
    ttsUrl: string;
    captionsSrt: string;
    overlays?: OverlaySpec[];
    target: { width: number; height: number; fps: number; bitrate: number };
    watermark?: S3Url;
  }): Promise<{ jobId: string }> {
    if (!this.enabled) {
      throw new Error('Sora provider is not enabled. Set ENABLE_SORA=true');
    }

    logger.info({ input }, 'Sora createRender called (mock)');
    
    // Mock implementation - would call real Sora API
    const jobId = `sora_${uuidv4()}`;
    
    return { jobId };
  }

  async getStatus(jobId: string): Promise<{
    state: 'queued' | 'running' | 'succeeded' | 'failed';
    outputUrl?: S3Url;
    error?: string;
  }> {
    if (!this.enabled) {
      throw new Error('Sora provider is not enabled');
    }

    logger.info({ jobId }, 'Sora getStatus called (mock)');
    
    return {
      state: 'succeeded',
      outputUrl: `https://mock-sora-cdn.com/${jobId}/output.mp4`,
    };
  }
}
