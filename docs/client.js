/**
 * MPA Analysis Client for SeaSketch
 * This client integrates with SeaSketch's reporting system
 * 
 * IMPORTANT: This client must follow the pattern expected by SeaSketch for geoprocessing clients
 */
console.log('[MPA Client] Loading MPA Analysis client');

// First, make sure we only add styles once
if (!document.getElementById('mpa-analysis-styles')) {
  // Add styles to match SeaSketch's UI
  const style = document.createElement('style');
  style.id = 'mpa-analysis-styles';
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
  console.log('[MPA Client] Styles added');
}

// This client object will be used by SeaSketch to render the report
export default {
  // Called when the client is initialized
  initialize: function() {
    console.log('[MPA Client] MPA Analysis client initialized');
    // This is where we'd normally set up event listeners, etc.
    return Promise.resolve();
  },
  
  // Called when a sketch is analyzed
  // This is the main function that SeaSketch calls
  run: async function(sketch) {
    console.log('[MPA Client] Running MPA analysis for sketch:', sketch?.properties?.name || 'Unknown');
    
    // SeaSketch may provide containers in different ways depending on the context
    // so we need to try multiple approaches
    let targetContainer;
    
    // First, try to find the standard SeaSketch report containers
    const reportSections = document.querySelectorAll('.ReportSection, .geoprocessing-report');
    if (reportSections.length > 0) {
      console.log('[MPA Client] Found', reportSections.length, 'report sections');
      // Use the last report section as our container
      targetContainer = reportSections[reportSections.length - 1];
    } else {
      console.log('[MPA Client] No report sections found, using document.body');
      targetContainer = document.body;
    }
    
    // Create our container if needed
    let container = document.querySelector('.mpa-analysis-container');
    if (!container) {
      console.log('[MPA Client] Creating new MPA analysis container');
      container = document.createElement('div');
      container.className = 'mpa-analysis-container';
      targetContainer.appendChild(container);
    }
    
    // Clear any previous results
    container.innerHTML = '';
    
    // Add section title 
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'MPA Analysis Results';
    container.appendChild(sectionTitle);
    
    // Add sketch name if available
    if (sketch && sketch.properties && sketch.properties.name) {
      const sketchName = document.createElement('div');
      sketchName.style.fontSize = '16px';
      sketchName.style.marginBottom = '15px';
      sketchName.innerHTML = `<strong>Sketch:</strong> ${sketch.properties.name}`;
      container.appendChild(sketchName);
    }
    
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
    
    console.log('[MPA Client] Added loading spinner');
    
    // Return a promise that resolves with the analysis results
    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, this would call your actual geoprocessing endpoint
        // For now, we'll simulate a delay and return mock results
        setTimeout(() => {
          try {
            // Remove loading spinner
            if (container.contains(loadingContainer)) {
              container.removeChild(loadingContainer);
            }
            
            console.log('[MPA Client] Generating report results');
            
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
            
            // Add an explanatory paragraph
            const reportIntro = document.createElement('p');
            reportIntro.style.marginBottom = '20px';
            reportIntro.textContent = 'This analysis provides key metrics for evaluating the effectiveness of your Marine Protected Area design.';
            container.appendChild(reportIntro);
            
            // Create metrics container
            const metricsContainer = document.createElement('div');
            metricsContainer.className = 'metrics-container';
            container.appendChild(metricsContainer);
            
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
              
              metricsContainer.appendChild(metricCard);
            });
            
            console.log('[MPA Client] Report rendered successfully');
            
            // Resolve the promise with successful results
            // This tells SeaSketch that our analysis is complete
            resolve({
              success: true, 
              message: 'MPA Analysis completed successfully',
              data: {
                metrics: metrics,
                sketchName: sketch?.properties?.name || 'Unknown'
              }
            });
            
          } catch (error) {
            console.error('[MPA Client] Error showing MPA analysis results:', error);
            showError(container, error);
            reject({
              success: false,
              error: error.message || 'Error showing results'
            });
          }
        }, 2000); // Simulate 2-second processing time
      } catch (error) {
        console.error('[MPA Client] Error running MPA analysis:', error);
        showError(container, error);
        reject({
          success: false,
          error: error.message || 'Error running analysis'
        });
      }
    });
  },
  
  /**
   * Utility function to display errors in the UI
   */
  showError: function(container, error) {
    console.log('[MPA Client] Showing error:', error);
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    
    const errorTitle = document.createElement('div');
    errorTitle.style.fontWeight = 'bold';
    errorTitle.textContent = 'Error';
    
    const errorText = document.createElement('div');
    errorText.textContent = error.message || 'An unknown error occurred';
    
    errorMessage.appendChild(errorTitle);
    errorMessage.appendChild(errorText);
    container.appendChild(errorMessage);
  }
};

/**
 * Standalone helper function for error display
 * This is needed because it's referenced outside the main object
 */
function showError(container, error) {
  console.log('[MPA Client] Showing error:', error);
  
  // Create error message element
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  
  const errorTitle = document.createElement('div');
  errorTitle.style.fontWeight = 'bold';
  errorTitle.textContent = 'Error';
  
  const errorText = document.createElement('div');
  errorText.textContent = error.message || 'An unknown error occurred';
  
  errorMessage.appendChild(errorTitle);
  errorMessage.appendChild(errorText);
  container.appendChild(errorMessage);
}
