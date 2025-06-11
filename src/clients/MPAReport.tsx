import * as React from 'react';
import { Sketch } from '@seasketch/geoprocessing';
import { ReportClient } from '@seasketch/geoprocessing/client-ui';
import { MPAAnalysis } from '../components/MPAAnalysis';
import { MPAnalysisResult, Metric } from '../types';

// Add TypeScript interfaces for our props
interface MPAReportProps {
  result?: MPAnalysisResult;
  sketch?: Sketch;
  onSketchLoad?: (sketch: Sketch) => void;
  metrics?: Metric[]; // Allow metrics to be passed directly
}

// Simple loading spinner component
const LoadingSpinner = () => {
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <style>{spinKeyframes}</style>
      <div style={{
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderLeftColor: '#3182ce',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }}></div>
      <div>Loading MPA analysis...</div>
    </div>
  );
};

// Error display component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div style={{
    backgroundColor: '#fed7d7',
    border: '1px solid #fc8181',
    color: '#c53030',
    borderRadius: '4px',
    padding: '12px',
    margin: '10px 0'
  }}>
    <div style={{ fontWeight: 'bold' }}>Error</div>
    <div>{message}</div>
  </div>
);



const MPAReport: React.FC<MPAReportProps> = (props) => {
  const { result, sketch, onSketchLoad, metrics } = props;
  const [analysisResult, setAnalysisResult] = React.useState<MPAnalysisResult | null>(result || null);
  const [isLoading, setIsLoading] = React.useState<boolean>(!result && !metrics);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize with result or metrics from props if available
  React.useEffect(() => {
    if (result) {
      setAnalysisResult(result);
      setIsLoading(false);
    } else if (metrics && sketch) {
      // If metrics are provided directly, use them
      setAnalysisResult({
        metrics,
        sketch
      });
      setIsLoading(false);
    } else if (sketch && onSketchLoad) {
      // If we have a sketch but no result, trigger the load
      onSketchLoad(sketch);
    }
  }, [result, sketch, onSketchLoad, metrics]);

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return <ErrorDisplay message={error} />;
  }



  // Show the analysis results
  if (!analysisResult || !analysisResult.metrics || analysisResult.metrics.length === 0) {
    return <div>No analysis results available</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <MPAAnalysis 
        sketch={sketch || { 
          type: 'Feature', 
          properties: {}, 
          geometry: { type: 'Polygon', coordinates: [] } 
        }} 
        metrics={analysisResult.metrics}
      />
    </div>
  );
};

// Wrap with ReportClient to provide sketch context
const WrappedMPAReport = ReportClient(MPAReport);

export default WrappedMPAReport;
