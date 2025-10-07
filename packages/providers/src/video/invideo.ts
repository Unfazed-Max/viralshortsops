import { VideoProvider, ScriptParts, OverlaySpec, S3Url } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';
import { v4 as uuidv4 } from 'uuid';

// Mock InVideo API adapter
export class InVideoProvider implements VideoProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'mock-invideo-key';
  }

  async createRender(input: {
    script: ScriptParts;
    ttsUrl: string;
    captionsSrt: string;
    overlays?: OverlaySpec[];
    target: { width: number; height: number; fps: number; bitrate: number };
    watermark?: S3Url;
  }): Promise<{ jobId: string }> {
    logger.info({ input }, 'InVideo createRender called (mock)');
    
    // Mock implementation - would call real InVideo API
    const jobId = `invideo_${uuidv4()}`;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { jobId };
  }

  async getStatus(jobId: string): Promise<{
    state: 'queued' | 'running' | 'succeeded' | 'failed';
    outputUrl?: S3Url;
    error?: string;
  }> {
    logger.info({ jobId }, 'InVideo getStatus called (mock)');
    
    // Mock implementation - always return succeeded for demo
    return {
      state: 'succeeded',
      outputUrl: `https://mock-invideo-cdn.com/${jobId}/output.mp4`,
    };
  }
}
