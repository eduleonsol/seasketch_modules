import { Sketch, SketchCollection, Feature, Polygon, MultiPolygon } from '@seasketch/geoprocessing';
import { createMetric, MetricWithExtra } from '../../types/metrics';
import { MPAnalysisOptions } from '../../types';
import { CONFIG } from '../../config';
import { fetchLayerFeatures, calculateIntersectionArea, calculateSketchArea } from '../../utils/layerUtils';

// Type for habitat feature properties
interface HabitatProperties {
  id: string;
  name: string;
  sensitivity: number;
  [key: string]: any; // Allow for additional properties
}

// Type for habitat layer configuration
type HabitatLayerConfig = typeof CONFIG['LAYER_IDS']['HABITATS'][keyof typeof CONFIG['LAYER_IDS']['HABITATS']];

/**
 * Analyzes a single habitat layer
 */
async function analyzeHabitatLayer(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  sketchId: string,
  habitatConfig: HabitatLayerConfig
): Promise<MetricWithExtra[]> {
  const metrics: MetricWithExtra[] = [];
  
  try {
    // Fetch habitat features for this specific layer
    const habitats = await fetchLayerFeatures<HabitatProperties>(habitatConfig.id);
    
    // Process each habitat feature in this layer
    for (const habitat of habitats) {
      const habitatId = habitat.properties?.id || 'unknown';
      const habitatName = habitatConfig.name || 'Unnamed Habitat';
      const sensitivity = habitatConfig.sensitivity;
      
      // Calculate intersection area with the MPA sketch
      const intersectionArea = calculateIntersectionArea(sketch, habitat);
      
      // Skip if the intersection is too small
      if (intersectionArea < CONFIG.SETTINGS.HABITAT_ANALYSIS.MIN_HABITAT_AREA) {
        continue;
      }
      
      const impactScore = intersectionArea * sensitivity;
      const habitatArea = calculateSketchArea(habitat);
      const coveragePercentage = habitatArea > 0 ? (intersectionArea / habitatArea) * 100 : 0;
      
      // Add impact metric
      metrics.push(
        createMetric({
          metricId: `habitat-${habitatConfig.id}-${habitatId}-impact`,
          value: impactScore,
          sketchId,
          extra: {
            description: `Impact on ${habitatName}`,
            units: 'impact score',
            area: intersectionArea,
            sensitivity,
            habitatId,
            habitatName,
            habitatType: habitatConfig.id,
            coveragePercentage,
            habitatArea
          }
        })
      );
      
      // Add coverage metric
      metrics.push(
        createMetric({
          metricId: `habitat-${habitatConfig.id}-${habitatId}-coverage`,
          value: coveragePercentage,
          sketchId,
          extra: {
            description: `Percentage of ${habitatName} covered by MPA`,
            units: '%',
            habitatId,
            habitatName,
            habitatType: habitatConfig.id,
            area: intersectionArea,
            habitatArea
          }
        })
      );
    }
    
    return metrics;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error processing habitat layer ${habitatConfig.id}:`, error);
    throw new Error(`Failed to process habitat layer ${habitatConfig.id}: ${errorMessage}`);
  }
}

/**
 * Analyzes habitat impact metrics for MPA sketches across multiple habitat layers
 * @param sketch The sketch or sketch collection to analyze
 * @param options Analysis options
 * @returns Array of metrics related to habitat impact
 */
export async function analyzeHabitatImpact(
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
        metricId: 'habitat-total-area',
        value: totalArea,
        sketchId,
        extra: {
          description: 'Total area of MPA sketch',
          units: 'km²'
        }
      })
    );

    // Get all habitat layer configurations
    const habitatConfigs = Object.values(CONFIG.LAYER_IDS.HABITATS);
    
    // Process each habitat layer
    if (CONFIG.SETTINGS.HABITAT_ANALYSIS.PROCESS_IN_PARALLEL) {
      // Process all habitat layers in parallel
      const layerResults = await Promise.all(
        habitatConfigs.map(config => 
          analyzeHabitatLayer(sketch, sketchId, config)
            .catch(error => {
              console.error(`Error in parallel habitat layer processing (${config.id}):`, error);
              return []; // Return empty array for failed layers
            })
        )
      );
      
      // Flatten the results
      metrics.push(...layerResults.flat());
    } else {
      // Process habitat layers sequentially
      for (const config of habitatConfigs) {
        try {
          const layerMetrics = await analyzeHabitatLayer(sketch, sketchId, config);
          metrics.push(...layerMetrics);
        } catch (error) {
          console.error(`Error processing habitat layer ${config.id}:`, error);
          // Continue with other layers even if one fails
        }
      }
    }
    
    return metrics;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing habitat impact:', error);
    throw new Error(`Failed to analyze habitat impact: ${errorMessage}`);
  }
}

// Re-export for backward compatibility
export default {
  analyzeHabitatImpact
} as const;
