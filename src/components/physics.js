import * as THREE from 'three';

export default class PhysicsComponent {
  constructor(camera, pivot) {
    this.camera = camera;
    this.pivot = pivot;
    this.raycaster = new THREE.Raycaster();
  }

  getIntersectedObject(mouse) {
    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.pivot.children, true);

    if (intersects.length > 0) {
      return intersects[0].object.parent;
    }

    return null;
  }
}
