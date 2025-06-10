import { Feature, FeatureCollection, Polygon, MultiPolygon, Geometry } from 'geojson';
import { getLayerUrl } from '../config';
import { Sketch, SketchCollection } from '@seasketch/geoprocessing';

// Helper function to calculate sketch area
export function calculateSketchArea(sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon> | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>): number {
  // This is a simplified implementation - in a real scenario, you would use Turf.js
  // or a similar library to calculate the actual area
  console.warn('calculateSketchArea: Using placeholder implementation - returning 0');
  return 0;
}

/**
 * Fetches features from a SeaSketch layer
 * @param layerId The ID of the layer to fetch
 * @returns A promise that resolves to an array of GeoJSON features
 */
export async function fetchLayerFeatures<T = any>(
  layerId: string
): Promise<Array<Feature<Polygon | MultiPolygon, T>>> {
  try {
    const response = await fetch(getLayerUrl(layerId));
    if (!response.ok) {
      throw new Error(`Failed to fetch layer ${layerId}: ${response.statusText}`);
    }
    
    const data = await response.json() as { features?: Array<Feature<Polygon | MultiPolygon, T>> };
    if (!data?.features) {
      throw new Error('Invalid GeoJSON response: missing features');
    }
    return data.features;
  } catch (error) {
    console.error(`Error fetching layer ${layerId}:`, error);
    throw error;
  }
}

/**
 * Calculates the intersection area between a sketch and a feature
 * @param sketch The sketch or sketch collection
 * @param feature The feature to intersect with
 * @returns The area of intersection in square kilometers
 */
export function calculateIntersectionArea(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon> | Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>,
  feature: Feature<Polygon | MultiPolygon>
): number {
  // This is a placeholder implementation
  // In a real implementation, you would use Turf.js or similar to calculate the intersection
  console.warn('Intersection calculation not implemented - returning 0');
  return 0;
}

/**
 * Calculates the total area of a feature or feature collection
 * @param feature The feature or feature collection
 * @returns The area in square kilometers
 */
export function calculateFeatureArea(
  feature: Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>
): number {
  // This is a placeholder implementation
  console.warn('Area calculation not implemented - returning 0');
  return 0;
}
