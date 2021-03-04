import * as THREE from 'three';

export default class PhysicsComponent {
  constructor(camera, pivot) {
    this.camera = camera;
    this.pivot = pivot;
    this.raycaster = new THREE.Raycaster();
  }

  getIntersectedObject(mouse) {
    this.raycaster.setFromCamera(mouse, this.camera);

    // todo find might be slow. change it to only work on the cubes and not the outlines.
    const intersects = this.raycaster.intersectObjects(
      this.pivot.children[0].children.filter((c) => c.banana !== undefined),
    );

    if (intersects.length > 0) {
      return intersects[0].object;
    }

    return null;
  }
}
