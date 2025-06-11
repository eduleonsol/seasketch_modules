/**
 * MPA Analysis Client for SeaSketch
 * This client integrates with SeaSketch's reporting system
 */
console.log('MPA Analysis client loaded');

// Add styles to match SeaSketch's UI
const style = document.createElement('style');
style.textContent = `
  .mpa-analysis-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #2d3748;
    padding: 10px 20px;
    margin-bottom: 20px;
  }
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
  }
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3182ce;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .error-message {
    background-color: #fed7d7;
    border: 1px solid #fc8181;
    color: #c53030;
    border-radius: 4px;
    padding: 12px;
    margin: 10px 0;
  }
  .metric-card {
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .metric-title {
    font-weight: 600;
    font-size: 16px;
    color: #4a5568;
  }
  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #3182ce;
  }
  .metric-subtitle {
    font-size: 14px;
    color: #718096;
    margin-top: 4px;
  }
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
  }
`;
document.head.appendChild(style);

// This client object will be used by SeaSketch to render the report
export default {
  // Called when the client is initialized
  initialize: function() {
    console.log('MPA Analysis client initialized');
    return Promise.resolve();
  },
  
  // Called when a sketch is analyzed
  // This is the main function that SeaSketch calls
  run: function(sketch) {
    console.log('Running MPA analysis for sketch:', sketch);
    
    // Find the SeaSketch report container or create our own
    let container = document.querySelector('.mpa-analysis-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'mpa-analysis-container';
      
      // Find the appropriate SeaSketch container to append to
      const reportContainer = document.querySelector('.ReportSection') || 
                            document.querySelector('.geoprocessing-report') || 
                            document.body;
      
      reportContainer.appendChild(container);
    }
    
    // Clear any previous results
    container.innerHTML = '';
    
    // Add section title
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'MPA Analysis Results';
    container.appendChild(sectionTitle);
    
    // Show loading indicator
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Analyzing MPA sketch...';
    
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    container.appendChild(loadingContainer);
    
    // Return a promise that resolves with the analysis results
    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, this would call your actual geoprocessing endpoint
        // For now, we'll simulate a delay and return mock results
        setTimeout(() => {
          try {
            // Remove loading spinner
            container.removeChild(loadingContainer);
            
            // Generate mock metrics (in real implementation, these would come from your API)
            const metrics = [
              { 
                title: 'Total Area', 
                value: '1,234', 
                units: 'km²',
                description: 'Total area of the MPA' 
              },
              { 
                title: 'Protection Level', 
                value: '75', 
                units: '%',
                description: 'Percentage of area under protection' 
              },
              { 
                title: 'Habitat Coverage', 
                value: '3', 
                units: 'types',
                description: 'Number of habitat types included' 
              },
              { 
                title: 'Depth Range', 
                value: '10-50', 
                units: 'm',
                description: 'Min and max depth' 
              }
            ];
            
            // Render each metric in a card
            metrics.forEach(metric => {
              const metricCard = document.createElement('div');
              metricCard.className = 'metric-card';
              
              const metricHeader = document.createElement('div');
              metricHeader.className = 'metric-header';
              
              const titleEl = document.createElement('div');
              titleEl.className = 'metric-title';
              titleEl.textContent = metric.title;
              
              const valueEl = document.createElement('div');
              valueEl.className = 'metric-value';
              valueEl.textContent = `${metric.value} ${metric.units}`;
              
              metricHeader.appendChild(titleEl);
              metricHeader.appendChild(valueEl);
              
              const subtitleEl = document.createElement('div');
              subtitleEl.className = 'metric-subtitle';
              subtitleEl.textContent = metric.description;
              
              metricCard.appendChild(metricHeader);
              metricCard.appendChild(subtitleEl);
              
              container.appendChild(metricCard);
            });
            
            // Resolve the promise with successful results
            // This tells SeaSketch that our analysis is complete
            resolve({
              success: true,
              message: 'Analysis completed successfully',
              data: {
                metrics: metrics,
                sketch: sketch.properties?.name || 'Unnamed sketch'
              }
            });
            
          } catch (error) {
            console.error('Error rendering MPA analysis results:', error);
            showError(container, error);
            reject(error);
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error in MPA analysis:', error);
        showError(container, error);
        reject(error);
      }
    });
  }
};

// Helper function to display errors
function showError(container, error) {
  // Create error message element
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = `Analysis Error: ${error.message || 'Unknown error occurred'}`;
  
  // Add to container, clearing previous content
  if (container) {
    container.innerHTML = '';
    container.appendChild(errorEl);
  } else {
    // Fallback if container isn't available
    document.body.appendChild(errorEl);
  }
}
