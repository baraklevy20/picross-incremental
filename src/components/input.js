import * as THREE from 'three';
import { Observable, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { renderer } from '../context';

export default class InputController {
  constructor() {
    this.mouse = new THREE.Vector2();
  }

  getObservable() {
    return new Observable((subscriber) => {
      fromEvent(document, 'mousemove').subscribe((e) => {
        e.preventDefault();

        this.mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

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
          / renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(e.targetTouches[0].pageY
          / renderer.domElement.clientHeight) * 2 + 1;
      });
    });
  }
}
