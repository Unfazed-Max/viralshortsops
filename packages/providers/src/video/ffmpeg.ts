import ffmpeg from 'fluent-ffmpeg';
import { VideoProvider, ScriptParts, OverlaySpec, S3Url } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';
import { uploadFile, getSignedDownloadUrl } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface RenderJob {
  jobId: string;
  state: 'queued' | 'running' | 'succeeded' | 'failed';
  outputUrl?: string;
  error?: string;
}

const jobs = new Map<string, RenderJob>();

export class FFMPEGVideoProvider implements VideoProvider {
  async createRender(input: {
    script: ScriptParts;
    ttsUrl: string;
    captionsSrt: string;
    overlays?: OverlaySpec[];
    target: { width: number; height: number; fps: number; bitrate: number };
    watermark?: S3Url;
  }): Promise<{ jobId: string }> {
    const jobId = uuidv4();
    
    jobs.set(jobId, { jobId, state: 'queued' });
    
    // Process asynchronously
    this.processRender(jobId, input).catch((error) => {
      logger.error({ error, jobId }, 'Render failed');
      jobs.set(jobId, {
        jobId,
        state: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
    
    return { jobId };
  }

  async getStatus(jobId: string): Promise<{
    state: 'queued' | 'running' | 'succeeded' | 'failed';
    outputUrl?: S3Url;
    error?: string;
  }> {
    const job = jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    return {
      state: job.state,
      outputUrl: job.outputUrl,
      error: job.error,
    };
  }

  private async processRender(
    jobId: string,
    input: {
      script: ScriptParts;
      ttsUrl: string;
      captionsSrt: string;
      overlays?: OverlaySpec[];
      target: { width: number; height: number; fps: number; bitrate: number };
      watermark?: S3Url;
    }
  ): Promise<void> {
    jobs.set(jobId, { jobId, state: 'running' });

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ffmpeg-'));
    
    try {
      // Download TTS audio
      const audioPath = path.join(tmpDir, 'audio.mp3');
      const audioUrl = await getSignedDownloadUrl(this.extractS3Key(input.ttsUrl));
      await this.downloadFile(audioUrl, audioPath);

      // Create SRT file
      const srtPath = path.join(tmpDir, 'captions.srt');
      await fs.writeFile(srtPath, input.captionsSrt);

      // Generate background (solid color or stock clip placeholder)
      const bgVideoPath = path.join(tmpDir, 'background.mp4');
      await this.createBackgroundVideo(
        bgVideoPath,
        input.target.width,
        input.target.height,
        input.target.fps,
        10 // duration in seconds
      );

      // Output path
      const outputPath = path.join(tmpDir, 'output.mp4');

      // Build FFMPEG command
      await new Promise<void>((resolve, reject) => {
        let command = ffmpeg()
          .input(bgVideoPath)
          .input(audioPath)
          .complexFilter([
            // Subtitles with styling
            {
              filter: 'subtitles',
              options: {
                filename: srtPath.replace(/\\/g, '/').replace(/:/g, '\\:'),
                force_style: 'Fontsize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=50,Alignment=2',
              },
              outputs: 'subtitled',
            },
          ])
          .outputOptions([
            '-map', '[subtitled]',
            '-map', '1:a',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-b:v', `${input.target.bitrate}`,
            '-maxrate', `${input.target.bitrate}`,
            '-bufsize', `${input.target.bitrate * 2}`,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-ar', '44100',
            '-af', 'loudnorm=I=-14:LRA=11:TP=-1.5', // Loudness normalization
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
          ])
          .fps(input.target.fps)
          .size(`${input.target.width}x${input.target.height}`)
          .output(outputPath);

        command
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      });

      // Upload to S3
      const fileBuffer = await fs.readFile(outputPath);
      const s3Key = `renders/${jobId}/output.mp4`;
      await uploadFile(s3Key, fileBuffer, 'video/mp4');
      const outputUrl = await getSignedDownloadUrl(s3Key, 86400); // 24 hour expiry

      jobs.set(jobId, { jobId, state: 'succeeded', outputUrl });
      
      logger.info({ jobId, outputUrl }, 'Render completed');
    } catch (error) {
      logger.error({ error, jobId }, 'Render processing error');
      throw error;
    } finally {
      // Cleanup
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  private async createBackgroundVideo(
    outputPath: string,
    width: number,
    height: number,
    fps: number,
    duration: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(`color=c=0x1a1a1a:s=${width}x${height}:d=${duration}:r=${fps}`)
        .inputFormat('lavfi')
        .outputOptions(['-pix_fmt', 'yuv420p'])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  private async downloadFile(url: string, outputPath: string): Promise<void> {
    const axios = (await import('axios')).default;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.writeFile(outputPath, response.data);
  }

  private extractS3Key(url: string): string {
    // Extract key from S3 URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts.slice(2).join('/'); // Skip bucket name
  }
}
