import { VercelRequest, VercelResponse } from '@vercel/node';

// Enable CORS for all origins
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(204).end();
  }

  // Set CORS headers for actual response
  setCorsHeaders(res);

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Only GET requests are supported.'
    });
  }

  try {
    const baseUrl = 'https://geoprocessingseasketch.vercel.app';
    
    // Return the SeaSketch compatible configuration
    return res.status(200).json({
      title: 'mpa-analysis',
      author: 'Marine Conservation Team',
      region: 'us-west-1',
      apiVersion: '1.0.0',
      version: '1.0.0',
      relatedUri: 'https://github.com/your-org/mpa-analysis',
      sourceUri: 'git+https://github.com/your-org/mpa-analysis.git',
      published: new Date().toISOString(),
      clients: [
        {
          title: 'MPAAnalysis',
          uri: `${baseUrl}/client`,
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
          timeout: 300, // 5 minutes
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
          endpoint: `${baseUrl}/api/analyze`
        }
      ],
      uri: baseUrl,
      clientSideBundle: `${baseUrl}/client/bundle.js`
    });
  } catch (error) {
    console.error('Error in root endpoint:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
