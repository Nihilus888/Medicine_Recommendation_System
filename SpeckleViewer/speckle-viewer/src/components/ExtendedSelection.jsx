import { UpdateFlags } from '@speckle/viewer';
import { ObjectLayers, SelectionExtension } from '@speckle/viewer';
import { Object3D, Vector3, Box3 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

class ExtendedSelection extends SelectionExtension {
  constructor(options = {}) {
    super(options);
    this.dummyAnchor = new Object3D();
    this.transformControls = undefined;
    this.lastGizmoTranslation = new Vector3();
    this.snapToGrid = true;
    this.gridSize = 1;
    this.metadataCallback = null; 
  }

  init() {
    this.dummyAnchor.layers.set(ObjectLayers.PROPS);
    this.viewer.getRenderer().scene.add(this.dummyAnchor);
    this.initGizmo();
  }

  setMetadataCallback(callback) {
    this.metadataCallback = callback;
  }

  selectObjects(ids, multiSelect = false) {
    super.selectObjects(ids, multiSelect);
    this.updateGizmo(Object.keys(this.selectionRvs).length > 0);
    this.extractMetadata();
  }

  onObjectClicked(selection) {
    super.onObjectClicked(selection);
    this.updateGizmo(selection?.hits?.length > 0);
    this.extractMetadata();
  }

  initGizmo() {
    const camera = this.viewer.getRenderer().renderingCamera;
    if (!camera) {
      console.error('Cannot initialize gizmo without a camera');
      return;
    }

    this.transformControls = new TransformControls(
      camera,
      this.viewer.getRenderer().renderer.domElement
    );

    this.viewer.getRenderer().scene.add(this.transformControls);

    this.transformControls.addEventListener('change', () => {
      this.viewer.requestRender();
    });

    this.transformControls.addEventListener('dragging-changed', (event) => {
      if (this.cameraProvider) {
        this.cameraProvider.enabled = !event.value;
        if (!event.value) {
          setTimeout(() => {
            this.cameraProvider.enabled = true;
          }, 100);
        }
      } else {
        console.warn('cameraProvider is undefined during dragging-changed event');
      }
    });

    this.transformControls.addEventListener('objectChange', this.onAnchorChanged.bind(this));
  }

  updateGizmo(attach) {
    const box = new Box3();
    Object.values(this.selectionRvs).forEach((selectedObj) => {
      const batchObject = this.viewer.getRenderer().getObject(selectedObj._batchId);
      if (!batchObject) return;
      box.union(batchObject.aabb);
    });

    const center = box.getCenter(new Vector3());
    if (this.snapToGrid) this.snapToGridPosition(center);

    this.dummyAnchor.position.copy(center);
    this.lastGizmoTranslation.copy(center);

    const pivot = this.calculatePivotPoint();
    if (pivot) this.dummyAnchor.position.copy(pivot);

    if (this.transformControls) {
      attach ? this.transformControls.attach(this.dummyAnchor) : this.transformControls.detach();
    }
  }

  onAnchorChanged() {
    Object.values(this.selectionRvs).forEach((selectedObj) => {
      const batchObject = this.viewer.getRenderer().getObject(selectedObj._batchId);
      if (!batchObject) return;

      const translationDelta = this.dummyAnchor.position.clone().sub(this.lastGizmoTranslation);
      if (translationDelta.length() === 0) return;

      try {
        batchObject.transformTRS(
          batchObject.translation.clone().add(translationDelta),
          batchObject.rotation,
          batchObject.scale
        );
      } catch (error) {
        console.error(`Failed to apply transform to object: ${selectedObj._batchId}`, error);
      }
    });

    this.lastGizmoTranslation.copy(this.dummyAnchor.position);
    this.viewer.requestRender(UpdateFlags.RENDER_RESET | UpdateFlags.SHADOWS);
  }

  snapToGridPosition(position) {
    position.set(
      Math.round(position.x / this.gridSize) * this.gridSize,
      Math.round(position.y / this.gridSize) * this.gridSize,
      Math.round(position.z / this.gridSize) * this.gridSize
    );
  }

  calculatePivotPoint() {
    const values = Object.values(this.selectionRvs);
    if (!values.length) return null;

    if (values.length === 1) {
      const batchObject = this.viewer.getRenderer().getObject(values[0]._batchId);
      return batchObject?.position?.clone() ?? null;
    }

    const averagePosition = new Vector3();
    let validCount = 0;

    values.forEach((selectedObj) => {
      const batchObject = this.viewer.getRenderer().getObject(selectedObj._batchId);
      if (batchObject?.position) {
        averagePosition.add(batchObject.position);
        validCount++;
      }
    });

    return validCount > 0 ? averagePosition.divideScalar(validCount) : null;
  }

  extractMetadata() {
    const metadata = Object.values(this.selectionRvs).map(selectedObj => ({
      batchId: selectedObj._batchId,
      geometryId: selectedObj.guid,
      geometryType: selectedObj.geometryType,
      speckleType: selectedObj.renderData?.speckleType || 'Unknown',
    }));
  
    if (this.metadataCallback) {
      this.metadataCallback(metadata); // Pass extracted metadata
    }
  }

  onObjectDoubleClick(event) {
    if (this.cameraProvider?.setCameraView) {
      this.cameraProvider.setCameraView(event);
    } else {
      console.warn('cameraProvider or setCameraView is undefined during onObjectDoubleClick');
    }
  }
}

export default ExtendedSelection;
