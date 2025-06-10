/**
 * SeaSketch Geoprocessing Module
 * 
 * This module provides geoprocessing functions for marine spatial planning in SeaSketch.
 * It includes analysis for Marine Protected Areas (MPAs), fishing zones, and habitat impacts.
 */

// Re-export the main MPA analysis function
export { default as analyzeMPA } from './functions/mpaAnalysis';

// Re-export types for external use
export * from './types';

// Export any utility functions that might be useful for other modules
export * from './utils/geometry';

// Example of a simple utility function that might be useful
export function helloSeaSketch(): string {
  return 'Hello from SeaSketch Geoprocessing Module!';
}

// Configuration for vector overlays
// These should match the layer IDs in your SeaSketch project
const VECTOR_OVERLAYS = [
  "mpas",          // Marine Protected Areas (special handling for 'Pesca' attribute)
  "coral_reefs",   // Coral reef locations
  "cold_corals",   // Cold water coral habitats
  "seamounts",     // Underwater mountains
  "knolls",        // Small underwater hills
  "seagrass",      // Seagrass beds
  "kelp"           // Kelp forests
];

/**
 * List of raster overlay IDs to process
 * These should match the raster layer IDs in your SeaSketch project
 */
const RASTER_OVERLAYS = [
  "sp_richness",      // Species richness
  "fishing_hours_sum", // Total fishing hours
  "night_lights",     // Nighttime light 
  "mhws_freq",        // Marine heatwave frequency
  "mhhws_slope",      // Marine heatwave slope
  "social_def_r",     // Social deficit (relative)
  "social_inc_r",     // Social inclusion (relative)
  "coastal_pop_inf_r", // Coastal population influence
  "diving_tourism_r"  // Diving tourism potential
];

/**
 * List of raster layers that should have histograms generated
 */
const HISTOGRAM_RASTERS = [
  "fishing_hours_sum",
  "mhws_freq",
  "social_def_r",
  "social_inc_r"
];

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Generates an SVG histogram from an array of values
 * @param values - Array of numerical values to visualize
 * @returns SVG string representing the histogram
 */
function generateSVGHistogram(values: number[]): string {
  // Implementation note: This is a placeholder. In a real implementation,
  // you might want to use a library like d3 or chart.js to generate the SVG
  return `<svg width='200' height='100'><!-- Histogram visualization would go here --></svg>`;
}

// =============================================
// TYPE DEFINITIONS
// =============================================

/**
 * Represents the result of vector overlay analysis
 */
interface VectorResult {
  overlayId: string;           // ID of the vector overlay
  areaSqKm?: number;           // Total area in square kilometers (for non-grouped layers)
  pescaAreaSqKm?: Array<{      // Array of areas by 'Pesca' category (for MPAs)
    pesca: string;            // Category name
    areaSqKm: number;         // Area in square kilometers
  }>;
}

/**
 * Represents the result of raster overlay analysis
 */
interface RasterResult {
  overlayId: string;           // ID of the raster overlay
  stats: {                    // Statistical summary
    mean: number;            // Average value
    sum: number;             // Sum of all values
    min: number;             // Minimum value
    max: number;             // Maximum value
    stddev: number;          // Standard deviation
  };
  histogramSvg?: string;      // Optional SVG histogram
}

/**
 * Main result type containing both vector and raster results
 */
type FeaturesCoverageResult = {
  vectorResults: VectorResult[];
  rasterResults: RasterResult[];
};

// =============================================
// MAIN GEOPROCESSING FUNCTION
// =============================================

/**
 * Main geoprocessing function that analyzes vector and raster overlays within a sketch
 * @param input - Sketch or SketchCollection from SeaSketch
 * @param context - SeaSketch context object
 * @returns Promise with analysis results
 */
