import { analyzeMPA } from '../';
import { genSampleSketch } from '@seasketch/geoprocessing/scripts/testing';

describe('MPA Analysis', () => {
  it('should calculate basic metrics for a simple polygon', async () => {
    const sketch = genSampleSketch({
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0]
        ]
      ]
    });

    const result = await analyzeMPA(sketch);
    
    expect(result.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metricId: 'mpa-total-area',
          value: expect.any(Number)
        })
      ])
    );
  });

  it('should include fishing zone metrics when analyzeFishingZones is true', async () => {
    const sketch = genSampleSketch({
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0]
        ]
      ]
    });

    const result = await analyzeMPA(sketch, { analyzeFishingZones: true });
    
    expect(result.metrics.some(m => m.metricId?.startsWith('fishing-zone-'))).toBe(true);
  });

  it('should include habitat impact metrics when includeHabitatImpact is true', async () => {
    const sketch = genSampleSketch({
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0]
        ]
      ]
    });

    const result = await analyzeMPA(sketch, { includeHabitatImpact: true });
    
    expect(result.metrics.some(m => m.metricId?.startsWith('habitat-'))).toBe(true);
  });
});
