import { area, intersect } from '@turf/turf';
import { Feature, Polygon, MultiPolygon } from 'geojson';

/**
 * Checks if a feature is a Polygon or MultiPolygon
 */
export function isPolygonOrMultiPolygon(
  feature: any
): feature is Feature<Polygon | MultiPolygon> {
  return (
    feature &&
    feature.geometry &&
    (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
  );
}

/**
 * Calculates the area of a feature in square kilometers
 */
export function calculateAreaKm2(feature: Feature<Polygon | MultiPolygon>): number {
  return area(feature) / 1000000; // Convert from m² to km²
}

/**
 * Calculates the intersection area between two features in square kilometers
 */
export function calculateIntersectionArea(
  feature1: Feature<Polygon | MultiPolygon>,
  feature2: Feature<Polygon | MultiPolygon>
): number {
  const intersection = intersect(feature1, feature2);
  return intersection ? area(intersection) / 1000000 : 0;
}
