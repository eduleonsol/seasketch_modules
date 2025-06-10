import { Sketch, SketchCollection, Metric } from '@seasketch/geoprocessing';
import { Feature, Polygon, MultiPolygon, Geometry } from 'geojson';

export * from './metrics';

/**
 * Supported geometry types for MPA analysis
 */
export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';

/**
 * Union of all possible geometry types
 */
export type AnyGeometry = Polygon | MultiPolygon;

export interface MPAnalysisOptions {
  /** Minimum MPA size in square kilometers */
  minMPASize?: number;
  /** Include detailed overlap analysis with fishing zones */
  analyzeFishingZones?: boolean;
  /** Include habitat impact assessment */
  includeHabitatImpact?: boolean;
  /** Specific habitat types to analyze */
  habitatTypes?: string[];
}

export interface MPAnalysisResult {
  metrics: Metric[];
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>;
}

export interface FishingZone {
  id: string;
  name: string;
  type: string;
  // Add other relevant properties
}

export interface HabitatType {
  id: string;
  name: string;
  sensitivity: number;
  // Add other relevant properties
}

// Re-export Metric from geoprocessing
export { Metric };
