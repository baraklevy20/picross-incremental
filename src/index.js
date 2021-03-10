import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { renderer, scene, camera } from './context';
import InputComponent from './components/input';
import PhysicsComponent from './components/physics';
import RenderComponent from './components/render';
import PuzzleComponent from './components/puzzle';
import GameComponent from './components/game';
import DomComponent from './components/dom';

const cubeSize = 1;
let isPuzzleComplete = false;

let intersectedCube;
let controls;
let inputComponent;
let physicsComponent;
let renderComponent;
let puzzleComponent;
let gameComponent;
let domComponent;

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();

  if (isPuzzleComplete) {
    renderComponent.pivot.rotation.y += 0.03;
  } else {
    DomComponent.updateGameTime(gameComponent.gameStartTime);
  }

  renderer.render(scene, camera);
};

// todo move this entire function to render and let render subscribe to input observable
const onMove = (mouse) => {
  const newIntersectedCube = physicsComponent.getIntersectedObject(mouse);

  // If we are pointing at a cube
  if (newIntersectedCube) {
    controls.enabled = false;
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
    controls.enabled = true;
  }
};

const onMouseClick = (mouse) => {
  if (isPuzzleComplete) {
    return;
  }

  const clickedCubeMesh = physicsComponent.getIntersectedObject(mouse);

  if (clickedCubeMesh) {
    switch (clickedCubeMesh.cube.state) {
      case 'empty':
        if (mouse.button === 'left') {
          puzzleComponent.destroyCube(clickedCubeMesh.cube);
          renderComponent.destroyCube(clickedCubeMesh);
          gameComponent.onDestroyedCube();

          if (puzzleComponent.isSolved()) {
            console.log('good job');
            gameComponent.onPuzzleComplete();
            isPuzzleComplete = true;
          }
        } else if (mouse.button === 'right') {
          clickedCubeMesh.cube.state = 'paintedEmpty';
          renderComponent.paintCube(clickedCubeMesh);
        }
        break;
      case 'part':
        if (mouse.button === 'left') {
          // todo add more logic here. split to a function 'onWrongBreak'
          clickedCubeMesh.cube.state = 'brokenPart';
          renderComponent.setBrokenPartCube(clickedCubeMesh);
          puzzleComponent.onBrokenSolid();
        } else if (mouse.button === 'right') {
          clickedCubeMesh.cube.state = 'painted';
          renderComponent.paintCube(clickedCubeMesh);
        }
        break;
      case 'painted':
        if (mouse.button === 'right') {
          clickedCubeMesh.cube.state = 'part';
          renderComponent.unpaintCube(clickedCubeMesh);
        }
        break;
      case 'paintedEmpty':
        if (mouse.button === 'right') {
          clickedCubeMesh.cube.state = 'empty';
          renderComponent.unpaintCube(clickedCubeMesh);
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
  gameComponent = new GameComponent(puzzleComponent);
  domComponent = new DomComponent(gameComponent.getObservable());
  gameComponent.setDomObservable(domComponent.observable);

  domComponent.addUpgradesUI(gameComponent.upgrades);

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
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
};

const initOrbitControl = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(1, 0, 0);
  controls.rotateSpeed = 0.5;
};

const initCamera = () => {
  camera.position.x = -cubeSize * 2;
  camera.position.y = cubeSize * 5;
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