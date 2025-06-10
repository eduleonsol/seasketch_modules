// Netlify function for the root endpoint
exports.handler = async function(event, context) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Handle GET request
  if (event.httpMethod === 'GET') {
    try {
      const baseUrl = 'https://geoprocessing-seasketch.netlify.app';
      
      const response = {
        title: 'mpa-analysis',
        author: 'Marine Conservation Team',
        region: 'us-west-1',
        apiVersion: '1.0.0',
        version: '1.0.0',
        relatedUri: 'https://github.com/marine-conservation/mpa-analysis',
        sourceUri: 'git+https://github.com/marine-conservation/mpa-analysis.git',
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
            timeout: 300,
            requiresProperties: [],
            handlerFilename: 'analyze.js',
            vectorDataSources: [],
            rateLimited: false,
            rateLimit: 0,
            rateLimitPeriod: 'daily',
            rateLimitConsumed: 0,
            medianDuration: 0,
            medianCost: 0,
            type: 'javascript',
            issAllowList: ['*'],
            endpoint: `${baseUrl}/.netlify/functions/analyze`
          }
        ],
        uri: baseUrl,
        clientSideBundle: `${baseUrl}/client/bundle.js`
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Internal server error',
          error: error.message
        })
      };
    }
  }

  // Handle unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      status: 'error',
      message: 'Method not allowed'
    })
  };
};
