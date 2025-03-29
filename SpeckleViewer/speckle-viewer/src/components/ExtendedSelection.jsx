import { UpdateFlags } from '@speckle/viewer';
import { ObjectLayers, SelectionExtension } from '@speckle/viewer'; // Updated import
import { Object3D, Vector3, Box3 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';// Correct import

class ExtendedSelection extends SelectionExtension {
  /** This object will receive the TransformControls translation */
  constructor(options = {}) {
    super(options);
    this.dummyAnchor = new Object3D();
    this.transformControls = undefined;
    this.lastGizmoTranslation = new Vector3();
    this.snapToGrid = true; // Enable snapping by default
    this.gridSize = 1; // Define the grid size
  }

  init() {
    /** We set the layers to PROPS so that the viewer regular pipeline ignores it */
    this.dummyAnchor.layers.set(ObjectLayers.PROPS);
    this.viewer.getRenderer().scene.add(this.dummyAnchor);
    this.initGizmo();
  }

  selectObjects(ids, multiSelect = false) {
    super.selectObjects(ids, multiSelect);
    this.updateGizmo(ids.length ? true : false);
  }

  onObjectClicked(selection) {
    /** Do whatever the base extension is doing */
    super.onObjectClicked(selection);

    /** Update the anchor and gizmo location */
    this.updateGizmo(selection && selection.hits && selection.hits.length > 0);
  }

  initGizmo() {
    const camera = this.viewer.getRenderer().renderingCamera;
    if (!camera) {
      throw new Error('Cannot init move gizmo with no camera');
    }

    /** Create a new TransformControls gizmo */
    this.transformControls = new TransformControls(
      camera,
      this.viewer.getRenderer().renderer.domElement
    );

    /** Attach the gizmo to the scene */
    this.viewer.getRenderer().scene.add(this.transformControls);

    /** These are the TransformControls events */
    this.transformControls.addEventListener('change', () => {
      /** We request a render each time we interact with the gizmo */
      this.viewer.requestRender();
    });

    this.transformControls.addEventListener('dragging-changed', (event) => {
      /** When we start dragging the gizmo, we disable the camera controls
       *  and re-enable them once we're done
       */
      const val = !!event.value;
      if (val) {
        this.cameraProvider.enabled = !val;
      } else {
        setTimeout(() => {
          this.cameraProvider.enabled = !val;
        }, 100);
      }
    });

    this.transformControls.addEventListener(
      'objectChange',
      this.onAnchorChanged.bind(this)
    );
  }

  /** This positions the anchor and gizmo to the center of the selected objects
   *  bounds. Note that a single selection might yield multiple individual objects
   *  to get selected
   */
  updateGizmo(attach) {
    const box = new Box3();
    for (const k in this.selectionRvs) {
      const batchObject = this.viewer
        .getRenderer()
        .getObject(this.selectionRvs[k]);
      if (!batchObject) continue;
      box.union(batchObject.aabb);
    }
    const center = box.getCenter(new Vector3());
    
    // Optionally, snap the center position to the grid
    if (this.snapToGrid) {
      this.snapToGridPosition(center);
    }

    this.dummyAnchor.position.copy(center);
    this.lastGizmoTranslation.copy(this.dummyAnchor.position);
    
    // Optionally, set a pivot point (can be the center or a specific point)
    const pivot = this.calculatePivotPoint();
    if (pivot) {
      this.dummyAnchor.position.copy(pivot);
    }

    if (this.transformControls) {
      if (attach) {
        this.transformControls.attach(this.dummyAnchor);
      } else {
        this.transformControls.detach();
      }
    }
  }

  /** This is where the transformation gets applied */
  onAnchorChanged() {
    /** We get the bounds of the entire group on rvs, since clicking
     *  on a single object might yield multiple objects (hosted elements,
     *  multiple display values, etc)
     */

    for (const k in this.selectionRvs) {
      const batchObject = this.viewer
        .getRenderer()
        .getObject(this.selectionRvs[k]);
      /** Only objects of type mesh can have batch objects.
       *  Lines and points do not
       */
      if (!batchObject) continue;
      /** This is where we moved the gizmo to */
      const anchorPos = new Vector3().copy(this.dummyAnchor.position);
      const anchorPosDelta = anchorPos.sub(this.lastGizmoTranslation);
      /** Apply the transformation */
      batchObject.transformTRS(
        anchorPosDelta.add(batchObject.translation),
        undefined,
        undefined,
        undefined
      );
    }

    this.lastGizmoTranslation.copy(this.dummyAnchor.position);
    this.viewer.requestRender(UpdateFlags.RENDER_RESET | UpdateFlags.SHADOWS);
  }

  // Function to snap the position to the grid
  snapToGridPosition(position) {
    position.x = Math.round(position.x / this.gridSize) * this.gridSize;
    position.y = Math.round(position.y / this.gridSize) * this.gridSize;
    position.z = Math.round(position.z / this.gridSize) * this.gridSize;
  }

  // Function to calculate a pivot point (for now, it averages the positions of all selected objects)
  calculatePivotPoint() {
    if (this.selectionRvs.length === 1) {
      return this.viewer
        .getRenderer()
        .getObject(this.selectionRvs[0])
        .position.clone();
    }

    const averagePosition = new Vector3();
    this.selectionRvs.forEach((id) => {
      const batchObject = this.viewer.getRenderer().getObject(id);
      if (batchObject) {
        averagePosition.add(batchObject.position);
      }
    });

    return averagePosition.divideScalar(this.selectionRvs.length);
  }
}

export default ExtendedSelection;
