import { ProjectClientBase, ProjectActions, SketchForm } from "@seasketch/geoprocessing/client-core";

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
    // Example of registering a custom action
    actions.registerAction({
      id: 'mpa-analysis',
      title: 'MPA Analysis',
      description: 'Run MPA analysis on the current sketch',
      handler: async (sketch: SketchForm) => {
        console.log('Running MPA analysis for sketch:', sketch.properties?.name);
        // Implementation would go here
        return { success: true };
      }
    });
  }
  
  /**
   * Initialize any project-specific client-side functionality
   */
  async init() {
    await super.init();
    
    // Example of custom initialization
    console.log('MPA Project Client initialized');
  }
})();
