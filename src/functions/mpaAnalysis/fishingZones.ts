import { Sketch, SketchCollection, Polygon, MultiPolygon } from '@seasketch/geoprocessing';
import { createMetric, MetricWithExtra } from '../../types/metrics';
import { MPAnalysisOptions } from '../../types';
import { CONFIG } from '../../config';
import { calculateSketchArea } from '../../utils/layerUtils';

// Type for raster statistics from SeaSketch
interface RasterStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  sum: number;
  count: number;
  // Percentiles for effort distribution
  p10: number;
  p50: number;
  p90: number;
}

// Type for fishing effort category
interface FishingEffortCategory {
  id: string;
  name: string;
  min: number;
  max: number;
  color: string;
}

// Type for fishing effort statistics
interface FishingEffortStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  sum: number;
  count: number;
  // Percentiles for effort distribution
  p10: number;
  p50: number;
  p90: number;
}

// Type for fishing effort category
interface FishingEffortCategory {
  id: string;
  name: string;
  min: number;
  max: number;
  color: string;
}

// Type for fishing zone properties
interface FishingZoneProperties {
  id: string;
  name: string;
  type: string;
  [key: string]: any; // Allow for additional properties
}

// Default fishing effort categories
const FISHING_EFFORT_CATEGORIES: FishingEffortCategory[] = [
  {
    id: 'very_high',
    name: 'Very High Fishing Effort',
    min: CONFIG.SETTINGS.FISHING_ANALYSIS.HIGH_FISHING_THRESHOLD,
    max: Infinity,
    color: '#d73027' // Red
  },
  {
    id: 'high',
    name: 'High Fishing Effort',
    min: CONFIG.SETTINGS.FISHING_ANALYSIS.MEDIUM_FISHING_THRESHOLD,
    max: CONFIG.SETTINGS.FISHING_ANALYSIS.HIGH_FISHING_THRESHOLD,
    color: '#fdae61' // Orange
  },
  {
    id: 'medium',
    name: 'Medium Fishing Effort',
    min: 1,
    max: CONFIG.SETTINGS.FISHING_ANALYSIS.MEDIUM_FISHING_THRESHOLD,
    color: '#fee08b' // Yellow
  },
  {
    id: 'low',
    name: 'Low Fishing Effort',
    min: 0,
    max: 1,
    color: '#91cf60' // Green
  }
];

/**
 * Fetches raster statistics for the fishing hours layer within the sketch boundary
 */
async function getFishingEffortStats(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>
): Promise<RasterStats> {
  try {
    // This would be replaced with actual SeaSketch API call to get raster stats
    // For now, we'll return mock data
    return {
      min: 0,
      max: 5000,
      mean: 250,
      median: 120,
      sum: 10000,
      count: 1000,
      p10: 10,
      p50: 120,
      p90: 800
    };
  } catch (error) {
    console.error('Error fetching fishing effort statistics:', error);
    throw new Error('Failed to fetch fishing effort statistics');
  }
}

/**
 * Analyzes fishing effort within MPA sketches using raster data
 */
export async function analyzeFishingZones(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  options: MPAnalysisOptions = {}
): Promise<MetricWithExtra[]> {
  const metrics: MetricWithExtra[] = [];
  const sketchId = 'properties' in sketch ? sketch.properties?.sketchId || 'all' : 'all';

  try {
    // Calculate total sketch area
    const totalArea = calculateSketchArea(sketch);
    
    // Add total area metric
    metrics.push(
      createMetric({
        metricId: 'fishing-effort-total-area',
        value: totalArea,
        sketchId,
        extra: {
          description: 'Total area of MPA sketch',
          units: 'km²'
        }
      })
    );

    // Get fishing effort statistics for the sketch area
    const effortStats = await getFishingEffortStats(sketch);
    
    // Add overall statistics metrics
    metrics.push(
      createMetric({
        metricId: 'fishing-effort-total-hours',
        value: effortStats.sum,
        sketchId,
        extra: {
          description: 'Total fishing hours in MPA',
          units: 'hours',
          stats: effortStats
        }
      })
    );
    
    metrics.push(
      createMetric({
        metricId: 'fishing-effort-mean',
        value: effortStats.mean,
        sketchId,
        extra: {
          description: 'Mean fishing intensity in MPA',
          units: 'hours/km²',
          stats: effortStats
        }
      })
    );
    
    // Add metrics for each effort category
    for (const category of FISHING_EFFORT_CATEGORIES) {
      // In a real implementation, you would calculate the area for each category
      // based on the raster data. This is a simplified example.
      const categoryArea = 0; // This would be calculated from raster data
      const categoryPercentage = (categoryArea / totalArea) * 100;
      
      metrics.push(
        createMetric({
          metricId: `fishing-effort-${category.id}-area`,
          value: categoryArea,
          sketchId,
          extra: {
            description: `Area with ${category.name.toLowerCase()}`,
            units: 'km²',
            category: category.id,
            percentage: categoryPercentage,
            minHours: category.min,
            maxHours: category.max === Infinity ? '∞' : category.max,
            color: category.color
          }
        })
      );
      
      metrics.push(
        createMetric({
          metricId: `fishing-effort-${category.id}-percent`,
          value: categoryPercentage,
          sketchId,
          extra: {
            description: `Percentage of MPA with ${category.name.toLowerCase()}`,
            units: '%',
            category: category.id,
            area: categoryArea,
            minHours: category.min,
            maxHours: category.max === Infinity ? '∞' : category.max,
            color: category.color
          }
        })
      );
    }
    
    return metrics;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing fishing zones:', error);
    throw new Error(`Failed to analyze fishing zones: ${errorMessage}`);
  }
}

// Re-export for backward compatibility
export default {
  analyzeFishingZones
} as const;
