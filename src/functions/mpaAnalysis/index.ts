import { GeoprocessingHandler, Sketch, SketchCollection } from '@seasketch/geoprocessing';
import { Polygon, MultiPolygon } from 'geojson';
import { MPAnalysisOptions, MPAnalysisResult } from '../../types';
import { generateMPAMetrics } from './metrics.js';
import { analyzeFishingZones } from './fishingZones.js';
import { analyzeHabitatImpact } from './habitatImpact.js';

/**
 * Main MPA analysis function
 */
/**
 * Main MPA analysis function
 * @param sketch The sketch or sketch collection to analyze
 * @param options Analysis configuration options
 * @returns Analysis results with metrics
 */
export async function analyzeMPA(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  options: MPAnalysisOptions = {}
): Promise<MPAnalysisResult> {
  // 1. Generate basic MPA metrics
  const metrics = await generateMPAMetrics(sketch, options);

  // 2. Add fishing zone analysis if enabled
  if (options.analyzeFishingZones) {
    const fishingZoneMetrics = await analyzeFishingZones(sketch);
    metrics.push(...fishingZoneMetrics);
  }

  // 3. Add habitat impact analysis if enabled
  if (options.includeHabitatImpact) {
    const habitatMetrics = await analyzeHabitatImpact(sketch);
    metrics.push(...habitatMetrics);
  }

  return {
    metrics,
    sketch
  };
}

// Export as a GeoprocessingHandler
// Export the handler for use with the SeaSketch API
export default new GeoprocessingHandler(analyzeMPA, {
  title: 'MPA Analysis',
  description: 'Analyzes Marine Protected Areas with configurable options',
  timeout: 60, // seconds
  memory: 1024, // MB
  executionMode: 'async',
  requiresProperties: [],
});

// Export all analysis functions for programmatic use
export {
  generateMPAMetrics,
  analyzeFishingZones,
  analyzeHabitatImpact
};

// Re-export types for convenience
export * from '../../types';
