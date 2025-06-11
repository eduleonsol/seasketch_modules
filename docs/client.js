// MPA Analysis Client for SeaSketch
console.log('MPA Analysis client loaded');

// Export the client object
export default {
  // Called when the client is initialized
  initialize: function() {
    console.log('MPA Analysis client initialized');
    return Promise.resolve();
  },
  
  // Called when the analysis is run
  run: function(sketch) {
    console.log('Running MPA analysis for sketch:', sketch);
    
    // Show loading state
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.textContent = 'Analyzing MPA...';
    document.body.appendChild(loadingMessage);
    
    // The actual analysis is handled by the server
    return new Promise((resolve, reject) => {
      try {
        // This will be called by SeaSketch with the analysis results
        window.receiveAnalysisResults = function(results) {
          console.log('Received analysis results:', results);
          
          // Remove loading message
          if (loadingMessage.parentNode) {
            loadingMessage.parentNode.removeChild(loadingMessage);
          }
          
          // Create results container
          const resultsContainer = document.createElement('div');
          resultsContainer.className = 'mpa-results';
          
          // Display basic sketch info
          const title = document.createElement('h2');
          title.textContent = 'MPA Analysis Results';
          resultsContainer.appendChild(title);
          
          // Display metrics if available
          if (results.metrics && results.metrics.length > 0) {
            const metricsList = document.createElement('ul');
            results.metrics.forEach(metric => {
              const item = document.createElement('li');
              item.textContent = `${metric.metricId}: ${metric.value} ${metric.unit || ''}`;
              metricsList.appendChild(item);
            });
            resultsContainer.appendChild(metricsList);
          }
          
          // Add to document
          document.body.appendChild(resultsContainer);
          
          // Resolve with success
          resolve({
            success: true,
            message: 'Analysis completed successfully',
            sketch: results.sketch
          });
        };
        
        // Add some basic styles
        const style = document.createElement('style');
        style.textContent = `
          .loading-message {
            padding: 20px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 16px;
          }
          .mpa-results {
            padding: 20px;
            background: #fff;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            margin: 10px 0;
          }
          .mpa-results h2 {
            margin-top: 0;
            color: #2c3e50;
          }
          .mpa-results ul {
            list-style-type: none;
            padding: 0;
          }
          .mpa-results li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
        `;
        document.head.appendChild(style);
        
      } catch (error) {
        console.error('Error in MPA analysis:', error);
        
        // Remove loading message if it exists
        if (loadingMessage.parentNode) {
          loadingMessage.parentNode.removeChild(loadingMessage);
        }
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error in MPA analysis: ' + (error.message || 'Unknown error');
        document.body.appendChild(errorMessage);
        
        reject(error);
      }
    });
  }
};
