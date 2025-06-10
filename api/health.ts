import { VercelRequest, VercelResponse } from '@vercel/node';

// Set CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    // Return a more detailed response that matches SeaSketch's expectations
    return res.status(200).json({
      status: 'online',
      name: 'MPA Analysis Module',
      description: 'Marine Protected Area analysis for SeaSketch',
      version: '1.0.0',
      apiVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        analyze: '/api/analyze'
      },
      capabilities: ['geoprocessing'],
      message: 'Service is operational and ready to accept requests'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
