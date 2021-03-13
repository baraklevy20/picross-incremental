import { Subject } from 'rxjs';
import * as THREE from 'three';
import { camera } from '../context';

export default class PhysicsComponent {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.observable = new Subject();
  }

  setInputObservable(inputObservable) {
    inputObservable.subscribe(({ type, mouse }) => {
      this.observable.next({ type, cube: this.getIntersectedObject(mouse), mouse });
    });
  }

  setMeshObservable(observable) {
    observable.subscribe((pivot) => {
      this.pivot = pivot;
    });
  }

  getIntersectedObject(mouse) {
    if (!this.pivot) {
      return null;
    }
    this.raycaster.setFromCamera(mouse, camera);

    const intersects = this.raycaster.intersectObjects(this.pivot.children, true);
    return intersects.length > 0 ? intersects[0].object.parent : null;
  }
}
