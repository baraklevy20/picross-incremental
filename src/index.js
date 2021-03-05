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
  // renderComponent.pivot.rotation.y += 0.03;
  renderer.render(scene, camera);
};

const onMove = (mouse) => {
  const newIntersectedCube = physicsComponent.getIntersectedObject(mouse);

  // If we are pointing at a cube
  if (newIntersectedCube) {
    // If it's the same cube we're already pointing at, ignore
    if (intersectedCube === newIntersectedCube) {
      return;
    }

    // If we used to point at a different cube, deselect the previous cube
    if (intersectedCube) {
      renderComponent.deselectCube(intersectedCube);
    }

    // Select the newly pointed-at cube
    intersectedCube = newIntersectedCube;
    renderComponent.selectCube(intersectedCube);
  } else {
    // If we aren't pointing at any cube, deselect the previously pointed-at cube
    renderComponent.deselectCube(intersectedCube);
    intersectedCube = null;
  }
};

const onMouseClick = (mouse) => {
  const clickedCube = physicsComponent.getIntersectedObject(mouse);

  if (clickedCube) {
    switch (clickedCube.state) {
      case 'empty':
        if (mouse.button === 'left') {
          renderComponent.destroyCube(clickedCube);
        } else if (mouse.button === 'right') {
          clickedCube.state = 'paintedEmpty';
          renderComponent.paintCube(clickedCube);
        }
        break;
      case 'part':
        if (mouse.button === 'left') {
          // todo add more logic here. split to a function 'onWrongBreak'
          clickedCube.state = 'brokenPart';
          renderComponent.setBrokenPartCube(clickedCube);
        } else if (mouse.button === 'right') {
          clickedCube.state = 'painted';
          renderComponent.paintCube(clickedCube);
        }
        break;
      case 'painted':
        if (mouse.button === 'right') {
          clickedCube.state = 'part';
          renderComponent.unpaintCube(clickedCube);
        }
        break;
      case 'paintedEmpty':
        if (mouse.button === 'right') {
          clickedCube.state = 'empty';
          renderComponent.unpaintCube(clickedCube);
        }
        break;
      default:
    }
  }
};

const initComponents = () => {
  puzzleComponent = new PuzzleComponent();
  renderComponent = new RenderComponent(cubeSize);
  renderComponent.createPuzzleMesh(puzzleComponent);
  inputComponent = new InputComponent();
  physicsComponent = new PhysicsComponent(renderComponent.pivot);

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
  scene.add(renderComponent.pivot);
};

const main = () => {
  // Remove font loader div
  document.getElementById('preloadfont').remove();
  init();
  animate();
};

// todo check compatibility
document.fonts.ready.then(main);
