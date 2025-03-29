import { 
  MeasurementsExtension, 
  MeasurementType, 
  Units 
} from '@speckle/viewer';
import { Pane } from 'tweakpane';

// Measurement parameters
export const measurementsParams = {
  type: MeasurementType.POINTTOPOINT,
  vertexSnap: true,
  units: 'm',
  precision: 2,
  visible: true,
  enabled: true,
};

// Function to create the Measurements UI
export function makeMeasurementsUI(viewer) {
  const measurementsExtension = viewer.getExtension(MeasurementsExtension);
  const pane = new Pane({ title: 'Measurements', expanded: true });

  // Enable/Disable Measurements
  pane.addBinding(measurementsParams, 'enabled', { label: 'Enabled' })
    .on('change', () => {
      measurementsExtension.enabled = measurementsParams.enabled;
    });

  // Toggle Visibility
  pane.addBinding(measurementsParams, 'visible', { label: 'Visible' })
    .on('change', () => {
      measurementsExtension.options = { ...measurementsExtension.options, visible: measurementsParams.visible };
    });

  // Change Measurement Type
  pane.addBinding(measurementsParams, 'type', {
    label: 'Type',
    options: {
      PERPENDICULAR: MeasurementType.PERPENDICULAR,
      POINTTOPOINT: MeasurementType.POINTTOPOINT,
    },
  }).on('change', () => {
    measurementsExtension.options = { ...measurementsExtension.options, type: measurementsParams.type };
  });

  // Toggle Vertex Snap
  pane.addBinding(measurementsParams, 'vertexSnap', { label: 'Snap' })
    .on('change', () => {
      measurementsExtension.options = { ...measurementsExtension.options, vertexSnap: measurementsParams.vertexSnap };
    });

  // Change Units
  pane.addBinding(measurementsParams, 'units', {
    label: 'Units',
    options: Units,
  }).on('change', () => {
    measurementsExtension.options = { ...measurementsExtension.options, units: measurementsParams.units };
  });

  // Adjust Precision
  pane.addBinding(measurementsParams, 'precision', {
    label: 'Precision',
    step: 1,
    min: 1,
    max: 5,
  }).on('change', () => {
    measurementsExtension.options = { ...measurementsExtension.options, precision: measurementsParams.precision };
  });

  // Button to delete the last measurement
  pane.addButton({ title: 'Delete' })
    .on('click', () => {
      measurementsExtension.removeMeasurement();
    });

  // Button to clear all measurements
  pane.addButton({ title: 'Delete All' })
    .on('click', () => {
      measurementsExtension.clearMeasurements();
    });
}
