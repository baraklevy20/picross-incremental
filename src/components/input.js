import * as THREE from 'three';
import { fromEvent, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { renderer } from '../context';

export default class InputController {
  constructor() {
    this.mouse = new THREE.Vector2();
    this.observable = new Subject();
    this.listenToInput();
  }

  listenToInput() {
    fromEvent(document, 'mousemove').subscribe((e) => {
      e.preventDefault();

      this.mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

      this.observable.next({
        type: 'move',
        mouse: this.mouse,
      });
    });

    fromEvent(document, 'pointerdown').subscribe(() => {
      this.touchTime = new Date();
    });

    fromEvent(document, 'pointerup')
      .pipe(filter(() => new Date() - this.touchTime < 200))
      .subscribe((e) => {
        this.observable.next({
          type: 'click',
          mouse: {
            ...this.mouse,
            button: e.button === 0 ? 'paint' : 'break',
          },
        });
      });

    fromEvent(document, 'touchstart').subscribe((e) => {
      this.mouse.x = (e.targetTouches[0].pageX
          / renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y = -(e.targetTouches[0].pageY
          / renderer.domElement.clientHeight) * 2 + 1;
    });
  }
}
