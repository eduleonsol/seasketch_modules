/**
 * Project client configuration for the MPA module
 */

export default {
  // Project title to display in the UI
  title: 'MPA Analysis Module',
  
  // Project description
  description: 'Marine Protected Area analysis and metrics for SeaSketch',
  
  // Version of the project client
  version: '1.0.0',
  
  // Whether to enable debug logging
  debug: process.env.NODE_ENV === 'development',
  
  // Default analysis settings
  analysis: {
    // Default MPA minimum size in square kilometers
    defaultMinSize: 1,
    
    // Whether to include habitat impact analysis by default
    includeHabitatImpact: true,
    
    // Whether to analyze fishing zones by default
    analyzeFishingZones: true
  },
  
  // UI configuration
  ui: {
    // Default map viewport
    defaultViewport: {
      latitude: 0,
      longitude: 0,
      zoom: 2,
      pitch: 0,
      bearing: 0
    },
    
    // Available basemaps
    basemaps: [
      {
        id: 'satellite',
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      },
      {
        id: 'terrain',
        name: 'Terrain',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      }
    ]
  }
};
