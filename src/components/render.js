import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { renderer, camera } from '../context';

export default class RenderComponent {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    RenderComponent.initRenderer();
    this.initOrbitControl();
    this.initCamera();
  }

  static initRenderer() {
    renderer.setClearColor(0xc59e9e, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initOrbitControl() {
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.target.set(1, 0, 0);
    this.controls.rotateSpeed = 0.5;
  }

  initCamera() {
    camera.position.x = -this.cubeSize * 2;
    camera.position.y = this.cubeSize * 5;
    camera.position.z = this.cubeSize * 10;
    this.controls.update();
  }

  setPhysicsObservable(physicsObservable) {
    physicsObservable.subscribe(({ type, mesh }) => {
      if (type === 'move') {
        this.controls.enabled = !mesh;
      }
    });
  }
}
