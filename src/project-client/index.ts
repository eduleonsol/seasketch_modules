import { ProjectClientBase, ProjectActions, SketchForm, ReportManager } from '@seasketch/geoprocessing/client-core';
import MPAReport from '../clients/MPAReport';

/**
 * ProjectClient extends ProjectClientBase to provide project-specific
 * client-side functionality for the SeaSketch MPA module.
 */
export default new (class ProjectClient extends ProjectClientBase {
  constructor() {
    super();
  }

  /**
   * Register project-specific actions
   */
  async registerActions(actions: ProjectActions) {
    // Register the MPA analysis action
    actions.registerAction({
      id: 'mpa-analysis',
      title: 'MPA Analysis',
      description: 'Run MPA analysis on the current sketch',
      handler: async (sketch: SketchForm) => {
        console.log('Running MPA analysis for sketch:', sketch.properties?.name);
        
        try {
          // Dynamically load the client.js script from docs directory
          const clientModule = await import('../../docs/client.js');
          
          if (clientModule && typeof clientModule.default?.run === 'function') {
            console.log('MPA client module loaded, running analysis...');
            // Run the analysis using our client.js module
            const result = await clientModule.default.run(sketch);
            return result || { success: true };
          } else {
            console.error('MPA client module loaded but run function not found');
            return { success: false, error: 'Client module missing run function' };
          }
        } catch (err) {
          console.error('Error loading MPA client module', err);
          return { success: false, error: err.message || 'Unknown error' };
        }
      }
    });
  }
  
  /**
   * Initialize any project-specific client-side functionality
   */
  async init() {
    await super.init();
    
    // Register the MPA Report with ReportManager
    ReportManager.registerReport('mpa-analysis-report', {
      component: MPAReport,
      title: 'MPA Analysis Report',
      sortOrder: 0,
      enabledByDefault: true
    });
    
    console.log('MPA Project Client initialized');
  }
})();
