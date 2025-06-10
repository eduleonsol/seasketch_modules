import { Sketch, SketchCollection, toSketchArray } from '@seasketch/geoprocessing';
import { Feature, Polygon, MultiPolygon, FeatureCollection, Geometry } from 'geojson';
import { createMetric, MetricWithExtra } from '../../types/metrics';
import { calculateAreaKm2 } from '../../utils/geometry';
import { MPAnalysisOptions } from '../../types';

// Helper type for Sketch or SketchCollection with Polygon/MultiPolygon geometry
type SketchOrCollection = Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>;

/**
 * Helper function to calculate the area of a sketch or sketch collection in square kilometers
 */
function calculateSketchArea(sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon> | Polygon | MultiPolygon): number {
  // Handle raw geometry
  if (sketch.type === 'Polygon' || sketch.type === 'MultiPolygon') {
    return calculateAreaKm2({ type: 'Feature', properties: {}, geometry: sketch });
  }

  // If it's a sketch collection, sum the areas of all sketches
  if ('features' in sketch) {
    return sketch.features.reduce(
      (total, feature) => total + calculateSketchArea(feature),
      0
    );
  }

  // For a single sketch, calculate its area
  return calculateAreaKm2(sketch);
}

/**
 * Generate metrics for MPA analysis
 * @param sketch The sketch or sketch collection to analyze
 * @param options Analysis options
 * @returns Array of metrics for the MPA
 */
export async function generateMPAMetrics(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  options: MPAnalysisOptions = {}
): Promise<MetricWithExtra[]> {
  const metrics: MetricWithExtra[] = [];
  const minMPASize = options.minMPASize || 0;

  // Helper function to create a metric with required fields
  const createMPAMetric = (
    metricId: string,
    value: number,
    sketchId: string,
    extra: { description: string; units?: string; [key: string]: any }
  ) => {
    return createMetric({
      metricId,
      value,
      sketchId,
      extra: {
        ...extra,
        units: extra.units || 'km²',
      },
    });
  };

  // Helper function to process a single sketch
  const processSketch = (sketch: Sketch<Polygon | MultiPolygon>) => {
    const sketchId = sketch.properties?.sketchId || 'unknown';
    const area = calculateSketchArea(sketch);
    
    // Add area metric
    metrics.push(
      createMPAMetric('mpa-sketch-area', area, sketchId, {
        description: 'Area of MPA sketch',
      })
    );

    // Add compliance metric if min size is specified
    if (minMPASize > 0) {
      const isCompliant = area >= minMPASize ? 1 : 0;
      metrics.push(
        createMPAMetric('mpa-min-size-compliance', isCompliant, sketchId, {
          description: `MPA meets minimum size requirement of ${minMPASize} km²`,
          minSize: minMPASize,
        })
      );
    }
    
    return area;
  };

  // Process all sketches and calculate total area
  let totalArea = 0;
  
  if ('features' in sketch) {
    // Handle SketchCollection
    sketch.features.forEach(sketch => {
      totalArea += processSketch(sketch);
    });
  } else {
    // Handle single Sketch
    totalArea = processSketch(sketch);
  }
  
  // Add total area metric
  metrics.push(
    createMPAMetric('mpa-total-area', totalArea, 'all', {
      description: 'Total area of all MPA sketches',
      units: 'km²',
    })
  );

  return metrics;
}

// Re-export types for convenience
export type { MPAnalysisOptions } from '../../types';

export default {
  generateMPAMetrics,
  calculateSketchArea
} as const;
