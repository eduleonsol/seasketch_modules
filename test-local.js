const http = require('http');

// Test data
const testData = JSON.stringify({
  sketch: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.4, 37.8],
              [-122.4, 37.7],
              [-122.3, 37.7],
              [-122.3, 37.8],
              [-122.4, 37.8]
            ]
          ]
        }
      }
    ]
  },
  options: {}
});

// Request options
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers));
  
  let data = '';
  res.setEncoding('utf8');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('BODY:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('BODY:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(testData);
req.end();
