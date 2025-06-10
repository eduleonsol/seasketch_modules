const http = require('http');

// Simple test data
const testData = JSON.stringify({
  test: 'Hello, Vercel!'
});

// Request options
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/simple',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('Sending test request to simple endpoint...');

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
      console.log('RESPONSE BODY:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('RESPONSE BODY (raw):', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(testData);
req.end();
