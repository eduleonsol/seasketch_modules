import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Return the configuration with CORS headers
    const config = {
      title: 'mpa-analysis',
      author: 'Marine Conservation Team',
      region: 'us-west-1',
      apiVersion: '1.0.0',
      version: '1.0.0',
      relatedUri: 'https://github.com/eduleonsol/seasketch_modules',
      sourceUri: 'git+https://github.com/eduleonsol/seasketch_modules.git',
      published: '2025-06-10T22:26:00.000Z',
      clients: [
        {
          title: 'MPAAnalysis',
          uri: 'https://eduleonsol.github.io/seasketch_modules/client.js',
          bundleSize: 0,
          apiVersion: '1.0.0',
          tabs: []
        }
      ],
      feedbackClients: [],
      preprocessingServices: [],
      geoprocessingServices: [
        {
          memory: 10240,
          title: 'mpaAnalysis',
          description: 'Marine Protected Area analysis',
          executionMode: 'async',
          timeout: 300,
          requiresProperties: [],
          handlerFilename: 'analyze.ts',
          vectorDataSources: [],
          rateLimited: false,
          rateLimit: 0,
          rateLimitPeriod: 'daily',
          rateLimitConsumed: 0,
          medianDuration: 0,
          medianCost: 0,
          type: 'javascript',
          issAllowList: ['*'],
          endpoint: 'https://www.seasketch.org/api/external-mpa-service/analyze'
        }
      ],
      uri: 'https://eduleonsol.github.io/seasketch_modules',
      clientSideBundle: 'https://eduleonsol.github.io/seasketch_modules/client.js'
    };

    return res.status(200).json(config);
  } catch (error) {
    console.error('Error in CORS proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
