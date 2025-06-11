// MPA Analysis Client for SeaSketch
console.log('MPA Analysis client loaded');

// Add styles
const style = document.createElement('style');
style.textContent = `
  .mpa-analysis-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .loading-message {
    padding: 15px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    margin: 10px 0;
    font-size: 16px;
    text-align: center;
    color: #495057;
  }
  .error-message {
    padding: 15px;
    background: #fff5f5;
    border: 1px solid #ffc9c9;
    border-radius: 4px;
    margin: 10px 0;
    color: #c92a2a;
  }
  .results-container {
    margin-top: 20px;
  }
  .result-item {
    margin: 10px 0;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
  }
  .result-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .result-value {
    font-size: 18px;
    color: #1864ab;
  }
`;
document.head.appendChild(style);

// Main client object
export default {
  // Called when the client is initialized
  initialize: function() {
    console.log('MPA Analysis client initialized');
    return Promise.resolve();
  },
  
  // Called when the analysis is run
  run: function(sketch) {
    console.log('Running MPA analysis for sketch:', sketch);
    
    // Create container if it doesn't exist
    let container = document.getElementById('mpa-analysis-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mpa-analysis-container';
      container.className = 'mpa-analysis-container';
      document.body.appendChild(container);
    }
    
    // Clear previous results
    container.innerHTML = '';
    
    // Show loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.textContent = 'Analyzing MPA...';
    container.appendChild(loadingMessage);
    
    // Return a promise that resolves with the analysis results
    return new Promise((resolve, reject) => {
      try {
        // Simulate analysis delay (replace with actual API call)
        setTimeout(() => {
          try {
            // Remove loading message
            if (loadingMessage.parentNode) {
              loadingMessage.parentNode.removeChild(loadingMessage);
            }
            
            // Create results container
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-container';
            
            // Add sample results (replace with actual analysis results)
            const results = [
              { title: 'Area', value: '1,234 km²' },
              { title: 'Perimeter', value: '456 km' },
              { title: 'Depth Range', value: '10-50m' }
            ];
            
            // Add results to container
            results.forEach(result => {
              const resultItem = document.createElement('div');
              resultItem.className = 'result-item';
              resultItem.innerHTML = `
                <div class="result-title">${result.title}</div>
                <div class="result-value">${result.value}</div>
              `;
              resultsContainer.appendChild(resultItem);
            });
            
            // Add results to container
            container.appendChild(resultsContainer);
            
            // Resolve with success
            resolve({
              success: true,
              message: 'Analysis completed successfully',
              sketch: sketch
            });
            
          } catch (error) {
            handleError(error, container, loadingMessage);
            reject(error);
          }
        }, 2000); // 2 second delay for simulation
        
      } catch (error) {
        handleError(error, container, loadingMessage);
        reject(error);
      }
    });
  }
};

// Helper function to handle errors
function handleError(error, container, loadingMessage) {
  console.error('Error in MPA analysis:', error);
  
  // Remove loading message if it exists
  if (loadingMessage && loadingMessage.parentNode) {
    loadingMessage.parentNode.removeChild(loadingMessage);
  }
  
  // Show error message
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = 'Error in MPA analysis: ' + (error.message || 'Unknown error');
  
  if (container) {
    container.appendChild(errorMessage);
  } else {
    document.body.appendChild(errorMessage);
  }
}
