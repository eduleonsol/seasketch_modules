import { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeMPA } from '../src/functions/mpaAnalysis';
import { MPAnalysisOptions } from '../src/types';

// Set CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

// Helper to send error responses
function sendError(res: VercelResponse, status: number, message: string, details?: any) {
  console.error(`[${status}] ${message}`, details);
  res.status(status).json({
    success: false,
    error: {
      code: status,
      message,
      ...(process.env.NODE_ENV === 'development' && { details })
    },
    timestamp: new Date().toISOString()
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    setCorsHeaders(res);
    return sendError(res, 405, 'Method not allowed. Only POST requests are accepted.');
  }

  // Set CORS headers for actual responses
  setCorsHeaders(res);

  try {
    // Log request (without full sketch data to avoid log bloat)
    const logData = { ...req.body };
    if (logData.sketch) {
      logData.sketch = {
        ...logData.sketch,
        features: logData.sketch.features?.map(() => '[...truncated]') || []
      };
    }
    console.log('Analysis request received:', JSON.stringify(logData, null, 2));

    // Validate request body
    if (!req.body) {
      return sendError(res, 400, 'Request body is missing');
    }

    const { sketch, options = {} } = req.body;
    
    // Validate sketch
    if (!sketch) {
      return sendError(res, 400, 'Missing required parameter: sketch');
    }

    // Basic GeoJSON validation
    if (!sketch.type || sketch.type !== 'FeatureCollection' || !Array.isArray(sketch.features)) {
      return sendError(res, 400, 'Invalid sketch format. Expected a GeoJSON FeatureCollection');
    }

    // Process the analysis
    const result = await analyzeMPA(sketch, {
      analyzeFishingZones: true,
      includeHabitatImpact: true,
      minMPASize: 1, // Minimum MPA size in km²
      ...options
    } as MPAnalysisOptions);

    // Return successful response
    return res.status(200).json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Analysis error:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });

    return sendError(
      res, 
      500, 
      'An error occurred while processing your request',
      process.env.NODE_ENV === 'development' ? { error: errorMessage, stack: errorStack } : undefined
    );
  }
}
