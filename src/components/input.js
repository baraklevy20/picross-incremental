import * as THREE from 'three';
import { Observable, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default class InputController {
  constructor(renderer) {
    this.renderer = renderer;
    this.mouse = new THREE.Vector2();
  }

  getObservable() {
    return new Observable((subscriber) => {
      fromEvent(document, 'mousemove').subscribe((e) => {
        e.preventDefault();

        this.mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

        subscriber.next({
          type: 'move',
          mouse: this.mouse,
        });
      });

      fromEvent(document, 'pointerdown').subscribe(() => {
        this.touchTime = new Date();
      });

      fromEvent(document, 'pointerup')
        .pipe(filter(() => new Date() - this.touchTime < 100))
        .subscribe(() => {
          subscriber.next({
            type: 'click',
            mouse: this.mouse,
          });
        });

      fromEvent(document, 'touchstart').subscribe((e) => {
        this.mouse.x = (e.targetTouches[0].pageX
          / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(e.targetTouches[0].pageY
          / this.renderer.domElement.clientHeight) * 2 + 1;
      });
    });
  }
}
