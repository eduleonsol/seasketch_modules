const fetch = require('node-fetch');

const testSketch = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-122.4, 37.8],
          [-122.4, 37.7],
          [-122.3, 37.7],
          [-122.3, 37.8],
          [-122.4, 37.8]
        ]]
      }
    }
  ]
};

async function testEndpoint() {
  try {
    console.log('Sending test request...');
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sketch: testSketch,
        options: {}
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoint();
