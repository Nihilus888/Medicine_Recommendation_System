import { UpdateFlags } from '@speckle/viewer';
import { ObjectLayers, SelectionExtension } from '@speckle/viewer';
import { Object3D, Vector3, Box3 } from 'three';

// Extending SelectionExtension class to add custom selection logic
class ExtendedSelection extends SelectionExtension {
  constructor(options = {}) {
    super(options); // Call the parent constructor
    this.dummyAnchor = new Object3D();
    this.metadataCallback = null; // Callback function to extract metadata
  }

  // Initialize the selection extension, adding the dummy anchor to the scene
  init() {
    this.dummyAnchor.layers.set(ObjectLayers.PROPS); 
    this.viewer.getRenderer().scene.add(this.dummyAnchor); 
  }

  // Method to set the metadata callback function
  setMetadataCallback(callback) {
    this.metadataCallback = callback;
  }

  // Override the selectObjects method to update gizmo and extract metadata when objects are selected
  selectObjects(ids, multiSelect = false) {
    super.selectObjects(ids, multiSelect); 
    this.extractMetadata(); // Extract metadata for selected objects
  }

  // Handle object click, updating gizmo and extracting metadata
  onObjectClicked(selection) {
    super.onObjectClicked(selection); // Call parent method
    this.extractMetadata(); // Extract metadata on object click
  }

  // Extract metadata for selected objects
  extractMetadata() {
    const metadata = Object.values(this.selectionRvs).map(selectedObj => ({
      batchId: selectedObj._batchId,
      geometryId: selectedObj.guid,
      geometryType: selectedObj.geometryType,
      speckleType: selectedObj.renderData?.speckleType || 'Unknown',
      materialHash: selectedObj._materialHash
    }));

    if (this.metadataCallback) {
      this.metadataCallback(metadata); // Pass extracted metadata to the callback
    }
  }

  // Handle double-click on objects, potentially setting camera view
  onObjectDoubleClick(event) {
    if (this.cameraProvider?.setCameraView) {
      this.cameraProvider.setCameraView(event); // Set camera view on double-click
    } else {
      console.warn('cameraProvider or setCameraView is undefined during onObjectDoubleClick');
    }
  }
}

export default ExtendedSelection;
