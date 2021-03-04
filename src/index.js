import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { renderer, scene, camera } from './context';
import InputComponent from './components/input';
import PhysicsComponent from './components/physics';
import RenderComponent from './components/render';
import PuzzleComponent from './components/puzzle';

const cubeSize = 3;

let intersectedCube;
let controls;
let inputComponent;
let physicsComponent;
let renderComponent;
let puzzleComponent;

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  // renderComponent.getPivot().rotation.y += 0.03;
  renderer.render(scene, camera);
};

const onCubeClick = (cube) => {
  renderComponent.destroyCube(cube);
};

const onMove = (mouse) => {
  const intersectedObject = physicsComponent.getIntersectedObject(mouse);

  // If we are pointing at a cube
  if (intersectedObject) {
    // If it's the same cube we're already pointing at, ignore
    if (intersectedCube === intersectedObject) {
      return;
    }

    // If we used to point at a different cube, deselect the previous cube
    if (intersectedCube) {
      renderComponent.deselectCube(intersectedCube);
    }

    // Select the newly pointed-at cube
    intersectedCube = intersectedObject;
    renderComponent.selectCube(intersectedCube);
  } else {
    // If we aren't pointing at any cube, deselect the previously pointed-at cube
    renderComponent.deselectCube(intersectedCube);
    intersectedCube = null;
  }
};

const onMouseClick = (mouse) => {
  // todo in the future this will be more than just a cube click
  onCubeClick(physicsComponent.getIntersectedObject(mouse));
};

const initComponents = () => {
  puzzleComponent = new PuzzleComponent();
  renderComponent = new RenderComponent(cubeSize);
  renderComponent.createPuzzleMesh(
    puzzleComponent.getCubesPositions(),
    puzzleComponent.getEmptyCubesPositions(),
  );
  inputComponent = new InputComponent();
  physicsComponent = new PhysicsComponent(renderComponent.getPivot());

  inputComponent.getObservable().subscribe(({ type, mouse }) => {
    switch (type) {
      case 'move':
        onMove(mouse);
        break;
      case 'click':
        onMouseClick(mouse);
        break;
      default:
    }
  });
};

const initRenderer = () => {
  renderer.setClearColor(0x9999ff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

const initOrbitControl = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(1, 0, 0);
  controls.rotateSpeed = 0.5;
};

const initCamera = () => {
  camera.position.z = cubeSize * 10;
  controls.update();
};

const init = () => {
  initRenderer();
  initComponents();
  initOrbitControl();
  initCamera();
  scene.add(renderComponent.getPivot());
};

const main = () => {
  init();
  animate();
};

main();