export const featuresCoverage = async (
  input: any,
  context: any
): Promise<any> => {
  // Use the first feature if a collection, else use single sketch
  // Get the first feature if it's a collection, otherwise use the input as is
  const sketch = (input as SketchCollection).features
    ? (input as SketchCollection).features[0]
    : (input as Sketch);

  // Ensure the sketch is a polygon/multipolygon
  if (!isPolygonFeature(sketch)) {
    throw new Error("Only Polygon or MultiPolygon sketches are supported for area/intersection analysis.");
  }

  const vectorResults: VectorResult[] = [];

  const rasterResults: RasterResult[] = [];

  // 1. Vector overlays: Intersect and calculate area
  // Process vector overlays
  for (const overlayId of VECTOR_OVERLAYS) {
    const vectorDs = new VectorDatasource(overlayId);
    await vectorDs.load();
    if (overlayId === "mpas") {
      // Group intersected area by 'Pesca' attribute
      const pescaAreas: { [key: string]: number } = {};
      for (const feature of vectorDs.data.features) {
        const intersection = intersect(sketch, feature);
        if (intersection) {
          const pesca = feature.properties?.Pesca || "(Sin valor)";
          if (!pescaAreas[pesca]) pescaAreas[pesca] = 0;
          pescaAreas[pesca] += area(intersection);
        }
      }
      vectorResults.push({
        overlayId,
        pescaAreaSqKm: Object.entries(pescaAreas).map(([pesca, areaVal]) => ({
          pesca,
          areaSqKm: areaVal / 1e6,
        })),
      });
    } else {
      // Default: total intersected area
      let totalIntersectedArea = 0;
      for (const feature of vectorDs.data.features) {
        if (!isPolygonFeature(feature)) continue;
        const intersection = intersect(sketch, feature);
        if (intersection) {
          totalIntersectedArea += area(intersection);
        }
      }
      vectorResults.push({
        overlayId,
        areaSqKm: totalIntersectedArea / 1e6,
      });
    }
  }

  // 2. Raster overlays: Zonal statistics and histogram
  const HISTOGRAM_RASTERS = [
    "fishing_hours_sum", "mhws_freq", "social_def_r", "social_inc_r"
  ];
  // Process raster overlays
  for (const rasterId of RASTER_OVERLAYS) {
    const overlayId = rasterId; // Alias for consistency
    let pixelValues: number[] = [];
    try {
      const rasterDs = new RasterDatasource(rasterId);
      await rasterDs.load();
      const values = await rasterDs.getValues(sketch);
      pixelValues = values.filter((v: number | null) => typeof v === "number") as number[];
    } catch (e) {
      console.error(`Failed to extract values for raster ${rasterId}:`, e);
    }

    // Compute statistics
    const count = pixelValues.length;
    const sum = pixelValues.reduce((a, b) => a + b, 0);
    const mean = count > 0 ? sum / count : 0;
    const min = count > 0 ? Math.min(...pixelValues) : 0;
    const max = count > 0 ? Math.max(...pixelValues) : 0;
    const stddev = count > 0 ? Math.sqrt(pixelValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count) : 0;

    // Only generate SVG histogram for selected rasters
    let histogramSVG: string | null = null;
    if (HISTOGRAM_RASTERS.includes(rasterId)) {
      histogramSVG = generateSVGHistogram(pixelValues);
    }

    rasterResults.push({
      overlayId,
      stats: {
        mean: pixelValues.reduce((a, b) => a + b, 0) / pixelValues.length,
        sum: pixelValues.reduce((a, b) => a + b, 0),
        min: Math.min(...pixelValues),
        max: Math.max(...pixelValues),
        stddev: Math.sqrt(pixelValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / pixelValues.length),
      },
histogramSvg: HISTOGRAM_RASTERS.includes(rasterId) ? generateSVGHistogram(pixelValues) : undefined,
    });
  }

  // Return a simple object that matches what SeaSketch expects
  return {
    vectorResults,
    rasterResults
  };
};

export default featuresCoverage;
