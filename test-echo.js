const http = require('http');

// Test data
const testData = JSON.stringify({
  message: 'Testing echo endpoint',
  timestamp: new Date().toISOString()
});

// Request options
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/echo',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData),
    'X-Test-Header': 'Test-Value'
  }
};

console.log('Sending test request to echo endpoint...');

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
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
