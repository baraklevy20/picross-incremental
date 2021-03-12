import * as THREE from 'three';
import { camera } from '../context';

export default class PhysicsComponent {
  constructor(pivot) {
    this.raycaster = new THREE.Raycaster();
  }

  getIntersectedObject(mouse) {
    if (!this.pivot) {
      return null;
    }
    this.raycaster.setFromCamera(mouse, camera);

    const intersects = this.raycaster.intersectObjects(this.pivot.children, true);

    if (intersects.length > 0) {
      return intersects[0].object.parent;
    }

    return null;
  }
}
