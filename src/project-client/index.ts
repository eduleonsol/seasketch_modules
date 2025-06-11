import MPAReport from '../clients/MPAReport';
import { MPAnalysisResult } from '../types';
import React from 'react';

// Define interfaces for SeaSketch types
declare global {
  interface Window {
    ReportManager?: {
      registerComponent: (id: string, component: React.ComponentType<any>) => void;
      registerReport: (config: {
        id: string;
        component: React.ComponentType<any>;
        title: string;
        description?: string;
        order?: number;
        enabledByDefault?: boolean;
      }) => void;
      showReport: (config: { id: string; props?: any }) => void;
    };
  }
}

interface SketchForm {
  id: string;
  name: string;
  properties: Record<string, any>;
  // Add other required properties
}

// Simple implementation of the project client
const projectClient = {
  // Initialize the project client
  async init() {
    console.log('[MPA] Initializing project client');
    
    // Register the MPA report component
    if (window.ReportManager) {
      window.ReportManager.registerComponent('mpa-analysis-report', MPAReport);
      
      window.ReportManager.registerReport({
        id: 'mpa-analysis-report',
        component: MPAReport,
        title: 'MPA Analysis',
        description: 'Marine Protected Area Analysis Report',
        order: 1,
        enabledByDefault: true
      });
    }
    
    return this;
  },
  
  // Register actions for the project
  async registerActions(actions: any) {
    if (!actions || !actions.registerAction) {
      console.warn('Actions API not available');
      return;
    }
    
    actions.registerAction({
      id: 'mpa-analysis',
      title: 'MPA Analysis',
      description: 'Run MPA analysis on the current sketch',
      handler: async (sketch: SketchForm) => {
        console.log('[MPA] Starting analysis for sketch:', sketch.properties?.name);
        
        try {
          // First, run the geoprocessing function
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              sketch,
              options: {
                analyzeFishingZones: true,
                includeHabitatImpact: true
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(`Analysis failed: ${response.statusText}`);
          }
          
          const result = await response.json() as MPAnalysisResult;
          console.log('[MPA] Analysis completed:', result);
          
          // Show the report with the results
          if (window.ReportManager?.showReport) {
            window.ReportManager.showReport({
              id: 'mpa-analysis-report',
              props: { result }
            });
          }
          
          return { 
            success: true, 
            message: 'MPA analysis completed successfully',
            data: result
          };
          
        } catch (error: unknown) {
          const err = error as Error;
          console.error('[MPA] Analysis error:', err);
          return { 
            success: false, 
            error: err.message || 'Failed to complete MPA analysis' 
          };
        }
      }
    });
  }
};

// Export the project client
export default projectClient;
