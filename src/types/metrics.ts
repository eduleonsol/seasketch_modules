import { Metric } from '@seasketch/geoprocessing';

/**
 * Extended metric type with additional metadata
 */
export interface MetricWithExtra extends Omit<Metric, 'value'> {
  /** Numeric value of the metric */
  value: number;
  
  /** Additional metadata for the metric */
  extra: {
    /** Human-readable description of what this metric represents */
    description: string;
    
    /** Units of measurement (e.g., 'km²', 'count', 'percentage') */
    units: string;
    
    /** Additional properties specific to this metric */
    [key: string]: any;
  };
}

/**
 * Options for creating a new metric with extra metadata
 */
export interface CreateMetricOptions extends Omit<Metric, 'value' | 'metricId' | 'classId' | 'geographyId' | 'groupId' | 'sketchId'> {
  /** Unique identifier for the metric */
  metricId: string;
  
  /** Numeric value (can be string that will be parsed to number) */
  value: string | number | null;
  
  /** ID of the sketch this metric belongs to */
  sketchId: string | null;
  
  /** Optional class ID for classification */
  classId?: string | null;
  
  /** Optional geography ID for spatial reference */
  geographyId?: string | null;
  
  /** Optional group ID for organization */
  groupId?: string | null;
  
  /** Additional metadata */
  extra?: {
    description?: string;
    units?: string;
    [key: string]: any;
  };
}

/**
 * Helper function to create a metric with extra metadata
 * @param options Configuration for the new metric
 * @returns A properly formatted MetricWithExtra object
 */
export function createMetric(options: CreateMetricOptions): MetricWithExtra {
  const {
    metricId,
    value,
    sketchId,
    classId = null,
    geographyId = null,
    groupId = null,
    extra = {},
    ...rest
  } = options;
  
  // Parse value to number if it's a string
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
  
  return {
    ...rest,
    metricId,
    value: numericValue,
    sketchId,
    classId,
    geographyId,
    groupId,
    extra: {
      description: extra.description || '',
      units: extra.units || '',
      ...extra,
    },
  };
}
