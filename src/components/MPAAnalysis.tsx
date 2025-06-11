import React from 'react';
import { Sketch } from '@seasketch/geoprocessing/client-core';
import { Metric } from '../types';

interface MPAAnalysisProps {
  sketch: Sketch;
  metrics: Metric[];
}

/**
 * MPA Analysis Report Component
 */
export const MPAAnalysis: React.FC<MPAAnalysisProps> = ({ sketch, metrics = [] }) => {
  // Group metrics by their class for better organization
  const metricsByClass = metrics.reduce((acc, metric) => {
    const classId = metric.classId || 'general';
    if (!acc[classId]) {
      acc[classId] = [];
    }
    acc[classId].push(metric);
    return acc;
  }, {} as Record<string, typeof metrics>);

  // Helper to format metric values
  const formatValue = (metric: Metric) => {
    const value = metric.value.toLocaleString();
    switch (metric.metricId) {
      case 'area':
        return `${value} km²`;
      case 'depth':
        return `${value} m`;
      case 'protection':
        return `${value}%`;
      default:
        return value;
    }
  };

  // Helper to get a display name for the metric
  const getMetricName = (metricId: string) => {
    const names: Record<string, string> = {
      area: 'Area',
      depth: 'Depth',
      protection: 'Protection Level',
      habitat: 'Habitat Coverage',
      fishing: 'Fishing Impact'
    };
    return names[metricId] || metricId;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4">MPA Analysis Results</h2>
      <p className="text-gray-600 mb-6">Analysis for: {sketch.properties?.name || 'Untitled Sketch'}</p>
      
      {Object.entries(metricsByClass).map(([classId, classMetrics]) => (
        <div key={classId} className="mb-6">
          <h3 className="text-lg font-medium mb-3 capitalize">{classId} Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classMetrics.map((metric) => (
              <div 
                key={`${metric.metricId}-${metric.classId || ''}`}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="text-sm text-gray-600 mb-1">
                  {getMetricName(metric.metricId)}
                </div>
                <div className="text-2xl font-medium text-blue-800">
                  {formatValue(metric)}
                </div>
                {metric.extra && (
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(metric.extra).map(([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {metrics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No metrics available for this analysis.
        </div>
      )}
    </div>
  );
};

export default MPAAnalysis;
