import { MTProvider } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';

// Mock translation provider (deterministic for testing)
export class MockMTProvider implements MTProvider {
  async translate(input: {
    text: string;
    from: string;
    to: string;
  }): Promise<{ text: string }> {
    logger.info({ input }, 'MT translate called (mock)');

    // Deterministic mock translation
    if (input.from === input.to) {
      return { text: input.text };
    }

    // Simple mock: prefix with language code
    const translated = `[${input.to.toUpperCase()}] ${input.text}`;
    
    return { text: translated };
  }
}

// NLLB adapter interface (for future implementation)
export class NLLBMTProvider implements MTProvider {
  async translate(input: {
    text: string;
    from: string;
    to: string;
  }): Promise<{ text: string }> {
    logger.info({ input }, 'NLLB MT called (not implemented)');
    
    // Fallback to mock
    return new MockMTProvider().translate(input);
  }
}
