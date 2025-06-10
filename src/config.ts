/**
 * Configuration for the MPA analysis module
 * Replace the placeholder layer IDs with your actual SeaSketch layer IDs
 */
export const CONFIG = {
  // Layer IDs (these will be provided by SeaSketch when you upload your layers)
  LAYER_IDS: {
    // ID of the layer containing fishing effort data (raster)
    FISHING_HOURS: 'fishing_hours_sum',
    
    // Habitat layers configuration
    HABITATS: {
      // Coral reefs - highly sensitive
      CORAL: {
        id: 'coral_reefs',
        name: 'Coral Reefs',
        sensitivity: 5  // 1-5 scale, 5 being most sensitive
      },
      // Cold corals - highly sensitive
      COLD_CORALS: {
        id: 'cold_corals',
        name: 'Cold Corals',
        sensitivity: 5
      },
      // Knolls - moderately sensitive
      KNOLLS: {
        id: 'knolls',
        name: 'Knolls',
        sensitivity: 4
      },
      // Seamounts - highly sensitive
      SEAMOUNTS: {
        id: 'seamounts',
        name: 'Seamounts',
        sensitivity: 5
      },
      // Kelp forests - moderately sensitive
      KELP: {
        id: 'kelp',
        name: 'Kelp Forests',
        sensitivity: 4
      },
      // Seagrass beds - highly sensitive
      SEAGRASS: {
        id: 'seagrass',
        name: 'Seagrass Beds',
        sensitivity: 5
      }
    },
    
    // Get all habitat layer IDs as an array (used for fetching all layers at once)
    ALL_HABITAT_LAYERS: function() {
      return Object.values(this.HABITATS).map(h => h.id);
    }
  },
  
  // Analysis settings
  SETTINGS: {
    // Default minimum MPA size in square kilometers
    DEFAULT_MIN_MPA_SIZE: 10,
    
    // Fishing impact analysis settings
    FISHING_ANALYSIS: {
      // Threshold for high fishing effort (in hours)
      HIGH_FISHING_THRESHOLD: 1000,
      // Threshold for medium fishing effort (in hours)
      MEDIUM_FISHING_THRESHOLD: 100,
      // Whether to use raster statistics for faster but less precise analysis
      USE_RASTER_STATS: true
    },
    
    // Default coordinate reference system (EPSG:4326 for WGS84)
    DEFAULT_CRS: 'EPSG:4326',
    
    // Habitat analysis settings
    HABITAT_ANALYSIS: {
      // Whether to process all habitat layers in parallel (true) or sequentially (false)
      PROCESS_IN_PARALLEL: true,
      
      // Buffer distance in meters for habitat proximity analysis (if needed)
      BUFFER_DISTANCE: 1000,
      
      // Minimum habitat area to consider in square kilometers
      MIN_HABITAT_AREA: 0.01
    }
  }
} as const;

/**
 * Gets the layer URL for a given layer ID
 * @param layerId The ID of the layer in SeaSketch
 * @returns The URL to fetch the layer data
 */
export function getLayerUrl(layerId: string): string {
  return `/api/v1/layers/${layerId}/features`;
}

// Type for the configuration object
export type Config = typeof CONFIG;
